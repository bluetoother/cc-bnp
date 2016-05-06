'use strict';

var util = require('util'),
    EventEmitter = require('events').EventEmitter,
    _ = require('lodash'),
    Q = require('q');

var BHCI = require('../defs/blehcidefs'),
    rawUnit = require('./bleRawUnit'),
    cmdBuilder = require('./hciCmdBuilder'),
    evtDiscrim = require('./hciEvtDiscriminator'),
    charDiscrim = require('./hciCharDiscriminator'),
    charBuild = require('./hciCharBuilder'),
    hciCharMeta = require('./hciCharMeta'),
    ccBnpError = require('./ccBnpError');

function BleHci() {
    this.uuidHdlTable = {};
    this.timeoutCfgTable = {};

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

    if (argInst.uuid && _.indexOf(BHCI.cmdWithUuid, cmdName) > -1) {
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
        deferred = Q.defer(),
        cmdPacket = cmdSto.exportCmdPacket();

    if (!rawUnit.sp) {
        deferred.reject(new Error('You must register the serial port first.'));
    } else {
        rawUnit.sendCmd(cmdPacket).then(function(result) {
            if (result === 'busy') {
                self.txQueue.push(cmdPacket);
            } else {
                if (self.txQueue.length !== 0) {
                    process.nextTick(function () {
                        var nextItem = self.txQueue.shift();
                        rawUnit.sendCmd(nextItem);
                    });
                }
            }
            deferred.resolve();
        }, function(err) {
            deferred.reject(err);
        }).done();
    }

    return deferred.promise.nodeify(callback);
};

/*************************************************************************************************/
/*** Proetcted Functions                                                                       ***/
/*************************************************************************************************/
BleHci.prototype._addListenerAndInvokeCmd = function (subGroup, cmd) {
    var self = this,
        cmdName = subGroup + cmd,
        cmdSto = this.cmdPromiseHolders[cmdName][0],
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

    expired_ms = getTimeout(cmdName);

    cmdSto.tmrOut = setTimeout(function() {
        cmdSto._rejectAll(cmdName + ' timeout.');
        self._removeErrListener(cmdSto);
        self._invokeNextCmd(subGroup, cmd);
    }, expired_ms);
var flag = false;
    cmdSto.buildCmdChar().then(function () {
        return self.invokeCmd(cmdSto);
    }).then(function () {
        return Q.all(cmdSto.promsToResolve);
    }).then(function (result) {
        return cmdSto.buildEvtChar(result);
    }).then(function (result) {
        cmdSto.deferred.resolve(transResultFormat(result));
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
        var deferred = Q.defer(),
            parsed = {
                evtName: evtApiName,
                data: result
            },
            objToEmit = {
                name: evtApiName,
                data: parsed
            },
            evtApiNames = ['AttHandleValueNoti', 'AttHandleValueInd', 'AttFindByTypeValueReq', 'AttWriteReq'];

        if (evtApiName === 'GapCmdStatus') {
            objToEmit.name = objToEmit.name + ':' + parsed.data.opCode;
        }
        if (evtApiName === 'AttErrorRsp') {
            objToEmit.name = objToEmit.name + ':' + parsed.data.reqOpcode;
            objToEmit.data = parsed.data;
        }

        if (_.indexOf(evtApiNames, evtApiName) > -1) {
            getCharUuid(evtApiName, parsed.data).then(function (uuid) {
                if (uuid) {
                    return charDiscrim(shrinkUuid(uuid)).getCharValPacket(parsed.data.value);
                } else {
                    return;
                }
            }).then(function (result) {
                if (result) { parsed.data.value = result; }
                deferred.resolve(objToEmit);
            }).fail(function (err) {
                deferred.reject(err);
            }).done();
        } else {
            deferred.resolve(objToEmit);
        }

        return deferred.promise;
    }).then(function (objToEmit) {
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
        bleHci.on(evt, hdlr); 
    });
};

CmdStore.prototype.removeListenersFromBleHci = function () {
    var self = this;
    _.forEach(this.evtHandlersTable, function (hdlr, evt) {
        bleHci.removeListener(evt, hdlr); 
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
                this.rspCmdId = BHCI.SubGroupCmd.Att.get(hdlrKey.replace('Rsp', 'Req').slice(3)).value;
            }
            break;

        case 'Gap':
            hdlrKey = BHCI.cmdEvtCorrTable.Gap[cmdName];
            if (!hdlrKey || (cmdName === 'GapConfigDeviceAddr' && this.args.addrType === '0')) { break; }
            if (cmdName === 'GapTerminateLink' && this.args.connHandle === 65534) { break; }
            
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
        deferred = Q.defer(),
        cmdchar,
        uuidHdlTable,
        getCharBuf;

    getCharBuf = function (uuid) {
        if (!uuid) {
            throw new Error('Can not find characteristic UUID');
        } else if (self.cmdName !== 'AttReadMultiRsp' && !hciCharMeta[uuid]) {
            throw new Error('Characteristic UUID not be registered');
        } else if (self.cmdName === 'AttReadByTypeRsp') {
            for (var i = 0; i < (_.keys(self.args.data).length / 2); i += 1) {
                cmdchar = charBuild(shrinkUuid(uuid)).transToValObj(self.args.data['attrVal' + i]).getHciCharBuf();
                self.args.data['attrVal' + i] = cmdchar;
            }
        } else {
            cmdchar = charBuild(shrinkUuid(uuid)).transToValObj(self.args.value).getHciCharBuf();
            self.args.value = cmdchar;
        }
    }

    if (_.indexOf(BHCI.cmdValBuild, this.cmdName) > -1 && !Buffer.isBuffer(this.args.value)) {
        uuidHdlTable = bleHci.uuidHdlTable[this.args.connHandle];

        if (!this.uuid && uuidHdlTable) { 
            this.uuid = uuidHdlTable[this.args.handle]; 
        }

        getCharUuid(this.cmdName, this.args, this.uuid).done(function (uuid) {
            try {
                getCharBuf(uuid);
                deferred.resolve();
            } catch (e) {
                deferred.reject(e);
            }
        }, function (err) {
            deferred.reject(err);
        });
    } else {
        deferred.resolve();
    }

    return deferred.promise.nodeify(callback);
};

CmdStore.prototype.buildEvtChar = function (evtObj, callback) {
    var self = this,
        deferred = Q.defer(),
        evtName = _.keys(this.evtHandlersTable)[1],
        uuid,
        charObj,
        charToResolve = [],
        uuidHdlTable = bleHci.uuidHdlTable;

    if (evtName === 'AttReadRsp') {
        getCharUuid('AttReadRsp', this.args, this.uuid).then(function (uuid) {
            return charDiscrim(shrinkUuid(uuid)).getCharValPacket(evtObj[1].AttReadRsp.value);
        }).then(function (result) {
            evtObj[1].AttReadRsp.value = result;
            deferred.resolve(evtObj);
        }).fail(function (err) {
            deferred.reject(err);
        }).done();
    } else if (evtName === 'AttReadByTypeRsp') {
        uuid = this.args.type;

        _.forEach(evtObj[1], function (charObj) {
            if (charObj.status === 0) {
                if (!uuidHdlTable[charObj.connHandle]) { 
                    uuidHdlTable[charObj.connHandle] = {}; 
                }

                _.forEach(_.keys(charObj.data), function (name) {
                    if (self.cmdName === 'GattDiscAllChars'){
                        uuid = '0x7890';
                    } else if (_.startsWith(name, 'attrHdl')) {
                        uuidHdlTable[charObj.connHandle][charObj.data[name]] = uuid;
                    }

                    if (_.startsWith(name, 'attrVal')) {
                        charToResolve.push((function () {
                            var deferred = Q.defer();

                            charDiscrim(shrinkUuid(uuid)).getCharValPacket(charObj.data[name])
                            .then(function (result) {
                                charObj.data[name] = result;
                                if (self.cmdName === 'GattDiscAllChars')
                                    uuidHdlTable[charObj.connHandle][result.hdl] = result.uuid; 

                                deferred.resolve();
                            }).fail(function (err) {
                                deferred.reject(err);
                            }).done();
                            return deferred.promise;
                        }()));
                    }
                });
            }
        })

        Q.all(charToResolve).then(function () {
            deferred.resolve(evtObj);
        }).fail(function (err) {
            deferred.reject(err);
        }).done();
    } else {
        deferred.resolve(evtObj);
    }

    return deferred.promise.nodeify(callback);
}; 

/***************************************************/
/*** Private Functions                           ***/
/***************************************************/
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

function shrinkUuid (uuid) {
    if (_.isNumber(uuid)) {
        if (uuid.toString().length === 34) {
            uuid =  '0x' + uuid.toString().slice(6, 10);
        }
    } else if (_.isString(uuid)) {
        if (uuid.length === 34) {
            uuid = '0x' + uuid.slice(6, 10);
        }
    }

    return uuid;
}

function getTimeout (cmdName, connHdl) {
    var timeout = 1500,
        timeoutCfg = bleHci.timeoutCfgTable[connHdl];

    if (!timeoutCfg) {
        timeoutCfg = {
            level1: 3000,
            level2: 10000,
            scan: 15000
        };
    }

    if (_.includes(BHCI.timeout.level1, cmdName)) {
        timeout = timeoutCfg.level1;    
    } else if (_.includes(BHCI.timeout.level2, cmdName)) {
        timeout = timeoutCfg.level2;
    } else if (cmdName === 'GapDeviceDiscReq') {
        timeout = timeoutCfg.scan;
    }

    return timeout;
}

function getCharUuid (apiName, data, uuid) {
    var deferred = Q.defer();

    if (uuid) {
        deferred.resolve(uuid);
    } else {
        switch (apiName) {
            case 'AttWriteReq':
            case 'GattWriteCharValue':
            case 'GattWriteNoRsp':
            case 'GattSignedWriteNoRsp':
            case 'GattWriteCharDesc':
            case 'AttReadRsp':
            case 'AttHandleValueNoti':
            case 'AttHandleValueInd':
                if (bleHci.uuidHdlTable[data.connHandle] && bleHci.uuidHdlTable[data.connHandle][data.handle]) {
                    deferred.resolve(bleHci.uuidHdlTable[data.connHandle][data.handle]);
                } else {
                    bleHci.execCmd('Gatt', 'DiscAllChars', {connHandle: data.connHandle, startHandle: data.handle - 1, endHandle: data.handle})
                    .then(function (result) {
                        deferred.resolve(result.collector.AttReadByTypeRsp[0].data.attrVal0.uuid);
                    }).fail(function (err) {
                        deferred.reject(err);
                    }).done();
                }
                break;
            case 'AttFindByTypeValueReq':
                deferred.resolve(data.type);
                break;
            case 'AttWriteReq':
                if (bleHci.uuidHdlTable['65534'] && bleHci.uuidHdlTable['65534'][data.handle]) {
                    deferred.resolve(bleHci.uuidHdlTable['65534'][data.handle]);
                }
                break;
            default:
                deferred.resolve();
                break;
        }
    }

    return deferred.promise;
}

function transResultFormat (result) {
    var newResult,
        controllerEvt;

    if (_.isEmpty(result)) {
        return null;
    } else {
        controllerEvt = result.shift();
        newResult = _.values(controllerEvt)[0];

        _.remove(result, function (evt) {
            return _.isEqual(evt, {});
        });

        if (!_.startsWith(_.keys(controllerEvt)[0], 'Hci')) {
            newResult.collector = {};

            _.forEach(result, function (evts) {
                var evtName = _.keys(evts)[0];

                if (_.size(evts) !== 1 && evtName) {
                    evtName = evtName.slice(0, -1);
                }

                newResult.collector[evtName] = [];
                _.forEach(evts, function (evt) {
                    newResult.collector[evtName].push(evt);
                });
            });
        }

        return newResult;
    }
}

bleHci.on('GapLinkTerminated', function (result) {
    if (result.data.status === 0) {
        delete this.uuidHdlTable[result.data.connHandle];
        delete this.timeoutCfgTable[result.data.connHandle];
    }
});

module.exports = bleHci;
