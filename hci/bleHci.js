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
        }).done();

        return deferred.promise.nodeify(callback);
    };

    this.closeSp = function (callback) {
        var deferred = Q.defer();

        rawUnit.closeSp().then(function () {
            deferred.resolve(  );
        }).done();

        return deferred.promise.nodeify(callback);
    };
}

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
        defr.reject(new Error('You must register the serial port first.'));
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
        cmdName = subGroup + cmd,
        cmdPromiseHolder = this.cmdPromiseHolders[cmdName],
        cmdSto = cmdPromiseHolder[0],
        evtHdlrs = cmdSto.evtHandlersTable,
        result = {},
        expired_ms;

    _.forEach(evtHdlrs, function (hdlr, evt) {
        cmdSto.promsToResolve.push((function () {
            var deferred = Q.defer();
            
            if (cmdName === 'GapDeviceDiscReq' && evt === 'GapDeviceInfo') {
                evtHdlrs[evt] = hdlr(result);
                self.once('GapDeviceDiscovery', function () {
                    deferred.resolve(result);
                });
            } else {
                evtHdlrs[evt] = hdlr(deferred);
            }

            return deferred.promise;
        }()));
    });

    cmdSto.addListenersToBleHci();

    //TODO, Some command processing time is very short, but some command is very long
    if (subGroup === 'Hci' || subGroup === 'Util') {
        expired_ms = 2000;
    }else if (subGroup === 'L2cap' || subGroup === 'Gap') {
        expired_ms = 20000;
    } else {
        expired_ms = 30000;
    }

    cmdSto.tmrOut = setTimeout(function() {
        cmdSto._rejectAll(cmdName + ' timeout.');
        self._removeErrListener(cmdSto);
        self._invokeNextCmd(subGroup, cmd);
    }, expired_ms);

    this.invokeCmd(cmdSto).then(function () {
        return Q.all(cmdSto.promsToResolve);
    }, function (err) {
        cmdSto._rejectAll('Serial port is unavailable');
    }).then(function (result) {
        cmdSto.deferred.resolve(result);
    }).fail(function (err) {
        cmdSto._rejectAll(err);
    }).finally(function () {
        clearTimeout(cmdSto.tmrOut);
        self._removeErrListener(cmdSto);
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

BleHci.prototype._removeErrListener = function (cmdSto) {
    var cmdId;

    if (cmdSto.subGroup === 'Att') {
        cmdId = cmdSto.cmdId;
    } else if (cmdSto.subGroup === 'Gatt') {
        cmdId = cmdSto.rspCmdId;
    } else {
        return;
    }

    if (this.listenerCount('AttErrorRsp:' + cmdId) !== 0) {
        this.removeListener('AttErrorRsp:' + cmdId, cmdSto.attErrHdlr);
    }
};

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
function genNormalEvtHdlr(deferred) {
    return function (msg) {
        var result = {};
        result[msg.evtName] = msg.data;
        deferred.resolve(result);
    };
}

function genCmdStatusEvtHdlr(deferred) {
    return function (msg) {
        var result = {};
        if (msg.data.status !== 0) {
            result[msg.evtName] = msg.data;
            deferred.reject(result);
        } else {
            result[msg.evtName] = msg.data;
            deferred.resolve(result);
        }
    };
}

function genMultiAttEvtHdlr(deferred) {
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
    };
}

function genUnpromHdlr(result) {
    var count = 0;

    return function (msg) {
        result[msg.evtName + count] = msg.data;
        count += 1;
    };
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
    this.rspCmdId = null;
    //for error handling
    this.attErrHdlr = null;
    this.tmrOut = null;

    this.args = argInst;
    this.deferred = deferred;
    this.evtHandlersTable = {};
    this.promsToResolve = [];

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

CmdStore.prototype._rejectAll = function (err) {
    var self = this;

    if (_.isString(err)) { 
        this.deferred.reject(new Error(err)); 
    } else {
        this.deferred.reject(err);
    }

    _.forEach(self.promsToResolve, function (prom) {
        if (Q.isPending(prom)) { /*[TODO]*/ }
    });
    this.promsToResolve = [];
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
        subGroup = this.subGroup,
        cmdName = this.cmdName,
        cmdId = this.cmdId,
        hdlrKey = cmdName;

    if (subGroup !== 'Hci') {
        // there is a basic handler
        this._assignHandler(('GapCmdStatus:' + this.opCode), genCmdStatusEvtHdlr);
    }

    switch (subGroup) {
        case 'Hci':
            if (cmdName === 'HciDisconnectImmed') {
                this._assignHandler('GapLinkTerminated', genNormalEvtHdlr);
            }

            if (cmdName !== 'HciEnablePtm' && cmdName !== 'HciAdvEventNotice' && cmdName !== 'HciConnEventNotice' && cmdName !== 'HciPerByChan') {
                this._assignHandler(hdlrKey, genNormalEvtHdlr);
            }
            break;

        case 'L2cap':
            this._assignHandler('L2capParamUpdateRsp', genNormalEvtHdlr); //[TODO]L2capCmdReject
            break;

        case 'Att':
        case 'Gatt':
            hdlrKey = BHCI.cmdEvtCorrTable[subGroup][cmdName];
            if (!hdlrKey) { break; }

            if (_.isArray(hdlrKey)) {
                hdlrKey = hdlrKey[0];
                this._assignHandler(hdlrKey, genMultiAttEvtHdlr);
            } else {
                this._assignHandler(hdlrKey, genNormalEvtHdlr);
            }

            if (subGroup === 'Gatt') {
                cmdId = BHCI.SubGroupCmd.Att.get(hdlrKey.replace('Rsp', 'Req').slice(3)).value;
                this.rspCmdId = cmdId;
            }

            this.attErrHdlr = function (msg) {
                self._rejectAll({ AttErrorRsp: msg });
                clearTimeout(self.tmrOut);
                self.bleHci._invokeNextCmd(self.subGroup, self.cmd);                
            };
            this.bleHci.once('AttErrorRsp:' + cmdId, this.attErrHdlr);
            break;

        case 'Gap':
            hdlrKey = BHCI.cmdEvtCorrTable.Gap[cmdName];
            if (!hdlrKey || (cmdName === 'GapConfigDeviceAddr' && this.args.addrType === '0')) { break; }

            if (cmdName === 'GapDeviceDiscReq') {
                this._assignHandler(hdlrKey[0], genUnpromHdlr);
                this._assignHandler(hdlrKey[1], genNormalEvtHdlr);
            } else if (_.isArray(hdlrKey)) {
                _.forEach(hdlrKey, function (ev) {
                    self._assignHandler(ev, genNormalEvtHdlr);
                });
            } else {
                this._assignHandler(hdlrKey, genNormalEvtHdlr);
            }
            break;

        case 'Util':
            break;

        default:
            break;
    }
};

module.exports = bleHci;
