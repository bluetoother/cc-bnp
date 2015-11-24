'use strict';

var util = require('util'),
    EventEmitter = require('events').EventEmitter,
    _ = require('lodash'),
    Q = require('q');

var BHCI = require('../defs/blehcidefs'),
    rawUnit = require('./bleRawUnit'),
    cmdBuilder = require('./HciCmdBuilder'),
    evtDiscrim = require('./HciEvtDiscriminator'),
    charDiscrim = require('./HciCharDiscriminator'),
    charBuild = require('./HciCharBuilder'),
    ccBnpError = require('./ccBnpError');

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
            deferred.resolve('SUCCESS');
        }, function (err) {
            deferred.reject(err);
        }).done();

        return deferred.promise.nodeify(callback);
    };

    this.closeSp = function (callback) {
        var deferred = Q.defer();

        rawUnit.closeSp().then(function () {
            deferred.resolve('SUCCESS');
        }, function (err) {
            deferred.reject(err);
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

    if (argInst.uuid) {
        cmdSto.uuid = argInst.uuid;
        delete argInst.uuid;
    }

    cmdPromiseHolder = this.cmdPromiseHolders[cmdName] = this.cmdPromiseHolders[cmdName] || [];
    cmdPromiseHolder.push(cmdSto);

    cmdSto.buildHandlers();

    if (cmdPromiseHolder.length === 1) {
        self._addListenerAndInvokeCmd(subGroup, cmd);
    }

    return deferred.promise.nodeify(callback);
};

BleHci.prototype.invokeCmd = function (cmdSto, callback) {
    var self = this,
        deferred = Q.defer();

    if (!rawUnit.sp) {
        deferred.reject(new Error('You must register the serial port first.'));
    }

    this.sendCmd(cmdSto).then(function() {
        deferred.resolve();
    }, function (err) {
        deferred.reject(err);
    }).done();

    return deferred.promise.nodeify(callback);
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
        cmdId = cmdSto.cmdId,
        evtHdlrs = cmdSto.evtHandlersTable,
        result = {},
        expired_ms;

    _.forEach(evtHdlrs, function (hdlr, evt) {
        cmdSto.promsToResolve.push((function () {
            var deferred = Q.defer();
            
            if (cmdName === 'GapDeviceDiscReq' && evt === 'GapDeviceInfo') {
                evtHdlrs[evt] = hdlr(result);
                self.once('GapDeviceDiscovery', function () {
                    self.removeAllListeners('GapDeviceDiscovery');
                    deferred.resolve(result);
                });
            } else {
                evtHdlrs[evt] = hdlr(deferred);
            }

            return deferred.promise;
        }()));
    });

    cmdSto.addListenersToBleHci();
    if ((subGroup === 'Att' || subGroup === 'Gatt') && BHCI.cmdEvtCorrTable[subGroup][cmdName]) {
        if (subGroup === 'Gatt') { cmdId = cmdSto.rspCmdId; }
        cmdSto.attErrHdlr = function (msg) {
            var errMsg = BHCI.AttErrCode.get(msg.errCode).key;
            cmdSto._rejectAll(new ccBnpError.AttError(errMsg, msg.errCode));
            clearTimeout(cmdSto.tmrOut);
            self._invokeNextCmd(cmdSto.subGroup, cmdSto.cmd);                
        };
        self.once('AttErrorRsp:' + cmdId, cmdSto.attErrHdlr);
    }

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

    cmdSto.buildCmdChar().then(function () {
        return self.invokeCmd(cmdSto);
    }).then(function () {
        return Q.all(cmdSto.promsToResolve);
    }, function (err) {
        cmdSto._rejectAll('Serial port is unavailable');
    }).then(function (result) {
        return cmdSto.buildEvtChar(result);
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

        if (_.startsWith(msg.evtName, 'Hci')) {
            if (msg.data.status !== 0) {
                var errMsg = BHCI.HciErrCode.get(msg.data.status).key;
                deferred.reject(new ccBnpError.HciError(errMsg, msg.data.status));
            } else {
                result[msg.evtName] = msg.data;
                deferred.resolve(result);
            }
        } else {
            result[msg.evtName] = msg.data;
            deferred.resolve(result);
        }
    };
}

function genCmdStatusEvtHdlr(deferred) {
    return function (msg) {
        var result = {};

        if (msg.data.status !== 0) {
            var errMsg = BHCI.GenericStatus.get(msg.data.status).key;
            deferred.reject(new ccBnpError.GenericError(errMsg, msg.data.status));
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
        if (msg.data.status === BHCI.GenericStatus.get('SUCCESS').value) {
            result[msg.evtName + count] = msg.data;
            count++;
        } else if (msg.data.status === BHCI.GenericStatus.get('bleProcedureComplete').value) {
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
                // cmdId = BHCI.SubGroupCmd.Att.get(hdlrKey.replace('Rsp', 'Req').slice(3)).value;
                this.rspCmdId = BHCI.SubGroupCmd.Att.get(hdlrKey.replace('Rsp', 'Req').slice(3)).value;
            }
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

CmdStore.prototype.buildCmdChar = function (callback) {
    var self = this,
        deferred = Q.defer();

    if (_.indexOf(BHCI.cmdValBuild, this.cmdName) > -1) {
        if (Buffer.isBuffer(self.args.value)) {
            deferred.resolve();
        } else {
            switch (this.cmdName) {
                case 'AttWriteReq':
                case 'GattWriteCharValue':
                case 'GattWriteNoRsp':
                case 'GattSignedWriteNoRsp':
                case 'GattWriteCharDesc':
                    if (this.uuid) {
                        var cmdchar = charBuild(this.uuid).transToValObj(self.args.value).getHciCharBuf();
                        self.args.value = cmdchar;
                        deferred.resolve();
                    } else {
                        bleHci.execCmd('Gatt', 'DiscAllChars', {connHandle: this.args.connHandle, startHandle: this.args.handle - 1, endHandle: this.args.handle}).then(function (result) {
                            var charObj = result[1].AttReadByTypeRsp0.data.attrVal0,
                                uuid = buf2Str(charObj),
                                cmdchar = charBuild(uuid).transToValObj(self.args.value).getHciCharBuf();
                            self.args.value = cmdchar;
                            deferred.resolve();
                        }).fail(function (err) {
                            deferred.reject(err);
                        });
                    }
                    break;
                case 'AttFindByTypeValueReq':
                    if (this.args.type) {
                        var cmdchar = charBuild(this.args.type).transToValObj(self.args.value).getHciCharBuf();
                        self.args.value = cmdchar;
                        deferred.resolve();
                    } else {
                        deferred.reject(new Error('The value are not Buffer.'));
                    }
                    break;
                case 'GattDiscPrimaryServiceByUuid':
                case 'AttHandleValueNoti':
                case 'AttHandleValueInd':
                case 'GattNotification':
                case 'GattIndication':
                case 'AttReadRsp':
                    if (this.uuid) {
                        var cmdchar = charBuild(this.uuid).transToValObj(self.args.value).getHciCharBuf();
                        self.args.value = cmdchar;
                        deferred.resolve();
                    } else {
                        deferred.reject(new Error('The value are not Buffer.'));
                    }
                    break;
                case 'AttReadByTypeRsp':
                    if (this.uuid) {
                        for (var i = 0; i < (_.keys(self.args.data).length / 2); i += 1) {
                            var cmdchar = charBuild(this.uuid).transToValObj(self.args.data['attrVal' + i]).getHciCharBuf();
                            self.args.data['attrVal' + i] = cmdchar;
                        }

                        deferred.resolve();
                    } else {
                        deferred.reject(new Error('The value are not Buffer.'));
                    }
                    break;
                default:
                    deferred.resolve();
                    break;
            }
        }
    } else {
        deferred.resolve();
    }

    return deferred.promise.nodeify(callback);
};

CmdStore.prototype.buildEvtChar = function (evtObj, callback) {
    var self = this,
        deferred = Q.defer(),
        uuid,
        evtChar,
        charObj,
        charToResolve = [];

    if (_.keys(this.evtHandlersTable)[1] === 'AttReadRsp') {
        if (this.uuid) {
            charDiscrim(this.uuid).getCharValPacket(evtObj[1].AttReadRsp.value).then(function (result) {
                evtObj[1].AttReadRsp.value = result;
                deferred.resolve(evtObj);           
            });
        } else {
            bleHci.execCmd('Gatt', 'DiscAllChars', {connHandle: this.args.connHandle, startHandle: this.args.handle - 1, endHandle: this.args.handle}).then(function (result) {
                charObj = result[1].AttReadByTypeRsp0.data.attrVal0;
                uuid = buf2Str(charObj);
                evtChar = charDiscrim(uuid);

                return evtChar.getCharValPacket(evtObj[1].AttReadRsp.value);
            }).then(function (result) {
                evtObj[1].AttReadRsp.value = result;
                deferred.resolve(evtObj);
            }).fail(function (err) {
                deferred.reject(err);
            });
        }

    } else if (_.keys(this.evtHandlersTable)[1] === 'AttReadByTypeRsp') {
        uuid = this.args.type;
        evtChar = charDiscrim(uuid);

        if (this.cmdName === 'GattDiscAllChars') {
            _.forEach(evtObj[1], function (charObj) {
                if (charObj.status === 0) {
                    for(var i = 0; i < (_.keys(charObj.data).length / 2); i += 1) {
                        uuid = buf2Str(charObj.data['attrVal' + i]);
                        charObj.data['attrVal' + i] = {
                            prop: charObj.data['attrVal' + i].readUInt8(),
                            hdl: charObj.data['attrVal' + i].readUInt16LE(1),
                            uuid: uuid,
                        };
                    }
                }
            });
            deferred.resolve(evtObj);
        } else {
            _.forEach(evtObj[1], function (charObj) {
                if (charObj.status === 0) {
                    _.forEach(_.keys(charObj.data), function (name) {
                        if (_.startsWith(name, 'attrVal')) {
                            charToResolve.push((function () {
                                var deferred = Q.defer();
                                evtChar.getCharValPacket(charObj.data[name]).then(function (result) {
                                    charObj.data[name] = result;
                                    deferred.resolve();
                                }).fail(function (err) {
                                    deferred.reject(err);
                                }).done();
                                return deferred.promise.nodeify(callback);
                            }()));
                        }
                    });
                }
            });

            Q.all(charToResolve).then(function () {
                deferred.resolve(evtObj);
            }).fail(function (err) {
                deferred.reject(err);
            }).done();
        }
    } else if (_.keys(this.evtHandlersTable)[1] === 'AttReadMultiRsp') {
        
        deferred.resolve(evtObj);
    } else {
        deferred.resolve(evtObj);
    }

    return deferred.promise.nodeify(callback);
};

function buf2Str(buf) {
    var bufLen = buf.length,
        val,
        strChunk = '0x';

    for (var i = bufLen; i > 3; i -= 1) {
        val = buf.readUInt8(i-1);
        if (val <= 15) {
            strChunk += '0' + val.toString(16);
        } else {
            strChunk += val.toString(16);
        }
    }

    return strChunk;
}

module.exports = bleHci;
