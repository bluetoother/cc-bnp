'use strict';

var util = require('util'),
    EventEmitter = require('events').EventEmitter,
    SerialPort = require('serialport').SerialPort,
    _ = require('lodash'),
    Enum = require('enum'),
    Q = require('q');;

var hciCmdMeta = require('./lib/hci/HciCmdMeta'),
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
        self.gap.deviceInit(roles.get(role).value, 5, new Buffer(16), new Buffer(16), 1).then(function (result) {
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

                hci.execCmd(subGroup, cmd, data).then(function(result) {
                    deferred.resolve(result);
                }, function(err) {
                    deferred.reject(err);
                });

                return deferred.promise.nodeify(callback);
            };

        });
    });
})();

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
            mitm: data.data.authState & 0x04,
            bond: data.data.authState & 0x01,
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
