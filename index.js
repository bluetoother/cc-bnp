'use strict';

var util = require('util'),
    EventEmitter = require('events').EventEmitter,
    SerialPort = require('serialport').SerialPort,
    _ = require('lodash'),
    Enum = require('enum'),
    Q = require('q');

var hciCmdMeta = require('./lib/hci/HciCmdMeta'),
    hciCharMeta = require('./lib/hci/HciCharMeta'),
    charDiscrim = require('./lib/hci/HciCharDiscriminator'),
    charBuild = require('./lib/hci/HciCharBuilder'),
    BHCI = require('./lib/defs/blehcidefs'),
    hci = require('./lib/hci/bleHci');

function CcBnp() {}

util.inherits(CcBnp, EventEmitter);

CcBnp.prototype.init = function (spConfig, role, callback) {
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

CcBnp.prototype.close = function (callback) {
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
            var bleCmd = _.camelCase(cmd),
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

                        if(arg.length > hciCmdMeta[cmdName].params.length) {
                            uuid = arg.splice(arg.length - 1, 1)[0];
                        }
                    }
                }

                if(uuid) {
                    data.uuid = uuid;
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

CcBnp.prototype.regCharMeta = function (regObj) {
    if (hciCharMeta[regObj.uuid]) { throw new Error('Characteristic uuid alreadt exist.'); }

    hciCharMeta[regObj.uuid] = {
        params: regObj.params,
        types: regObj.types
    };
};

/***************************************************/
/*** Overwrite command                          ***/
/***************************************************/
function readMulti (connHandle, handles, uuids, callback) {
    var self = this,
        deferred = Q.defer(),
        charToResolve = [],
        uuidToResolve = [],
        value = {},
        uuid = ( uuids || {} ),
        pduLen = 0,
        evtObj,
        opCode,
        uuidFlag = 0;

    for (var i = 0; i < (_.size(handles)); i += 1) {
        if(!uuid['uuid' + i]) {
            uuidToResolve.push((function () {
                var deferred = Q.defer(),
                    count = i;

                hci.execCmd('Gatt', 'DiscAllChars', {connHandle: connHandle, startHandle: handles['handle' + i] - 1, endHandle: handles['handle' + i]}).then(function (result) {
                    uuid['uuid' + count] = result[1].AttReadByTypeRsp0.data.attrVal0.uuid;
                    deferred.resolve();
                }).fail(function (err) {
                    deferred.reject(err);
                });

                return deferred.promise.nodeify(callback);
            }()));
        }
    }

    Q.all(uuidToResolve).then(function () {
        _.forEach(uuid, function (val, key) {
            if (hciCharMeta[val]) {
                _.forEach(hciCharMeta[val].types, function (type) {
                    if (type === 'string' || type === 'uuid') { uuidFlag = 1; }
                });
            } else {
                uuidFlag = 1;
            }
        });

        if (uuidFlag === 1) {
            for (var i = 0; i < (_.size(handles)); i += 1) {
                charToResolve.push((function () {
                    return hci.execCmd('Att', 'ReadReq', {connHandle: connHandle, handle: handles['handle' + i], uuid: uuid['uuid' + i]});
                }()));
            }
        } else {
            charToResolve.push((function () {
                return hci.execCmd('Att', 'ReadMultiReq', {connHandle: connHandle, handles: handles});
            }()));
        }
    }).then(function () {
        return Q.all(charToResolve);
    }).then(function (result) {
        if (uuidFlag === 1) {
            if ( self.readMultiReq ) {
                opCode = 64782;
            } else {
                opCode = 64910;
            }

            for (var i = 0; i < result.length; i += 1) {
                pduLen += result[i][1].AttReadRsp.pduLen;
                value[handles['handle' + i]] = result[i][1].AttReadRsp.value;
            }
            evtObj = [
                { 
                    GapCmdStatus: {
                        status: 0,
                        opCode: opCode,
                        dataLen: 0,
                        payload: new Buffer(0)
                    }
                },
                {
                    AttReadMultiRsp: {
                        status: 0,
                        connHandle: connHandle,
                        pduLen: pduLen,
                        value: value
                    }
                }
            ];
            deferred.resolve(evtObj);
        } else {
            evtObj = result[0];
            charDiscrim(uuid).getCharValPacket(evtObj[1].AttReadMultiRsp.value).then(function (result) {
                evtObj[1].AttReadMultiRsp.value = {};
                for (var i = 0; i < (_.size(result)); i += 1) {
                    evtObj[1].AttReadMultiRsp.value[handles['handle' + i]] = result['uuid' + i];
                }
                deferred.resolve(evtObj);
            });
           
        }
    }).fail(function (err) {
        deferred.reject(err);
    });

    return deferred.promise.nodeify(callback);
}

CcBnp.prototype.att.readMultiReq = readMulti;
CcBnp.prototype.gatt.readMultiCharValues = readMulti;

var ccBnp = new CcBnp();

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

module.exports = ccBnp;
