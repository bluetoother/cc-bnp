// Copyright Sivann, Inc. and other Node contributors.
/**
 *  This module provides a object that handles HCI command/event communications.
 *  @module bleHci
 */
'use strict';

var util = require('util'),
    EventEmitter = require('events').EventEmitter,
    _ = require('lodash'),
    Q = require('q'),
    Joi = require('joi');

var BHCI = require('../defs/blehcidefs'),
    BDEFS = require('../defs/bledefs'),
    blefp = require('./blefp'),
    hciCmdConcentrater = require('./HciCmdConcentrater'),
    hciEvtDissolver = require('./HciEvtDissolver');

var BleHci = function () {
    var spinlock = false;

    this.txQueue = [];
    this.cmdResovler = [];

    this.lockSpin = function () {
        spinlock = true;
    };

    this.unlockSpin = function () {
        spinlock = false;
    };

    // Check the transmit spin
    this.isSpining = function () {  
        return spinlock;
    };

    // register serial port to blefp module
    this.registerSp = function (sp) {
       blefp.registerSp(sp);
    }
};

util.inherits(BleHci, EventEmitter);
var bleHci = new BleHci();

/**
 * Execute bluetooth HCI command. 
 * The method will automatically generate the event listener corresponding to command, and pass the received event data.
 *
 * @method execCmd
 * @param subGroup {String} sub group of HCI command
 * @param cmd {String} HCI command name
 * @param argInstance {Object} value object of the input arguments
 * @return {Promise} the promise object
 */
BleHci.prototype.execCmd = function (subGroup, cmd, argInstance, callback) {
    var deferred = Q.defer(),
        bself = this,
        cmdName = subGroup + cmd,
        listenerFuncsArr = [],
        cmdId = BHCI.SubGroupCmd[subGroup].get(cmd).value,
        opCode = ( BHCI.CmdGroup.get('VENDOR_SPECIFIC').value ) | ( BHCI.CmdSubGroup.get(subGroup).value ) | cmdId,
        deferExecObj = {
            args: argInstance,
            deferred: deferred,
            evtHandlers: {}
        },
        schema = Joi.object().keys({
            subGroup: Joi.string(),
            cmd: Joi.string(),
            argInstance: Joi.object(),
            callback: Joi.func().optional()
        });

    Joi.assert({subGroup: subGroup, cmd: cmd, argInstance: argInstance, callback: callback}, schema);
    if (!BHCI.CmdSubGroup.get(subGroup) || !BHCI.SubGroupCmd[subGroup].get(cmd)) {
        throw new TypeError('subGroup:' + subGroup + ' and cmd:' + cmd + ' must be defined in blehcidefs.js');
    }

    if (subGroup !== 'Hci') {
        _.merge(deferExecObj.evtHandlers, getGeneralEvtHandler('Gap', 'CmdStatus', opCode));
    }

    switch (subGroup) {
        case 'Hci':
            if (cmdName !== 'HciEnablePtm' && cmdName !== 'HciAdvEventNotice' && cmdName !== 'HciConnEventNotice') {
                _.merge(deferExecObj.evtHandlers, getGeneralEvtHandler(subGroup, cmd));

                if (cmdName === 'HciDisconnectImmed') {
                    _.merge(deferExecObj.evtHandlers, getGeneralEvtHandler('Gap', 'GapTerminateLink'));
                }                   
            }
            break;

        case 'L2cap':
            _.merge(deferExecObj.evtHandlers, getGeneralEvtHandler(subGroup, 'CmdReject'));
            break;

        case 'Att':
            _.merge(deferExecObj.evtHandlers, getAttEvtHandler(subGroup, cmd, opCode));
            bleHci.once('AttErrorRsp:' + cmdId, function (msg) {
                deferred.reject({AttErrorRsp: msg});
            })
            break

        case 'Gatt':
            if (cmdName === 'GapConfigDeviceAddr' && argInstance.addrType === '0') { break; }
            _.merge(deferExecObj.evtHandlers, getGattEvtHandler(cmd));
            break;

        case 'Gap':
            _.merge(deferExecObj.evtHandlers, getGapEvtHandler(cmd));
            break;

        case 'Util':
            break;

        default:
            deferred.reject('subGroup:' + subGroup + ' does not exist.');
    }

    if (!this.cmdResovler[cmdName]) { this.cmdResovler[cmdName] = []; }
    this.cmdResovler[cmdName].push(deferExecObj);

    if (this.cmdResovler[cmdName].length === 1) {
        startListenAndInvokeCmd(bself, subGroup, cmd);
    }

    return deferred.promise.nodeify(callback);
};

/**
 * Invoke bluetooth HCI command. 
 * The method will use blefp module to emit the command to controller through the serial port.
 *
 * @method invokeCmd
 * @param subGroup {String} sub group of HCI command
 * @param cmd {String} HCI command name
 * @param argInstance {Object} value object of the input arguments
 * @return {Promise} the promise object
 */
BleHci.prototype.invokeCmd = function (subGroup, cmd, argInstance, callback) {
    var deferred = Q.defer(),
        bself = this,
        cmdObj = {
            group: BHCI.CmdGroup.get('VENDOR_SPECIFIC').value,
            subGroup: BHCI.CmdSubGroup.get(subGroup).value,
            cmdId: BHCI.SubGroupCmd[subGroup].get(cmd).value,
            len: null,
            data: null
        },
        schema = Joi.object().keys({
            subGroup: Joi.string(),
            cmd: Joi.string(),
            argInstance: Joi.object(),
            callback: Joi.func().optional()
        }),
        argObj;

    Joi.assert({subGroup: subGroup, cmd: cmd, argInstance: argInstance, callback: callback}, schema);
    if (!BHCI.CmdSubGroup.get(subGroup) || !BHCI.SubGroupCmd[subGroup].get(cmd)) {
        throw new TypeError('subGroup:' + subGroup + ' and cmd:' + cmd + ' must be defined in blehcidefs.js');
    }

    if (!blefp.sp) { 
        deferred.reject('You must register serial port first.'); 
    } else if (this.isSpining() || !_.isEmpty(this.txQueue)) {
        this.txQueue.push({subGroup: subGroup, cmd: cmd, argInstance: argInstance, callback: callback})
        deferred.resolve();
    } else {
        argObj = hciCmdConcentrater[subGroup + cmd]().transToArgObj(argInstance);
        this.lockSpin();
        cmdObj.data = argObj.getHciCmdBuf();
        cmdObj.len = cmdObj.data.length;
        blefp.emit('HCI:CMD', cmdObj);

        this.unlockSpin();
        if (this.txQueue.length !== 0) {
            process.nextTick(function () {
                var cmdArgObj = bself.txQueue.shift();
                bself.invokeCmd(cmdArgObj.subGroup, cmdArgObj.cmd, cmdArgObj.argInstance, cmdArgObj.callback);
            });
        }
        deferred.resolve();
    }        
    return deferred.promise.nodeify(callback);
};

/*************************************************************************************************/
/*** Event Listener                                                                            ***/
/*************************************************************************************************/
blefp.on('HCI:EVT', blefpEvtHandler);

bleHci.on('Hci', appLevelHandler);

bleHci.on('L2cap', appLevelHandler);

bleHci.on('Att', appLevelHandler);

bleHci.on('Gatt', appLevelHandler);

bleHci.on('Gap', appLevelHandler);

bleHci.on('Util', appLevelHandler);
/*************************************************************************************************/
/*** Event Handler                                                                             ***/
/*************************************************************************************************/
function blefpEvtHandler (msg) {
    var subGroup = BHCI.EvtSubGroup.get(msg.subGroup).key;

    delete msg.evtCode;
    delete msg.group;
    bleHci.emit(subGroup, msg);
}

function appLevelHandler(msg) {
    var subGroup = BHCI.EvtSubGroup.get(msg.subGroup).key,
        evtName = BHCI.SubGroupEvt[subGroup].get(msg.evtID).key,
        argObj,
        resultObj = {};

    argObj = hciEvtDissolver[subGroup + evtName]();
    argObj.getHciEvtPacket(msg.len, msg.data).then(function (result) {
        resultObj.data = result;
        resultObj.evtName = subGroup + evtName;
        if (subGroup + evtName === 'GapCmdStatus') {
            bleHci.emit(subGroup + evtName + ':' + resultObj.data.opCode, resultObj);
        } else if (subGroup + evtName === 'AttErrorRsp') {
            bleHci.emit(subGroup + evtName + ':' + resultObj.data.reqOpcode, resultObj.data);
        } else {
            bleHci.emit(subGroup + evtName, resultObj);
        }
    }, function (err) {
        //TODO
    });
}

function normalEvtHandler(deferred) {
    var result = {};

    return function (msg) {
        result[msg.evtName] = msg.data;
        deferred.resolve(result);
    }
}

function cmdStatusEvtHandler(deferred) {
    var result = {};

    return function (msg) {
        if (msg.data.status !== 0) {
            result[msg.evtName] = msg.data;
            deferred.reject(result);
        } else {
            result[msg.evtName] = msg.data;
            deferred.resolve(result);
        }
    }
}

function multiAttEvtHandler(deferred) {
    var result = {},
        count = 0;

    return function (msg) {
        if (msg.data.status === BDEFS.GenericStatus.get('SUCCESS').value) {
            result[msg.evtName + count] = msg.data;
            count++;
        } else if (msg.data.status === BDEFS.GenericStatus.get('bleProcedureComplete').value) {
            result[msg.evtName + count] = msg.data;
            deferred.resolve(result);
        }
    }
}

/*************************************************************************************************/
/*** Private Functions                                                                         ***/
/*************************************************************************************************/
function startListenAndInvokeCmd (bself, subGroup, cmd) {
    var listenerFuncsArr = [],
        deferredExecObj = bself.cmdResovler[subGroup + cmd][0],
        cmdDeferred = deferredExecObj.deferred,
        evtHandlers = deferredExecObj.evtHandlers,
        timeoutCtrl,
        waitingTime;

    evtHandlers = listeningAllEvtMsg(evtHandlers, listenerFuncsArr);

    //TODO, Some command processing time is very short, but some command is very long
    if (subGroup === 'Hci' || subGroup === 'Util') { waitingTime = 1000; }
    else if (subGroup === 'L2cap' || subGroup === 'Gap') { waitingTime = 15000; }
    else { waitingTime = 30000; }
    timeoutCtrl = setTimeout(function() {
        cmdDeferred.reject(subGroup + cmd + ' command process is timeout.');
        invokeNextCmd(bself, subGroup, cmd);
    }, waitingTime);

    bself.invokeCmd(subGroup, cmd, deferredExecObj.args).then(function () {
        return Q.all(listenerFuncsArr);
    }, function (err) {
        cmdDeferred.reject(err);
    }).then(function (result) {
        clearTimeout(timeoutCtrl);
        invokeNextCmd(bself, subGroup, cmd);
        cmdDeferred.resolve(result);
    }, function (err) {
        clearTimeout(timeoutCtrl);
        invokeNextCmd(bself, subGroup, cmd, evtHandlers);
        cmdDeferred.reject(err);
    });
}

function invokeNextCmd (bself, subGroup, cmd, evtHandlers) {
    bself.cmdResovler[subGroup + cmd].shift();
    if (_.isEmpty(bself.cmdResovler[subGroup + cmd])) {
        delete bself.cmdResovler[subGroup + cmd];
    } else {
        process.nextTick(function () {
            startListenAndInvokeCmd(bself, subGroup, cmd);
        });
    }
    removeAllEvtListener(evtHandlers);
}

function getGeneralEvtHandler (subGroup, cmdName, opCode) {
    var handlerObj = {};

    if (subGroup + cmdName === 'GapCmdStatus') {
        handlerObj['GapCmdStatus:' + opCode] = cmdStatusEvtHandler;
    } else {
        handlerObj[subGroup + cmdName] = normalEvtHandler;
    }
    return handlerObj;
}

function getAttEvtHandler (subGroup, cmdName, opCode) {
    var rspEvt = BHCI.cmdEvtCorrTable[subGroup][subGroup + cmdName],
        handlerObj = {};

    if (_.isString(rspEvt)) {
        handlerObj[rspEvt] = normalEvtHandler;
    } else if (_.isArray(rspEvt)){
        handlerObj[rspEvt[0]] = multiAttEvtHandler;
    }
    return handlerObj;
}

function getGattEvtHandler (cmdName) {
    var rspEvt = BHCI.cmdEvtCorrTable.Gatt['Gatt' + cmdName],
        evtCorrCmdName,
        opCode;

    if (_.isArray(rspEvt)) {
        rspEvt = rspEvt.evtName;
    }
    evtCorrCmdName = rspEvt.replace('Rsp', 'Req');
    opCode = BHCI.CmdGroup.get('VENDOR_SPECIFIC').value | 
             BHCI.CmdSubGroup.get('Att').value | 
             BHCI.SubGroupCmd.Att.get(evtCorrCmdName.slice(3)).value;

    return getAttEvtHandler('Gatt', cmdName, opCode);
}
function getGapEvtHandler (cmdName) {
    var rspEvt = BHCI.cmdEvtCorrTable.Gap['Gap' + cmdName],
        handlerObj = {};

    if (_.isString(rspEvt)) {
        handlerObj[rspEvt] = normalEvtHandler;
    } else if (_.isArray(rspEvt)) {
        _.forEach(rspEvt, function (evtName) {
            handlerObj[evtName] = normalEvtHandler;
        });
    }
    return handlerObj;
}

function listeningAllEvtMsg (evtHandlers, arr) {
    _.forEach(evtHandlers, function (handler, evtName) {
        arr.push((function () {
            var deferred = Q.defer();
            evtHandlers[evtName] = handler(deferred);
            bleHci.on(evtName, evtHandlers[evtName]);
            return deferred.promise;
        }()));
    });
    return evtHandlers;
}

function removeAllEvtListener (evtHandlers) {
    _.forEach(evtHandlers, function (handler, evtName) {
        bleHci.removeListener(evtName, handler);
    });
}

module.exports = bleHci;