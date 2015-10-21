'use strict';

var util = require('util'),
    EventEmitter = require('events').EventEmitter,
    _ = require('lodash'),
    Q = require('q');

var BHCI = require('../defs/blehcidefs'),
    BDEFS = require('../defs/bledefs'),
    rawUnit = require('./bleRawUnit'),
    cmdBuilder = require('./HciCmdBuilder'),
    evtDiscrim = require('./HciEvtDiscriminator');

function BleHci() {
    this.txQueue = [];
    this.cmdPromiseHolders = {
        // cmdName: [cmdStore, ... ]
    };

    this.isSpining = function () {  
        return rawUnit.isSpining();
    };

    this.registerSp = function (sp) {
       rawUnit.registerSp(sp);
    };

    this.openSp = function (callback) {
        var deferred = Q.defer();

        rawUnit.openSp().then(function () {
            deferred.resolve();
        });

        return deferred.promise.nodeify(callback);
    };

    this.closeSp = function (callback) {
        var deferred = Q.defer();

        rawUnit.closeSp().then(function () {
            deferred.resolve();
        });

        return deferred.promise.nodeify(callback);
    };
};

util.inherits(BleHci, EventEmitter);
var bleHci = new BleHci();

/*************************************************************************************************/
/*** Event Listener                                                                            ***/
/*************************************************************************************************/
rawUnit.on('HCI:EVT', bleRawUnitEvtHandler);

bleHci.on('Hci', appLevelHandler);
bleHci.on('L2cap', appLevelHandler);
bleHci.on('Att', appLevelHandler);
bleHci.on('Gatt', appLevelHandler);
bleHci.on('Gap', appLevelHandler);
bleHci.on('Util', appLevelHandler);

BleHci.prototype.execCmd = function (subGroup, cmd, argInst, callback) {
    var self = this,
        deferred = Q.defer(),
        subGroupDef = BHCI.CmdSubGroup.get(subGroup),
        subGroupCmdDef,
        cmdName,
        cmdSto,
        cmdPromiseHolder;

    if (!_.isString(subGroup) || !_.isString(cmd)) { deferred.reject(new TypeError('subGroup and cmd should be string')); }
    if (!_.isObject(argInst) || _.isArray(argInst)) { deferred.reject(new TypeError('argInst should be an object')); }
    if (!_.isFunction(callback) && !_.isUndefined(callback)) { deferred.reject(new TypeError('callback should be a function')); }

    if (!subGroupDef) {
        deferred.reject(new TypeError('Invalid subGroup: ' + subGroup));
    } else if (!(subGroupCmdDef = BHCI.SubGroupCmd[subGroup].get(cmd))) {
        deferred.reject(new TypeError('Invalid command: ' + cmd));
    }

    cmdSto = new CmdStore(subGroup, cmd, argInst, deferred);
    cmdName = cmdSto.cmdName;

    cmdPromiseHolder = this.cmdPromiseHolders[cmdName] = this.cmdPromiseHolders[cmdName] || [];
    cmdPromiseHolder.push(cmdSto);

    cmdSto.buildHandlers();

    if (cmdPromiseHolder.length === 1) {
        this._addListenerAndInvokeCmd(subGroup, cmd);
    }

    return deferred.promise.nodeify(callback);
};

BleHci.prototype.invokeCmd = function (cmdSto, callback) {
    var self = this,
        defr = Q.defer();

    if (!rawUnit.sp) {
        deferred.reject(new Error('You must register the serial port first.'));
    }

    this.sendCmd(cmdSto).then(function() {
        defr.resolve();
    }, function (err) {
        defr.reject(err);
    }).done();

    return defr.promise.nodeify(callback);
};

BleHci.prototype.sendCmd = function (cmdSto, callback) {
    var self = this,
        deferred = Q.defer(),
        cmdPacket = cmdSto.exportCmdPacket();

    rawUnit.sendCmd(cmdPacket).then(function(result) {
        if (result === 'busy') {
            self.txQueue.push(cmdSto);
        } else {
            if (self.txQueue.length !== 0) {
                process.nextTick(function () {
                    var nextItem = self.txQueue.shift();
                    self.sendCmd(nextItem);
                });
            }
        }
        deferred.resolve();
    }, function(err) {
        deferred.reject(err);
    }).done();

    return deferred.promise.nodeify(callback);
};

/*************************************************************************************************/
/*** Proetcted Functions                                                                       ***/
/*************************************************************************************************/
BleHci.prototype._addListenerAndInvokeCmd = function (subGroup, cmd) {
    var self = this,
        promsToResolve = [],
        cmdName = subGroup + cmd,
        cmdPromiseHolder = this.cmdPromiseHolders[cmdName],
        cmdSto = cmdPromiseHolder[0],
        evtHdlrs = cmdSto.evtHandlersTable,
        expired_ms = 1000,
        tmrOut;

    _.forEach(evtHdlrs, function (hdlr, evt) {
        promsToResolve.push((function () {
            var deferred = Q.defer();
            evtHdlrs[evt] = hdlr(deferred);
            return deferred.promise;
        }()));
    });

    cmdSto.addListenersToBleHci();

    //TODO, Some command processing time is very short, but some command is very long
    if (subGroup === 'L2cap' || subGroup === 'Gap') {
        expired_ms = 15000;
    } else {
        expired_ms = 30000;
    }

    var rejectAll = function (errStr) {
        // reject deferred from exec()
        cmdSto.deferred.reject(new Error(errStr));
        // reject all promises in promsToResolve array, and the reset it to []
        _.forEach(promsToResolve, function (prom) {
            if (prom.isPending()) { prom.reject(new Error(errStr)); }
        });
        promsToResolve = [];
    };

    tmrOut = setTimeout(function() {
        rejectAll(cmdSto.cmdName + ' timeout.');
        self._invokeNextCmd(subGroup, cmd);
    }, expired_ms);

    this.invokeCmd(cmdSto).then(function () {
        return Q.all(promsToResolve);
    }, function (err) {
        rejectAll('Serial port is unavailable');
    }).then(function (result) {
        clearTimeout(tmrOut);
        cmdSto.deferred.resolve(result);
    }).fail(function (err) {
        rejectAll(err);
        clearTimeout(tmrOut);
        cmdSto.deferred.reject(err);
    }).finally(function () {
        self._invokeNextCmd(subGroup, cmd);
    }).done();
};

BleHci.prototype._invokeNextCmd = function (subGroup, cmd) {
    var self = this,
        cmdName = subGroup + cmd,
        cmdPromiseHolder = this.cmdPromiseHolders[cmdName],
        prevCmdSto = cmdPromiseHolder.shift();

    prevCmdSto.removeListenersFromBleHci(); // first remove previous listeners

    if (cmdPromiseHolder.length === 0) {
        delete this.cmdPromiseHolders[cmdName];
    } else {
        process.nextTick(function () {
            self._addListenerAndInvokeCmd(subGroup, cmd);
        });
    }
};

/*************************************************************************************************/
/*** Private Functions                                                                         ***/
/*************************************************************************************************/
/***************************************************/
/*** Message Handlers                            ***/
/***************************************************/
function bleRawUnitEvtHandler (msg) {
    var subGroup = BHCI.EvtSubGroup.get(msg.subGroup).key;

    delete msg.evtCode;
    delete msg.group;
    bleHci.emit(subGroup, msg); // evtType = string of subGroup 
}

function appLevelHandler(msg) {
    console.log(msg)
    var subGroup = BHCI.EvtSubGroup.get(msg.subGroup).key,
        evtName = BHCI.SubGroupEvt[subGroup].get(msg.evtId).key,
        evtApiName = (subGroup + evtName),
        argObj = evtDiscrim[evtApiName]();

    argObj.getHciEvtPacket(msg.len, msg.data).then(function (result) {
        var parsed = {
                evtName: evtApiName,
                data: result
            },
            objToEmit = {
                name: evtApiName,
                data: parsed
            };
        if (evtApiName === 'GapCmdStatus') {
            objToEmit.name = objToEmit.name + ':' + parsed.data.opCode;
        } else if (evtApiName === 'AttErrorRsp') {
            objToEmit.name = objToEmit.name + ':' + parsed.data.reqOpcode;
            objToEmit.data = parsed.data;
        }
        bleHci.emit(objToEmit.name, objToEmit.data);
    }).fail(function (err) {
        // TODO
    }).done();
}

/***************************************************/
/*** Basic Event Handler Generators              ***/
/***************************************************/
function genNormalEvtHandler(deferred) {
    return function (msg) {
        var result = {};
        result[msg.evtName] = msg.data;
        deferred.resolve(result);
    }
}

function genCmdStatusEvtHandler(deferred) {
    return function (msg) {
        var result = {};
        if (msg.data.status !== 0) {
            result[msg.evtName] = msg.data;
            deferred.reject(result);
        } else {
            result[msg.evtName] = msg.data;
            deferred.resolve(result);
        }
    }
}

function genMultiAttEvtHandlerGen(deferred) {
    var result = {},
        count = 0;

    return function (msg) {
        if (msg.data.status === BDEFS.GenericStatus.get('SUCCESS').value) {
            result[msg.evtName + count] = msg.data;
            count++;
        } else if (msg.data.status === BDEFS.GenericStatus.get('bleProcedureComplete').value) {
            // [TODO]
            result[msg.evtName + count] = msg.data;
            deferred.resolve(result);
        }
    }
}

/***************************************************/
/*** Command Store Class                         ***/
/***************************************************/
function CmdStore(subGroup, cmd, argInst, deferred) {
    var self = this;
    this.bleHci = bleHci;
    this.subGroup = subGroup;
    this.cmd = cmd;
    this.cmdName = subGroup + cmd;
    this.cmdId = BHCI.SubGroupCmd[subGroup].get(cmd).value;
    this.opCode = null;

    this.args = argInst;
    this.deferred = deferred;
    this.evtHandlersTable = {};

    (function () {
        var vendorCmdGroupDef = BHCI.CmdGroup.get('VENDOR_SPECIFIC'),
            subGroupDef = BHCI.CmdSubGroup.get(subGroup);
            self.opCode = vendorCmdGroupDef.value | subGroupDef.value | self.cmdId;
    }());
}

CmdStore.prototype.exportCmdPacket = function () {
    var cmdBuf = cmdBuilder[this.cmdName]().transToArgObj(this.args).getHciCmdBuf();

    return {
        group: BHCI.CmdGroup.get('VENDOR_SPECIFIC').value,
        subGroup: BHCI.CmdSubGroup.get(this.subGroup).value,
        cmdId: this.cmdId,
        len: cmdBuf.length,
        data: cmdBuf
    };
};

CmdStore.prototype._assignHandler = function (hdlrKey, hdlr) {
    _.set(this.evtHandlersTable, hdlrKey, hdlr);
};

CmdStore.prototype.addListenersToBleHci = function () {
    var self = this;
    _.forEach(this.evtHandlersTable, function (hdlr, evt) {
        self.bleHci.on(evt, hdlr);
    });
};

CmdStore.prototype.removeListenersFromBleHci = function () {
    var self = this;
    _.forEach(this.evtHandlersTable, function (hdlr, evt) {
        self.bleHci.removeListener(evt, hdlr);
    });
};

CmdStore.prototype.buildHandlers = function () {
    var self = this,
        defr = this.deferred,
        subGroup = this.subGroup,
        cmdName = this.cmdName,
        cmdId = this.cmdId,
        hdlrKey = cmdName;

    if (subGroup !== 'Hci') {
        // there is a basic handler
        // _.merge(deferExecObj.evtHandlers, buildEvtHandler('General', 'Gap', 'CmdStatus', this.opCode));
        this._assignHandler(('GapCmdStatus:' + this.opCode), genCmdStatusEvtHandler);
    }

    switch (subGroup) {
        case 'Hci':
            if (cmdName === 'HciDisconnectImmed') {
                this._assignHandler('GapTerminateLink', genNormalEvtHandler);
            }

            if (cmdName !== 'HciEnablePtm' && cmdName !== 'HciAdvEventNotice' && cmdName !== 'HciConnEventNotice') {
                this._assignHandler(hdlrKey, genNormalEvtHandler);
            }
            break;

        case 'L2cap':
            this._assignHandler('L2capCmdReject', genNormalEvtHandler);
            break;

        case 'Att':
        case 'Gatt':
            hdlrKey = BHCI.cmdEvtCorrTable[subGroup][cmdName];
            if (!hdlrKey) { break; }

            if (subGroup === 'Gatt') {
                cmdId = BHCI.SubGroupCmd.Att.get(hdlrKey.replace('Rsp', 'Req').slice(3)).value;
            }

            if (_.isArray(hdlrKey)) {
                hdlrKey = hdlrKey[0];
            }
            this._assignHandler(hdlrKey, genNormalEvtHandler);

            this.bleHci.once('AttErrorRsp:' + cmdId, function (msg) {
                deferred.reject({ AttErrorRsp: msg });
                self.bleHci._invokeNextCmd(subGroup, self.cmd);
                // [TODO] remove promiseHolder from holders
            })
            break;

        case 'Gap':
            hdlrKey = BHCI.cmdEvtCorrTable.Gap[cmdName];
            if (!hdlrKey || (cmdName === 'GapConfigDeviceAddr' && argInst.addrType === '0')) { break; }

            if (_.isArray(hdlrKey)) {
                _.forEach(hdlrKey, function (ev) {
                    self._assignHandler(ev, genNormalEvtHandler);
                })
            } else {
                this._assignHandler(hdlrKey, genNormalEvtHandler);
            }
            break;

        case 'Util':
            break;

        default:
            break;
    }
};

module.exports = bleHci;
