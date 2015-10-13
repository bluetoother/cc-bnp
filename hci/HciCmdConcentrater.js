'use strict'

var _ = require('lodash'),
    Concentrate = require('concentrate'),
    DChunks = require('dissolve-chunks'),
    ru = DChunks().Rule(),
    Q = require('q'),
    BHCI = require('../defs/blehcidefs'),
    cmdMeta = require('./HciCmdMeta');

var hciCmdConcentrater = {
	/*************************************************************************************************/
    /*** Argument Constructor of HCI Layer HCI APIs (and ZPIs)                                     ***/
    /*************************************************************************************************/
    HciSetRxGain: function (rxGain) { return ArgObj.factory('HciSetRxGain', arguments); },
    HciSetTxPower: function (txPower) { return ArgObj.factory('HciSetTxPower', arguments); },
    HciOnePktPerEvt: function (control) { return ArgObj.factory('HciOnePktPerEvt', arguments); },
    HciClkDivideOnHalt: function (control) { return ArgObj.factory('HciClkDivideOnHalt', arguments); },
    HciDeclareNvUsage: function (mode) { return ArgObj.factory('HciDeclareNvUsage', arguments); },
    HciDecrypt: function (key, encText) { return ArgObj.factory('HciDecrypt', arguments); },
    HciSetLocalSupportedFeatures: function (localFeatures) { return ArgObj.factory('HciSetLocalSupportedFeatures', arguments); },
    HciSetFastTxRespTime: function (control) { return ArgObj.factory('HciSetFastTxRespTime', arguments); },
    HciModemTestTx: function (cwMode, txFreq) { return ArgObj.factory('HciModemTestTx', arguments); },
    HciModemHopTestTx: function () { return ArgObj.factory('HciModemHopTestTx', arguments); },
    HciModemTestRx: function (rxFreq) { return ArgObj.factory('HciModemTestRx', arguments); },
    HciEndModemTest: function () { return ArgObj.factory('HciEndModemTest', arguments); },
    HciSetBdaddr: function (bdAddr) { return ArgObj.factory('HciSetBdaddr', arguments); },
    HciSetSca: function (scalnPPM) { return ArgObj.factory('HciSetSca', arguments); },
    HciEnablePtm: function () { return ArgObj.factory('HciEnablePtm', arguments); },
    HciSetFreqTune: function (step) { return ArgObj.factory('HciSetFreqTune', arguments); },
    HciSaveFreqTune: function () { return ArgObj.factory('HciSaveFreqTune', arguments); },
    HciSetMaxDtmTxPower: function (txPower) { return ArgObj.factory('HciSetMaxDtmTxPower', arguments); },
    HciMapPmIoPort: function (ioPort, ioPin) { return ArgObj.factory('HciMapPmIoPort', arguments); },
    HciDisconnectImmed: function (connHandle) { return ArgObj.factory('HciDisconnectImmed', arguments); },
    HciPer: function (connHandle, cmd) { return ArgObj.factory('HciPer', arguments); },
    HciPerByChan: function (connHandle, perByChan) { return ArgObj.factory('HciPerByChan', arguments); },
    HciExtendRfRange: function () { return ArgObj.factory('HciExtendRfRange', arguments); },
    HciAdvEventNotice: function (taskId, cmd) { return ArgObj.factory('HciAdvEventNotice', arguments); },
    HciConnEventNotice: function (taskId, taskEvt) { return ArgObj.factory('HciConnEventNotice', arguments); },
    HciHaltDuringRf: function (mode) { return ArgObj.factory('HciHaltDuringRf', arguments); },
    HciOverrideSl: function (taskId) { return ArgObj.factory('HciOverrideSl', arguments); },
    HciBuildRevision: function (mode, userRevNum) { return ArgObj.factory('HciBuildRevision', arguments); },
    HciDelaySleep: function (delay) { return ArgObj.factory('HciDelaySleep', arguments); },
    HciResetSystem: function (mode) { return ArgObj.factory('HciResetSystem', arguments); },
    HciOverlappedProcessing: function (mode) { return ArgObj.factory('HciOverlappedProcessing', arguments); },
    HciNumCompletedPktsLimit: function (limit, flushOnEvt) { return ArgObj.factory('HciNumCompletedPktsLimit', arguments); },
    /*************************************************************************************************/
    /*** Argument Constructor of L2CAP Layer HCI APIs (and ZPIs)                                   ***/
    /*************************************************************************************************/
    L2capParamUPpdateReq: function (connHandle, intervalMin, intervalMax, slaveLatency, timeoutMultiplier) { return ArgObj.factory('L2capParamUPpdateReq', arguments); },
    /*************************************************************************************************/
    /*** Argument Constructor of ATT Layer HCI APIs (and ZPIs)                                     ***/
    /*************************************************************************************************/
    AttErrorRsp: function (connHandle, reqOpcode, handle, errCode) { return ArgObj.factory('AttErrorRsp', arguments); },
    AttExchangeMtuReq: function (connHandle, clientRxMTU) { return ArgObj.factory('AttExchangeMtuReq', arguments); },
    AttExchangeMtuRsp: function (connHandle, serverRxMTU) { return ArgObj.factory('AttExchangeMtuRsp', arguments); },
    AttFindInfoReq: function (connHandle, startHandle, endHandle) { return ArgObj.factory('AttFindInfoReq', arguments); },
    AttFindInfoRsp: function (connHandle, format, info) { return ArgObj.factory('AttFindInfoRsp', arguments); },
    AttFindByTypeValueReq: function (connHandle, startHandle, endHandle, type, value) { return ArgObj.factory('AttFindByTypeValueReq', arguments); },
    AttFindByTypeValueRsp: function (connHandle, handlesInfo) { return ArgObj.factory('AttFindByTypeValueRsp', arguments); },
    AttReadByTypeReq: function (connHandle, startHandle, endHandle, type) { return ArgObj.factory('AttReadByTypeReq', arguments); },
    AttReadByTypeRsp: function (connHandle, length, data) { return ArgObj.factory('AttReadByTypeRsp', arguments); },
    AttReadReq: function (connHandle, handle) { return ArgObj.factory('AttReadReq', arguments); },
    AttReadRsp: function (connHandle, value) { return ArgObj.factory('AttReadRsp', arguments); },
    AttReadBlobReq: function (connHandle, handle, offset) { return ArgObj.factory('AttReadBlobReq', arguments); },
    AttReadBlobRsp: function (connHandle, value) { return ArgObj.factory('AttReadBlobRsp', arguments); },
    AttReadMultiReq: function (connHandle, handles) { return ArgObj.factory('AttReadMultiReq', arguments); },
    AttReadMultiRsp: function (connHandle, value) { return ArgObj.factory('AttReadMultiRsp', arguments); },
    AttReadByGrpTypeReq: function (connHandle, startHandle, endHandle, type) { return ArgObj.factory('AttReadByGrpTypeReq', arguments); },
    AttReadByGrpTypeRsp: function (connHandle, length, data) { return ArgObj.factory('AttReadByGrpTypeRsp', arguments); },
    AttWriteReq: function (connHandle, signature, command, handle, value) { return ArgObj.factory('AttWriteReq', arguments); },
    AttWriteRsp: function (connHandle) { return ArgObj.factory('AttWriteRsp', arguments); },
    AttPrepareWriteReq: function (connHandle, handle, offset, value) { return ArgObj.factory('AttPrepareWriteReq', arguments); },
    AttPrepareWriteRsp: function (connHandle, handle, offset, value) { return ArgObj.factory('AttPrepareWriteRsp', arguments); },
    AttExecuteWriteReq: function (connHandle, flags) { return ArgObj.factory('AttExecuteWriteReq', arguments); },
    AttExecuteWriteRsp: function (connHandle) { return ArgObj.factory('AttExecuteWriteRsp', arguments); },
    AttHandleValueNoti: function (connHandle, authenticated, handle, value) { return ArgObj.factory('AttHandleValueNoti', arguments); },
    AttHandleValueInd: function (connHandle, authenticated, handle, value) { return ArgObj.factory('AttHandleValueInd', arguments); },
    AttHandleValueCfm: function (connHandle) { return ArgObj.factory('AttHandleValueCfm', arguments); },
    /*************************************************************************************************/
    /*** Argument Constructor of GATT Layer HCI APIs (and ZPIs)                                    ***/
    /*************************************************************************************************/
    GattExchangeMtu: function (connHandle, clientRxMTU) { return ArgObj.factory('GattExchangeMtu', arguments); },
    GattDiscAllPrimaryServices: function (connHandle) { return ArgObj.factory('GattDiscAllPrimaryServices', arguments); },
    GattDiscPrimaryServiceByUuid: function (connHandle, value) { return ArgObj.factory('GattDiscPrimaryServiceByUuid', arguments); },
    GattFindIncludedServices: function (connHandle, startHandle, endHandle) { return ArgObj.factory('GattFindIncludedServices', arguments); },
    GattDiscAllChars: function (connHandle, startHandle, endHandle) { return ArgObj.factory('GattDiscAllChars', arguments); },
    GattDiscCharsByUuid: function (connHandle, startHandle, endHandle, type) { return ArgObj.factory('GattDiscCharsByUuid', arguments); },
    GattDiscAllCharDescs: function (connHandle, handle, offset) { return ArgObj.factory('GattDiscAllCharDescs', arguments); },
    GattReadCharValue: function (connHandle, handle) { return ArgObj.factory('GattReadCharValue', arguments); },
    GattReadUsingCharUuid: function (connHandle, startHandle, endHandle, type) { return ArgObj.factory('GattReadUsingCharUuid', arguments); },
    GattReadLongCharValue: function (connHandle, handle, offset) { return ArgObj.factory('GattReadLongCharValue', arguments); },
    GattReadMultiCharValues:function (connHandle, handles) { return ArgObj.factory('GattReadMultiCharValues', arguments); }, 
    GattWriteNoRsp: function (connHandle, handle, value) { return ArgObj.factory('GattWriteNoRsp', arguments); },
    GattSignedWriteNoRsp: function (connHandle, handle, value) { return ArgObj.factory('GattSignedWriteNoRsp', arguments); },
    GattWriteCharValue: function (connHandle, signature, command, handle, value) { return ArgObj.factory('GattWriteCharValue', arguments); },
    GattWriteLongCharValue: function (connHandle, handle, offset, value) { return ArgObj.factory('GattWriteLongCharValue', arguments); },
    GattReliableWrites: function (connHandle, numberRequests, requests) { return ArgObj.factory('GattReliableWrites', arguments); },
    GattReadCharDesc: function (connHandle, handle) { return ArgObj.factory('GattReadCharDesc', arguments); },
    GattReadLongCharDesc: function (connHandle, handle, offset) { return ArgObj.factory('GattReadLongCharDesc', arguments); },
    GattWriteCharDesc: function (connHandle, signature, command, handle, value) { return ArgObj.factory('GattWriteCharDesc', arguments); },
    GattWriteLongCharDesc: function (connHandle, handle, offset, value) { return ArgObj.factory('GattWriteLongCharDesc', arguments); },
    GattNotification: function (connHandle, authenticated, handle, value) { return ArgObj.factory('GattNotification', arguments); },
    GattIndication: function (connHandle, authenticated, handle, value) { return ArgObj.factory('GattIndication', arguments); },
    GattAddService: function (UUID, numAttrs) { return ArgObj.factory('GattAddService', arguments); },
    GattDelService: function (handle) { return ArgObj.factory('GattDelService', arguments); },
    GattAddAttribute: function (UUID, permissions) { return ArgObj.factory('GattAddAttribute', arguments); },
    /*************************************************************************************************/
    /*** Argument Constructor of GAP Layer HCI APIs (and ZPIs)                                     ***/
    /*************************************************************************************************/
    GapDeviceInit: function (profileRole, maxScanResponses, IRK, CSRK, signCounter) { return ArgObj.factory('GapDeviceInit', arguments); },
    GapConfigDeviceAddr: function (BitMask, Addr) { return ArgObj.factory('GapConfigDeviceAddr', arguments); },
    GapDeviceDiscReq: function (mode, activeScan, whiteList) { return ArgObj.factory('GapDeviceDiscReq', arguments); },
    GapDeviceDiscCancel: function () { return ArgObj.factory('GapDeviceDiscCancel', arguments); },
    GapMakeDiscoverable: function (eventType, initiatorAddrType, initiatorAddr, channelMap, filterPolicy) { return ArgObj.factory('GapMakeDiscoverable', arguments); },
    GapUpdateAdvData: function (adType, daraLen, advertData) { return ArgObj.factory('GapUpdateAdvData', arguments); },
    GapEndDisc: function () { return ArgObj.factory('GapEndDisc', arguments); },
    GapEstLinkReq: function (highDutyCycle, whiteList, addrtypePeer, peerAddr) { return ArgObj.factory('GapEstLinkReq', arguments); },
    GapTerminateLink: function (connHandle, reason) { return ArgObj.factory('GapTerminateLink', arguments); },
    GapAuthenticate: function (connHandle, secReq_ioCaps, secReq_oobAvailable, secReq_oob, secReq_authReq, secReq_maxEncKeySize, secReq_keyDist, pairReq_Enable, pairReq_ioCaps, pairReq_oobDataFlag, pairReq_authReq, pairReq_maxEncKeySize, pairReq_keyDist) { return ArgObj.factory('GapAuthenticate', arguments); },
    GapPasskeyUpdate: function (connHandle, passkey) { return ArgObj.factory('GapPasskeyUpdate', arguments); },
    GapSlaveSecurityReqUpdate: function (connHandle, authReq) { return ArgObj.factory('GapSlaveSecurityReqUpdate', arguments); },
    GapSignable: function (connHandle, authenticated, CSRK, signCounter) { return ArgObj.factory('GapSignable', arguments); },
    GapBond: function (connHandle, authenticated, LTK, DIV, rand, LTKsize) { return ArgObj.factory('GapBond', arguments); },
    GapTerminateAuth: function (connHandle, reason) { return ArgObj.factory('GapTerminateAuth', arguments); },
    GapUpdateLinkParamReq: function (connHandle, intervalMin, intervalMax, connLatency, connTimeout) { return ArgObj.factory('GapUpdateLinkParamReq', arguments); },
    GapSetParam: function (paramID, paramValue) { return ArgObj.factory('GapSetParam', arguments); },
    GapGetParam: function (paramID) { return ArgObj.factory('GapGetParam', arguments); },
    GapResolvePrivateAddr: function (IRK, Addr) { return ArgObj.factory('GapResolvePrivateAddr', arguments); },
    GapSETAdvToken: function (adType, advDataLen, advData) { return ArgObj.factory('GapSETAdvToken', arguments); },
    GapRemoveAdvToken: function (adType) { return ArgObj.factory('GapRemoveAdvToken', arguments); },
    GapUpdateAdvTokens: function () { return ArgObj.factory('GapUpdateAdvTokens', arguments); },
    GapBondSetParam: function (paramID, paramDataLan, paramData) { return ArgObj.factory('GapBondSetParam', arguments); },
    GapBondGetParam: function (paramID) { return ArgObj.factory('GapBondGetParam', arguments); },
    /*************************************************************************************************/
    /*** Argument Constructor of UTIL Layer HCI APIs (and ZPIs)                                    ***/
    /*************************************************************************************************/
    UtilNvRead: function (nvID, nvDataLen) { return ArgObj.factory('UtilNvRead', arguments); },
	UtilNvWrite: function (nvID, nvDataLen, nvData) { return ArgObj.factory('UtilNvWrite', arguments); },
	UtilForceBoot: function () { return ArgObj.factory('UtilForceBoot', arguments); }
};

/***************************************************************************************************/
/*** Private Member in This Module                                                               ***/
/***************************************************************************************************/

/***************************************************************************************************/
/*** ArgObj Class                                                                                ***/
/***************************************************************************************************/
// Parent constructor of all argobjs which have command and event type. It has a static factory method() to create argobjs
// It also has methods: getCmdAttrs(), makeArgObj(), storeCmdAttrs(), getHciCmdBuf(),
// We use the meta-programming to create instances when needed. The meta-data is the argument information of each API.
/**
 * @class ArgObj
 * @constructor
 * @private
 */
function ArgObj() {}

/**
 * @method getCmdAttrs
 * @return {Object} the meta data of the command construction
 * @private
 */
ArgObj.prototype.getCmdAttrs = function () {
    return this.constructor[this.constr_name].cmdAttrs;
};

/**
 * @method makeArgObj
 * @param inArg {Array} the command input arguments
 * @return {Object} value object made from the input arguments
 * @private
 */
ArgObj.prototype.makeArgObj = function (inArg) {
    var cmdParams = this.getCmdAttrs().params,
        paramLen = cmdParams.length;

    for (var i = 0; i < paramLen; i += 1) {
        this[cmdParams[i]] = inArg[i];
    }

    return this;
};

/**
 * @method storeCmdAttrs
 * @param cmdAttrs {Object} the cmdBpi meta data
 * @return {Object} value object made by the input arguments
 * @private
 */
ArgObj.prototype.storeCmdAttrs = function (cmdAttrs) {
    // store zpiMeta to the specialized constructor only once
    if (ArgObj[this.constr_name].cmdAttrs === undefined) {
        ArgObj[this.constr_name].cmdAttrs = cmdAttrs;
    }
    return this;
};

/**
 * @method transToArgObj
 * @param argInstance {Object} value object of the command input arguments
 * @return {Object} value object that inherits ArgObj[constr_name] subclass
 * @private
 */
ArgObj.prototype.transToArgObj = function (argInstance) {
    var cmdParams = this.getCmdAttrs().params;
        paramLen = cmdParams.length,
        inArg = [];

    if (argInstance instanceof ArgObj[this.constr_name]) {
        return argInstance;
    }

    for (var i = 0; i < arg_len; i += 1) {
        if (!argInstance.hasOwnProperty(cmdParams[i])) {
            return new Error('The argument object has incorrect properties.');
        }

        inArg.push(argInstance[cmdParams[i]]);
    }

    return this.makeArgObj(inArg);
};

/**
 * @method getHciCmdBuf
 * @return {Buffer} HCI command frame of the command
 * @private
 */
ArgObj.prototype.getHciCmdBuf = function () {
    var dataBuf = Concentrate(),
        cmdAttrs = this.getCmdAttrs(),
        cmdParams = cmdAttrs.params,
        paramTypes = cmdAttrs.types,
        paramLen = cmdParams.length,
        paramVal,
        tmpBuf;

    for (var i = 0; i < paramLen; i += 1) {
        paramVal = this[cmdParams[i]];
        checkType(paramVal, paramTypes[i], cmdParams[i]);

        switch (paramTypes[i]) {
            case 'uint8':
            case 'uint16be':
            case 'uint16le':
            case 'uint32le':
            case 'buffer':
            case 'string':
                dataBuf = dataBuf[paramTypes[i]](paramVal);
                break;

            case 'buffer6':
            case 'buffer8':
            case 'buffer16':
                dataBuf = dataBuf.buffer(paramVal);
                break;

            case 'addr':
                var tmpBuf = new Buffer(6).fill(0),
                    paramVal = paramVal;
                for (var j = 0; j < 6; j++) {
                    tmpBuf.writeUInt8( paramVal.readUInt8(j), (5-j) );
                }
                dataBuf = dataBuf.buffer(tmpBuf);
                break;

            case 'obj':
                dataBuf = generateObjBuf(dataBuf, this.constr_name, paramVal, cmdAttrs.objInfo, this[cmdParams[i-1]]);
                break

            default:
                throw new Error("Unknown Data Type");
        }
    }
    return dataBuf.result();
}

//for test
ArgObj.prototype.getHciCmdParser = function (bufLen) {
    var self = this,
        cmdAttrs = this.getCmdAttrs(),
        attrParams = cmdAttrs.params,
        attrTypes = cmdAttrs.types,
        attrLen = attrParams.length,
        chunkRule = [],
        bufferLen;

    for (var i = 0; i < attrLen; i += 1) {
        (function () {
            if (_.startsWith(attrTypes[i], 'buffer')) {
                bufferLen = _.parseInt(attrTypes[i].slice(6));
                if(!bufferLen) {
                    bufferLen = bufLen - cmdAttrs.preBufLen;
                }
                chunkRule.push(ru.buffer(attrParams[i], bufferLen));
            } else if (attrTypes[i] === 'obj') {
                chunkRule.push(processAppendCmdAttrs(self, bufLen, attrParams[i]));
            } else {
                chunkRule.push(ru[attrTypes[i]](attrParams[i]));
            }   
        }());
    }
    return DChunks().join(chunkRule).compile();
}

//for test
ArgObj.prototype.parseCmdFrame = function (buf, callback) {
    var deferred = Q.defer(),
        self = this,
        cmdAttrs = this.getCmdAttrs(),
        params = cmdAttrs.params,
        types = cmdAttrs.types,
        cmdParser;

    cmdParser = this.getHciCmdParser(buf.length);
    cmdParser.on('parsed', function (result) {
        deferred.resolve(result);
    });
    cmdParser.write(buf);

    return deferred.promise.nodeify(callback);
}

 /**
 * This is the factory of the argument value object for the command
 * @method factory
 * @static
 * @param constrName {String} command constr name
 * @param inArg {Array} input arguments of the command
 * @return {Object} value object of the corresponding command
 * @private
 */
ArgObj.factory = function (constrName, inArg) {
    var new_argobj;

    ArgObj[constrName] = function () {
        var cmdAttrs = cmdMeta[constrName];
        this.constr_name = constrName;
        this.storeCmdAttrs(cmdAttrs);
    };

    if (!cmdMeta[constrName]) { throw new Error(ArgObj[constrName] + " doesn't exist"); }

    if (!_.isFunction(ArgObj[constrName].prototype.getCmdAttrs)) {
        ArgObj[constrName].prototype = new ArgObj();
    }

    new_argobj = (new ArgObj[constrName]()).makeArgObj(inArg);

    return new_argobj;
};

/*************************************************************************************************/
/*** Private Functions                                                                         ***/
/*************************************************************************************************/
function generateObjBuf(dataBuf, constrName, objVal, objInfo, length) {
    var objParams = objInfo.params,
        objTypes = objInfo.types,
        index = 0;

    if (constrName === 'AttFindInfoRsp') {
       if (length === 1) {
            objInfo.types[1] = 'uint16le';
        } else if (length === 2) {
            objInfo.types[1] = 'buffer';
        } 
    }

    _.forEach(objVal, function (paramVal, key) {
        dataBuf = dataBuf[objTypes[index]](paramVal);
        index++;
        if (index === objTypes.length) { index = 0 }
    });
    return dataBuf;
}

function checkType(data, type, param) {
    var typeObj = {
        uint8: 255,
        uint16be: 65535,
        uint16le: 65535,
        uint32le: 4294967295,
        buffer: 255,
        buffer8: 8,
        buffer16: 16,
        addr: 6
    }

    switch (type) {
        case 'uint8':
        case 'uint16be':
        case 'uint16le':
        case 'uint32le':
            if (!(_.isNumber(data)) || (data < 0) || (data > typeObj[type])) { 
                throw new Error(param + ' must be an integer from 0 to ' + typeObj[type] + '.'); 
            }
            break;

        case 'buffer':
        case 'buffer6':
        case 'buffer8':
        case 'buffer16':
        case 'addr':
            if (!(Buffer.isBuffer(data)) || (data.length < 0) || (data.length > typeObj[type])) {
                throw new Error(param + ' must be a buffer with length less than ' + typeObj[type] + ' bytes. ' + data.length + ' bytes detected.');
                break;
            }
            break;

        case 'string':
            if (!_.isString(data)) {
                throw new Error(param + ' must be a string.');
            }
            break;

        case 'obj':
            if (!_.isObject(data)) {
                throw new Error(param + ' must be a object.');
            }
            break;

        default:
            throw new Error("Unknown Data Type");
    }
}

//for test
function processAppendCmdAttrs (argObj, bufLen, objName) {
    var extChunkRule,
        constrName = argObj.constr_name,
        cmdAttrs = argObj.getCmdAttrs(),
        objInfo = cmdAttrs.objInfo,
        params = objInfo.params,
        types = objInfo.types,
        bufferLen;

    if (_.startsWith(constrName, 'Att') || constrName === 'GattReadMultiCharValues' || constrName === 'GattReliableWrites') {
        bufferLen = bufLen - objInfo.precedingLen;
        if (bufferLen < objInfo.minLen) {
            throw new Error('The length of the ' + params[0] + ' field of ' + constrName + ' is incorrect.');
        }
    }

    switch (constrName) {
        case 'AttFindInfoRsp':
            extChunkRule = ru.AttFindInfoRsp(objName, bufferLen);
            break;

        case 'AttFindByTypeValueRsp':
        case 'AttReadMultiReq':
        case 'GattReadMultiCharValues':
            extChunkRule = ru.attObj(bufferLen, objName, objInfo);
            break;

        case 'AttReadByTypeRsp':
        case 'AttReadByGrpTypeRsp':
            extChunkRule = ru.attObjRead(bufferLen, objName, objInfo);
            break;

        case 'GattReliableWrites':
            extChunkRule = ru.GattReliableWrites(bufferLen, objName, objInfo);
            break;

        default:
            throw new Error(argObj.constr_name + 'event packet error!');
    }
    return extChunkRule;
};

//for test
/*************************************************************************************************/
/*** Specific Chunk Rules                                                                      ***/
/*************************************************************************************************/
ru.clause('addr', function (name) {
    this.buffer(name, 6).tap(function () {
        var tmpBuf = new Buffer(6).fill(0),
            origBuf = this.vars[name];

        for (var i = 0; i < 6; i++) {
            tmpBuf.writeUInt8( origBuf.readUInt8(i), (5-i) );
        }
        this.vars[name] = tmpBuf;
    });
});

ru.clause('AttFindInfoRsp', function (objName, bufLen) {
    var loopTimes,
        uuidType;
  
    this.tap(function () {
        if (this.vars.format === 1) {
            loopTimes = bufLen / 4;
            uuidType = 'uint16le';
        } else if (this.vars.format === 2) {
            loopTimes = bufLen / 18;
            uuidType = 'buffer';
        }
    }).tap(objName, function (end) {
        for (var i = 0; i < loopTimes; i += 1) {
            this.uint16le('handle' + i)[uuidType](('uuid' + i), 16);
        }
    }).tap(function () {
        for (var k in this.vars) {
            delete this.vars[k].__proto__;
        }
    });
});

ru.clause('attObj', function (buflen, objName, objInfo) {
    var objLen = objInfo.objLen,
        objParams = objInfo.params,
        objTypes = objInfo.types,
        loopTimes = buflen / objLen,
        self = this;

    this.tap(objName, function (end) {

        for (var i = 0; i < loopTimes; i += 1) {
            _.forEach(objParams, function(param, key) {
                self[objTypes[key]](param + i);
            });
        }
    }).tap(function () {
        for (var k in this.vars) {
            delete this.vars[k].__proto__;
        }
    });
});

ru.clause('attObjRead', function (buflen, objName, objInfo) {
    var objParams = objInfo.params,
        objTypes = objInfo.types,
        loopTimes, eachBufLen,
        self = this;

    this.tap(function () {
        loopTimes = buflen / this.vars.length;
        eachBufLen = this.vars.length - objInfo.preBufLen;
    }).tap(objName, function (end) {
        for (var i = 0; i < loopTimes; i += 1) {
            _.forEach(objParams, function(param, key) {
                self[objTypes[key]](param + i, eachBufLen);
            });
        }
    }).tap(function () {
        for (var k in this.vars) {
            delete this.vars[k].__proto__;
        }
    });
});

ru.clause('GattReliableWrites', function (buflen, objName, objInfo) {
    var objParams = objInfo.params,
        objTypes = objInfo.types,
        loopTimes, eachBufLen, 
        self = this;

    this.tap(function () {
        loopTimes = this.vars.numberRequests;
        eachBufLen = (buflen / this.vars.numberRequests) - objInfo.preBufLen;
    }).tap(objName, function (end) {
        for (var i = 0; i < loopTimes; i += 1) {
            _.forEach(objParams, function(param, key) {
                self[objTypes[key]](param + i, eachBufLen);
            });
        }
    }).tap(function () {
        for (var k in this.vars) {
            delete this.vars[k].__proto__;
        }
    });
});

module.exports = hciCmdConcentrater;
