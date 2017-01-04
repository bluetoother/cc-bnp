/* jshint node: true */
'use strict';

var util = require('util'),
    EventEmitter = require('events').EventEmitter,
    SerialPort = require('serialport').SerialPort,
    _ = require('busyman'),
    Enum = require('enum'),
    Q = require('q'),
    blePacket = require('ble-packet'),
    debug = require('debug')('cc-bnp:hci');

var hciCmdMeta = require('./defs/hciCmdMeta'),
    BHCI = require('./defs/blehcidefs'),
    hci = require('./hci/bleHci');

function CcBnp() {}

util.inherits(CcBnp, EventEmitter);

CcBnp.prototype.init = function (spConfig, role, callback) {
    if (!_.isPlainObject(spConfig))
        throw new TypeError('spConfig should be an object');

    if (!_.isString(spConfig.path))
        throw new TypeError('spConfig.path should be a string');

    if (!_.isUndefined(spConfig.options) && !_.isPlainObject(spConfig.options))
        throw new TypeError('spConfig.options should be a string');

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
        options = spConfig.options || {},
        config = {
            baudRate: options.baudRate || 115200,
            rtscts: options.rtscts ||true,
            flowControl: options.flowControl ||true,
            autoOpen: false
        };

    sp = new SerialPort(path, config);
    hci.registerSp(sp);

    hci.openSp().then(function(result) {
        self.gap.deviceInit(roles.get(role).value, 5, new Buffer(16).fill(0), new Buffer(16).fill(0), 1).then(function (result) {
            var msg = result.collector.GapDeviceInitDone[0];

            delete msg.status;
            delete msg.dataPktLen;
            delete msg.numDataPkts;

            deferred.resolve(msg);
            self.emit('ready', msg);
        }, function(err) {
            deferred.reject(err);
        });
    }).fail(function (err) {
        deferred.reject(err);
    }).done();

    return deferred.promise.nodeify(callback);
};

CcBnp.prototype.close = function (callback) {
    var self = this,
        deferred = Q.defer();

    setTimeout(function() {
        hci.closeSp().then(function (result) {
            self.emit('closed');
            deferred.resolve(result);
        }).fail(function (err) {
            deferred.reject(err);
        }).done();
    }, 500);

    return deferred.promise.nodeify(callback);
};

CcBnp.prototype.hci = {};

CcBnp.prototype.l2cap = {};

CcBnp.prototype.att = {};

CcBnp.prototype.gatt = {};

CcBnp.prototype.gap = {};

CcBnp.prototype.util = {};

(function () {
    _.forEach(BHCI.SubGroupCmd, function (cmds, subGroup) {
        var bleSubGroup = subGroup.slice(0, 1).toLowerCase() + subGroup.slice(1);
        _.forEach(cmds._enumMap, function (value, cmd) {
            var bleCmd = cmd.slice(0, 1).toLowerCase() + cmd.slice(1),
                cmdName = subGroup + cmd;

            CcBnp.prototype[bleSubGroup][bleCmd] = function () {
                var deferred = Q.defer(),
                    arg = Array.prototype.slice.call(arguments),
                    data = {},
                    callback,
                    uuid;

                if (_.isObject(arg[0])) {
                    if (_.size(arg) === 2) { callback = arg[1]; }
                    data = arg[0];
                } else {
                    for (var i = 0; i < hciCmdMeta[cmdName].params.length; i++) {
                        data[hciCmdMeta[cmdName].params[i]] = arg[i];
                    }

                    if (arg.length > hciCmdMeta[cmdName].params.length) {

                        if (_.isFunction(arg[arg.length - 1])) {
                            callback = arg.splice(arg.length - 1, 1)[0];
                        }

                        if(arg.length > hciCmdMeta[cmdName].params.length && _.indexOf(BHCI.cmdWithUuid, cmdName) > -1) {
                            uuid = arg.splice(arg.length - 1, 1)[0];

                            if (_.isNumber(uuid)) {
                                uuid = '0x' + uuid.toString(16);
                            } else if (_.isString(uuid) && !_.startsWith(uuid, '0x')) {
                                uuid = '0x' + uuid;
                            }

                            data.uuid = uuid.toLowerCase();
                        }
                    }
                }

                hci.execCmd(subGroup, cmd, data).then(function (result) {
                    deferred.resolve(result);
                }).fail(function (err) {
                    deferred.reject(err);
                }).done();

                return deferred.promise.nodeify(callback);
            };

        });
    });
})();

CcBnp.prototype.att.readMultiReq = readMultiReq;
CcBnp.prototype.gatt.readMultiCharValues = readMultiReq;
CcBnp.prototype.att.readMultiRsp = readMultiRsp;

CcBnp.prototype.regChar = function (regObj) {
    if (!_.isPlainObject(regObj))
        throw new TypeError('regObj should be an object');

    if ((!isRealNumber(regObj.uuid) && !_.isString(regObj.uuid)))
        throw new TypeError('regObj.uuid should be a string or a number');

    if (_.isNumber(regObj.uuid)) { 
        regObj.uuid = '0x' + regObj.uuid.toString(16); 
    } else if (_.isString(regObj.uuid) && !_.startsWith(regObj.uuid, '0x')) {
        regObj.uuid = '0x' + regObj.uuid;
    }
    
    blePacket.addMeta(regObj.uuid, { params: regObj.params, types: regObj.types });
};

CcBnp.prototype.regUuidHdlTable = function (connHdl, uuidHdlTable) {
    if (!isRealNumber(connHdl)) 
        throw new TypeError('connHdl must be a number.');

    if (!_.isPlainObject(uuidHdlTable)) 
        throw new TypeError('table must be an object');

    if (!hci.uuidHdlTable[connHdl]) {
        hci.uuidHdlTable[connHdl] = uuidHdlTable;
    } else {
        _.forEach(uuidHdlTable, function (uuid, hdl) {
            if (_.isNumber(uuid)) { 
                hci.uuidHdlTable[connHdl][hdl] = '0x' + uuid.toString(16); 
            } else if (_.isString(uuid) && !_.startsWith(uuid, '0x')) {
                hci.uuidHdlTable[connHdl][hdl] = '0x' + uuid;
            } else {
                hci.uuidHdlTable[connHdl][hdl] = uuid;
            }
        });
    }
};

CcBnp.prototype.regTimeoutConfig = function (connHdl, timeoutConfig) {
    if (!isRealNumber(connHdl)) 
        throw new TypeError('connHdl must be a number.'); 

    if (!_.isPlainObject(timeoutConfig)) 
        throw new TypeError('timeoutConfig must be an object.'); 

    if (!isRealNumber(timeoutConfig.level1) && !_.isUndefined(timeoutConfig.level1)) 
        throw new TypeError('timeoutConfig.level1 must be a number.'); 
    
    if (!isRealNumber(timeoutConfig.level2) && !_.isUndefined(timeoutConfig.level2))
        throw new TypeError('timeoutConfig.level2 must be a number.'); 

    if (!isRealNumber(timeoutConfig.scan) && !_.isUndefined(timeoutConfig.scan))
        throw new TypeError('timeoutConfig.scan must be a number.'); 


    hci.timeoutCfgTable[connHdl] = timeoutConfig;
};

var ccBnp = new CcBnp();

/***************************************************/
/*** Event transducer                            ***/
/***************************************************/
var attEvtArr = [
    'AttExchangeMtuReq', 'AttFindInfoReq', 'AttFindByTypeValueReq', 'AttReadByTypeReq', 
    'AttReadReq', 'AttReadBlobReq', 'AttReadMultiReq', 'AttReadByGrpTypeReq', 'AttWriteReq',
    'AttPrepareWriteReq', 'AttExecuteWriteReq'
];

_.forEach(attEvtArr, function (evtName) {
    hci.on(evtName, function (data) {
        var msg = {
            type: 'attReq',
            data: data
        };
        ccBnp.emit('ind', msg);
    });
});

hci.on('GapLinkEstablished', function (data) {
    var msg = {
        type: 'linkEstablished',
        data: data.data
    };
    delete msg.data.status;
    delete msg.data.addrType;
    ccBnp.emit('ind', msg);
});

hci.on('GapLinkTerminated', function (data) {
    var msg = {
        type: 'linkTerminated',
        data: data.data
    };

    delete msg.data.status;
    ccBnp.emit('ind', msg);
});

hci.on('GapLinkParamUpdate', function (data) {
    var msg = {
        type: 'linkParamUpdate',
        data: data.data
    };
    delete msg.data.status;
    ccBnp.emit('ind', msg);
});

hci.on('AttHandleValueNoti', function (data) {
    var msg = {
        type: 'attNoti',
        data: data.data
    };
    delete msg.data.status;
    delete msg.data.pduLen;
    ccBnp.emit('ind', msg);
});

hci.on('AttHandleValueInd', function (data) {
    var msg = {
        type: 'attInd',
        data: data.data
    };
    delete msg.data.status;
    delete msg.data.pduLen;
    ccBnp.emit('ind', msg);
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
    ccBnp.emit('ind', msg);
});

hci.on('GapPasskeyNeeded', function (data) {
    var msg = {
        type: 'passkeyNeeded',
        data: data.data
    };
    delete msg.data.status;
    ccBnp.emit('ind', msg);
});

hci.on('GapBondComplete', function (data) {
    var msg = {
        type: 'bondComplete',
        data: data.data
    };
    delete msg.data.status;
    ccBnp.emit('ind', msg);
});

hci.on('error', function (err) {
    ccBnp.emit('error', err);
});

/***************************************************/
/*** Overwrite command                           ***/
/***************************************************/
function readMultiReq (connHandle, handles, uuids, callback) {
    var self = this, 
        deferred = Q.defer(),
        uuidHandleTable,
        charToResolve = [],
        value = {},
        pduLen = 0,
        evtObj,
        opcode,
        readMulti = false;

    if (!uuids) {
        uuids = [];
    } else if (_.isFunction(uuids)) {
        callback = uuids;
        uuids = [];
    }

    getUuids(connHandle, handles, uuids).then(function (uuidHdlTable) {
        uuidHandleTable = uuidHdlTable;
        _.forEach(uuidHdlTable, function (uuid) {
            var charTypes;

            if (blePacket.getMeta(uuid)) {
                charTypes = blePacket.getMeta(uuid).types;
                if (!_.includes(charTypes, 'string') && !_.includes(charTypes, 'uuid')) readMulti = true;
            }
        });

        if (readMulti) {
            charToResolve.push((function () {
                return hci.execCmd('Att', 'ReadMultiReq', {connHandle: connHandle, handles: handles});
            }()));
        } else {
            _.forEach(uuidHdlTable, function (uuid, hdl) {
                charToResolve.push((function () {
                    return hci.execCmd('Att', 'ReadReq', {connHandle: connHandle, handle: _.parseInt(hdl), uuid: uuid});
                }()));
            });
        }

        return Q.all(charToResolve);
    }).then(function (result) {
        if (readMulti) {
            blePacket.parse(uuidHandleTable, result.collector.AttReadMultiRsp[0].value, function (err, parsedData) {
                if (err) 
                    deferred.reject(err);
                else {
                    result.collector.AttReadMultiRsp[0].value = parsedData;
                    deferred.resolve(result);
                }
            });
        } else {
            if ( self.readMultiReq ) {
                opcode = 64782;
            } else {
                opcode = 64910;
            }

            _.forEach(result, function (readRsp, i) {
                pduLen += readRsp.collector.AttReadRsp[0].pduLen;
                value[handles[i]] = readRsp.collector.AttReadRsp[0].value;
            });

            evtObj = {
                status: 0,
                opcode: opcode,
                dataLen: 0,
                payload: new Buffer(0),
                collector: {
                    AttReadMultiRsp: {
                        status: 0,
                        connHandle: connHandle,
                        pduLen: pduLen,
                        value: value
                    }
                }
            };
            deferred.resolve(evtObj);
        }
    }).fail(function (err) {
        deferred.reject(err);
    }).done();

    return deferred.promise.nodeify(callback);
}

function readMultiRsp(connHandle, value, uuids, callback) {
    var deferred = Q.defer(),
        handles = [],
        charBuf,
        sendBuf = new Buffer([]);

    if (!uuids) {
        uuids = [];
    } else if (_.isFunction(uuids)) {
        callback = uuids;
        uuids = [];
    }

    if (Buffer.isBuffer(value)) {
        return hci.execCmd('Att', 'ReadMultiRsp', {connHandle: connHandle, value: value}, callback);
    } else {
        _.forEach(value, function (val, hdl) {
            handles.push(hdl);
        });

        getUuids(65534, handles, uuids).then(function (uuidHdlTable) {
            _.forEach(uuidHdlTable, function (uuid, hdl) {
                charBuf = blePacket.frame(uuid, value[hdl]);
                sendBuf = Buffer.concat([sendBuf, charBuf]);
            });
            return hci.execCmd('Att', 'ReadMultiRsp', {connHandle: connHandle, value: sendBuf});
        }).then(function () {
            deferred.resolve();
        }).fail(function (err) {
            deferred.reject(err);
        }).done();
    }

    return deferred.promise.nodeify(callback);
}

function getUuids(connHandle, handles, uuids) {
    var deferred = Q.defer(),
        dataObjs = [],
        uuidHdlTable = {};

    if (_.size(handles) !== _.size(uuids)) {
        hci.execCmd('Gatt', 'DiscAllChars', {connHandle: connHandle, startHandle: 1, endHandle: 65535})
        .then(function (result) {
            _.forEach(result.collector.AttReadByTypeRsp, function (dataObj) {
                for (var key in dataObj.data) {
                    if (_.startsWith(key, 'attrVal'))
                        dataObjs.push(dataObj.data[key]);
                }
            });

            _.forEach(dataObjs, function (data) {
                _.forEach(handles, function(handle) {
                    if (data.hdl === handle)
                        uuidHdlTable[handle] = data.uuid;
                });
            });

            deferred.resolve(uuidHdlTable);
        }).fail(function (err) {
            deferred.reject(err);
        }).done();
    } else {
        _.forEach(handles, function (handle, i) {
            uuidHdlTable[handle] = uuids[i];
        });
        deferred.resolve(uuidHdlTable);
    }

    return deferred.promise;
}

function isRealNumber(val) {
    return (_.isNumber(val) && !_.isNaN(val));
}

module.exports = ccBnp;