'use strict';

var util = require('util'),
    EventEmitter = require('events').EventEmitter,
    SerialPort = require('serialport').SerialPort,
    _ = require('lodash'),
    Enum = require('enum'),
    Q = require('q');

var hciCmdMeta = require('./lib/hci/HciCmdMeta'),
    hciCharDisc = require('./lib/hci/HciCharDiscriminator'),
    BHCI = require('./lib/defs/blehcidefs'),
    hci = require('./lib/hci/bleHci');

function CcBpn() {}

util.inherits(CcBpn, EventEmitter);

CcBpn.prototype.init = function (spConfig, role, callback) {
    var self = this,
        deferred = Q.defer(),
        roles = new Enum({
            'broadcaster': 0x0001,
            'observer': 0x0002,
            'peripheral': 0x0004,
            'central': 0x0008,
            'central_broadcaster': 0x0009,
            'peripheral_observer': 0x0006
        }),
        sp, 
        path = spConfig.path, 
        config = spConfig.options;

    sp = new SerialPort(path, config, false);
    hci.registerSp(sp);
    hci.openSp().then(function(result) {
        self.gap.deviceInit(roles.get(role).value, 5, new Buffer(16).fill(0), new Buffer(16).fill(0), 1).then(function (result) {
            var msg = result[1].GapDeviceInitDone;

            delete msg.status;
            delete msg.dataPktLen;
            delete msg.numDataPkts;
            deferred.resolve(msg);
            self.emit('ready', msg);
        }, function(err) {
            deferred.reject(err);
        });
    }, function(err) {
        deferred.reject(err);
    });

    return deferred.promise.nodeify(callback);
};

CcBpn.prototype.close = function (callback) {
    var self = this,
        deferred = Q.defer();

    setTimeout(function() {
        hci.closeSp().then(function (result) {
            self.emit('closed');
            deferred.resolve(result);
        }, function(err) {
            deferred.reject(err);
        });
    }, 500);

    return deferred.promise.nodeify(callback);
};

CcBpn.prototype.hci = {};

CcBpn.prototype.l2cap = {};

CcBpn.prototype.att = {};

CcBpn.prototype.gatt = {};

CcBpn.prototype.gap = {};

CcBpn.prototype.util = {};


(function () {
    _.forEach(BHCI.SubGroupCmd, function (cmds, subGroup) {
        var bleSubGroup = subGroup.slice(0, 1).toLowerCase() + subGroup.slice(1);
        _.forEach(cmds._enumMap, function (value, cmd) {
            var bleCmd = _.camelCase(cmd),
                cmdName = subGroup + cmd;

            CcBpn.prototype[bleSubGroup][bleCmd] = function () {
                var deferred = Q.defer(),
                    arg = Array.prototype.slice.call(arguments),
                    data = {},
                    callback;

                if (arg.length === hciCmdMeta[cmdName].params.length + 1) {
                    callback = arg.splice(arg.length - 1, 1)[0];
                }
                for (var i = 0; i < arg.length; i++) {
                    data[hciCmdMeta[cmdName].params[i]] = arg[i];
                }

                hci.execCmd(subGroup, cmd, data).then(function (result) {
                    deferred.resolve(result);
                }, function(err) {
                    deferred.reject(err);
                });

                return deferred.promise.nodeify(callback);
            };

        });
    });
})();

/***************************************************/
/*** Overwrite command                          ***/
/***************************************************/
CcBpn.prototype.att.readReq = function (connHandle, handle, callback) {
    var deferred = Q.defer(),
        uuid,
        charDisc,
        charObj;

    hci.execCmd('Gatt', 'DiscAllChars', {connHandle: connHandle, startHandle: handle-1, endHandle: handle}).then(function (result) {
        var charObj = result[1].AttReadByTypeRsp0.data.attrVal0;
        uuid = '0x';
        for(var j = charObj.length; j > 3; j -= 1) {
            if (charObj[j - 1] <= 15) {
                uuid += '0' + charObj[j - 1].toString(16);
            } else {
                uuid += charObj[j - 1].toString(16);
            }
        }
        charDisc = hciCharDisc(uuid);
        return hci.execCmd('Att', 'ReadReq', {connHandle: connHandle, handle: handle});
    }).then(function (result) {
        charObj = result;
        return charDisc.getCharValPacket(result[1].AttReadRsp.value);
    }).then(function (result) {
        charObj[1].AttReadRsp.value = result;
        deferred.resolve(charObj);
    }).fail(function (err) {
        deferred.reject(err);
    });
    
    return deferred.promise.nodeify(callback);
};

CcBpn.prototype.att.readByTypeReq = function (connHandle, startHandle, endHandle, type, callback) {
    var deferred = Q.defer(),
        uuid = '0x',
        charDisc,
        count = 0, 
        total = 0,
        temp = [];

    for(var j = type.length; j > 0; j -= 1) {
        if (type[j - 1] <= 15) {
            uuid += '0' + type[j - 1].toString(16);
        } else {
            uuid += type[j - 1].toString(16);
        }
    }
    charDisc = hciCharDisc(uuid);

    hci.execCmd('Att', 'ReadByTypeReq', {connHandle: connHandle, startHandle: startHandle, endHandle: endHandle, type: type}).then(function (result) {
        charDisc.on('parsed', function (value) {
            temp.push(value);
            count += 1;
            if (count === total) {
                count = 0;
                for (var i = 0; i < (_.keys(result[1]).length); i += 1) {
                    var charObj = result[1]['AttReadByTypeRsp' + i];
                    if (charObj.status === 0) { 
                        for (var j = 0; j < (_.keys(charObj.data).length / 2); j += 1) {
                            result[1]['AttReadByTypeRsp' + i].data['attrVal' + j] = temp[count];
                            count += 1;
                        }
                    }
                }
                deferred.resolve(result);
            }
        });

        _.forEach(result[1], function (evtObj) {
            if (evtObj.status === 0) {
                total += _.keys(evtObj.data).length / 2;
            }
        });

        for (var i = 0; i < (_.keys(result[1]).length); i += 1) {
            var charObj = result[1]['AttReadByTypeRsp' + i];
            if (charObj.status === 0) { 
                for (var j = 0; j < (_.keys(charObj.data).length / 2); j += 1) {
                    charDisc.getCharValPacket(charObj.data['attrVal' + j]);
                }
            }
        }
    }).fail(function (err) {
        deferred.reject(err);
    });
    
    return deferred.promise.nodeify(callback);
};

//TODO AttReadBlobReq
//TODO AttReadMultiReq

CcBpn.prototype.gatt.readCharValue = function (connHandle, handle, callback) {
    var deferred = Q.defer(),
        uuid,
        charDisc,
        charObj;

    hci.execCmd('Gatt', 'DiscAllChars', {connHandle: connHandle, startHandle: handle-1, endHandle: handle}).then(function (result) {
        var charObj = result[1].AttReadByTypeRsp0.data.attrVal0;
        uuid = '0x';
        for(var j = charObj.length; j > 3; j -= 1) {
            if (charObj[j - 1] <= 15) {
                uuid += '0' + charObj[j - 1].toString(16);
            } else {
                uuid += charObj[j - 1].toString(16);
            }
        }
        charDisc = hciCharDisc(uuid);
        return hci.execCmd('Gatt', 'ReadCharValue', {connHandle: connHandle, handle: handle});
    }).then(function (result) {
        charObj = result;
        return charDisc.getCharValPacket(result[1].AttReadRsp.value);
    }).then(function (result) {
        charObj[1].AttReadRsp.value = result;
        deferred.resolve(charObj);
    }).fail(function (err) {
        deferred.reject(err);
    });
    
    return deferred.promise.nodeify(callback);
};

CcBpn.prototype.gatt.readUsingCharUuid = function (connHandle, startHandle, endHandle, type, callback) {
    var deferred = Q.defer(),
        uuid = '0x',
        charDisc,
        count = 0, 
        total = 0,
        temp = [];

    for(var j = type.length; j > 0; j -= 1) {
        if (type[j - 1] <= 15) {
            uuid += '0' + type[j - 1].toString(16);
        } else {
            uuid += type[j - 1].toString(16);
        }
    }
    charDisc = hciCharDisc(uuid);

    hci.execCmd('Gatt', 'ReadUsingCharUuid', {connHandle: connHandle, startHandle: startHandle, endHandle: endHandle, type: type}).then(function (result) {
        charDisc.on('parsed', function (value) {
            temp.push(value);
            count += 1;
            if (count === total) {
                count = 0;
                for (var i = 0; i < (_.keys(result[1]).length); i += 1) {
                    var charObj = result[1]['AttReadByTypeRsp' + i];
                    if (charObj.status === 0) { 
                        for (var j = 0; j < (_.keys(charObj.data).length / 2); j += 1) {
                            result[1]['AttReadByTypeRsp' + i].data['attrVal' + j] = temp[count];
                            count += 1;
                        }
                    }
                }
                deferred.resolve(result);
            }
        });

        for (var i = 0; i < (_.keys(result[1]).length); i += 1) {
            var charObj = result[1]['AttReadByTypeRsp' + i];
            if (charObj.status === 0) { 
                for (var j = 0; j < (_.keys(charObj.data).length / 2); j += 1) {
                    total += 1;
                    charDisc.getCharValPacket(charObj.data['attrVal' + j]);
                }
            }
        }
    }).fail(function (err) {
        deferred.reject(err);
    });
    
    return deferred.promise.nodeify(callback);
};

//TODO GattReadLongCharValue
//TODO GattReadMultiReq
/***************************************************/
/*** ble-shepherd command                        ***/
/***************************************************/
CcBpn.prototype.att.readReqWithUuid = function (connHandle, handle, uuid, callback) {
    var deferred = Q.defer(),
        charDisc = hciCharDisc(uuid),
        charObj;

    hci.execCmd('Att', 'ReadReq', {connHandle: connHandle, handle: handle}).then(function (result) {
        charObj = result;
        return charDisc.getCharValPacket(result[1].AttReadRsp.value);
    }).then(function (result) {
        charObj[1].AttReadRsp.value = result;
        deferred.resolve(charObj);
    }).fail(function (err) {
        deferred.reject(err);
    });
    
    return deferred.promise.nodeify(callback);
};

/***************************************************/
/***                                             ***/
/***************************************************/
var ccBpn = new CcBpn();

hci.on('GapLinkEstablished', function (data) {
    var msg = {
        type: 'linkEstablished',
        data: data.data
    };
    delete msg.data.status;
    delete msg.data.addrType;
    ccBpn.emit('ind', msg);
});

hci.on('GapLinkTerminated', function (data) {
    var msg = {
        type: 'linkTerminated',
        data: data.data
    };
    delete msg.data.status;
    ccBpn.emit('ind', msg);
});

hci.on('GapLinkParamUpdate', function (data) {
    var msg = {
        type: 'linkParamUpdate',
        data: data.data
    };
    delete msg.data.status;
    ccBpn.emit('ind', msg);
});

hci.on('AttHandleValueNoti', function (data) {
    var msg = {
        type: 'attNoti',
        data: data.data
    };
    delete msg.data.status;
    delete msg.data.pduLen;
    ccBpn.emit('ind', msg);
});

hci.on('AttHandleValueInd', function (data) {
    var msg = {
        type: 'attInd',
        data: data.data
    };
    delete msg.data.status;
    delete msg.data.pduLen;
    ccBpn.emit('ind', msg);
});

hci.on('GapAuthenticationComplete', function (data) {
    var msg = {
        type: 'authenComplete',
        data: {
            connHandle: data.data.connHandle,
            mitm: (data.data.authState & 0x04) >> 2,
            bond: (data.data.authState & 0x01),
            ltk: data.data.dev_ltk,
            div: data.data.dev_div,
            rand: data.data.dev_rand
        }
    };
    ccBpn.emit('ind', msg);
});

hci.on('GapPasskeyNeeded', function (data) {
    var msg = {
        type: 'passkeyNeeded',
        data: data.data
    };
    delete msg.data.status;
    ccBpn.emit('ind', msg);
});

hci.on('GapBondComplete', function (data) {
    var msg = {
        type: 'bondComplete',
        data: data.data
    };
    delete msg.data.status;
    ccBpn.emit('ind', msg);
});

module.exports = ccBpn;
