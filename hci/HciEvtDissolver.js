'use strict'

var Q = require('q'),
    _ = require('lodash'),
    DChunks = require('dissolve-chunks'),
    ru = DChunks().Rule(),
    BHCI = require('../defs/bhcidefs');

var hciEventDissolver = {
	/*************************************************************************************************/
    /*** Argument Constructor of HCI Layer HCI APIs (and ZPIs)                                     ***/
    /*************************************************************************************************/
    HciSetRxGain: function () { return ArgObj.factory('HciSetRxGain'); },
    HciSetTxPower: function () { return ArgObj.factory('HciSetTxPower'); },
    HciOnePktPerEvt: function () { return ArgObj.factory('HciOnePktPerEvt'); },
    HciClkDivideOnHalt: function () { return ArgObj.factory('HciClkDivideOnHalt'); },
    HciDeclareNvUsage: function () { return ArgObj.factory('HciDeclareNvUsage'); },
    HciDecrypt: function () { return ArgObj.factory('HciDecrypt'); },
    HciSetLocalSupportedFeatures: function () { return ArgObj.factory('HciSetLocalSupportedFeatures'); },
    HciSetFastTxRespTime: function () { return ArgObj.factory('HciSetFastTxRespTime'); },
    HciModemTestTx: function () { return ArgObj.factory('HciModemTestTx'); },
    HciModemHopTestTx: function () { return ArgObj.factory('HciModemHopTestTx'); },
    HciModemTestRx: function () { return ArgObj.factory('HciModemTestRx'); },
    HciEndModemTest: function () { return ArgObj.factory('HciEndModemTest'); },
    HciSetBdaddr: function () { return ArgObj.factory('HciSetBdaddr'); },
    HciSetSca: function () { return ArgObj.factory('HciSetSca'); },
    // HciEnablePtm: function () { return ArgObj.factory('HciEnablePtm'); },
    HciSetFreqTune: function () { return ArgObj.factory('HciSetFreqTune'); },
    HciSaveFreqTune: function () { return ArgObj.factory('HciSaveFreqTune'); },
    HciSetMaxDtmTxPower: function () { return ArgObj.factory('HciSetMaxDtmTxPower'); },
    HciMapPmIoPort: function () { return ArgObj.factory('HciMapPmIoPort'); },
    HciDisconnectImmed: function () { return ArgObj.factory('HciDisconnectImmed'); },
    HciPer: function () { return ArgObj.factory('HciPer'); },
    HciPerByChan: function () { return ArgObj.factory('HciPerByChan'); },
    HciExtendRfRange: function () { return ArgObj.factory('HciExtendRfRange'); },
    // HciAdvEventNotice: function () { return ArgObj.factory('HciAdvEventNotice'); },
    // HciConnEventNotice: function () { return ArgObj.factory('HciConnEventNotice'); },
    HciHaltDuringRf: function () { return ArgObj.factory('HciHaltDuringRf'); },
    HciOverrideSl: function () { return ArgObj.factory('HciOverrideSl'); },
    HciBuildRevision: function () { return ArgObj.factory('HciBuildRevision'); },
    HciDelaySleep: function () { return ArgObj.factory('HciDelaySleep'); },
    HciResetSystem: function () { return ArgObj.factory('HciResetSystem'); },
    HciOverlappedProcessing: function () { return ArgObj.factory('HciOverlappedProcessing'); },
    HciNumCompletedPktsLimit: function () { return ArgObj.factory('HciNumCompletedPktsLimit'); },
    /*************************************************************************************************/
    /*** Argument Constructor of L2CAP Layer HCI APIs (and ZPIs)                                   ***/
    /*************************************************************************************************/
    L2capCmdReject: function () { return ArgObj.factory('L2capCmdReject'); },
    L2capParamUpdateRsp: function () { return ArgObj.factory('L2capParamUpdateRsp'); },
    /*************************************************************************************************/
    /*** Argument Constructor of ATT Layer HCI APIs (and ZPIs)                                     ***/
    /*************************************************************************************************/
    AttErrorRsp: function () { return ArgObj.factory('AttErrorRsp'); },
    AttExchangeMtuReq: function () { return ArgObj.factory('AttExchangeMtuReq'); },
    AttExchangeMtuRsp: function () { return ArgObj.factory('AttExchangeMtuRsp'); },
    AttFindInfoReq: function () { return ArgObj.factory('AttFindInfoReq'); },
    AttFindInfoRsp: function () { return ArgObj.factory('AttFindInfoRsp'); },
    AttFindByTypeValueReq: function () { return ArgObj.factory('AttFindByTypeValueReq'); },
    AttFindByTypeValueRsp: function () { return ArgObj.factory('AttFindByTypeValueRsp'); },
    AttReadByTypeReq: function () { return ArgObj.factory('AttReadByTypeReq'); },
    AttReadByTypeRsp: function () { return ArgObj.factory('AttReadByTypeRsp'); },
    AttReadReq: function () { return ArgObj.factory('AttReadReq'); },
    AttReadRsp: function () { return ArgObj.factory('AttReadRsp'); },
    AttReadBlobReq: function () { return ArgObj.factory('AttReadBlobReq'); },
    AttReadBlobRsp: function () { return ArgObj.factory('AttReadBlobRsp'); },
    AttReadMultiReq: function () { return ArgObj.factory('AttReadMultiReq'); },
    AttReadMultiRsp: function () { return ArgObj.factory('AttReadMultiRsp'); },
    AttReadByGrpTypeReq: function () { return ArgObj.factory('AttReadByGrpTypeReq'); },
    AttReadByGrpTypeRsp: function () { return ArgObj.factory('AttReadByGrpTypeRsp'); },
    AttWriteReq: function () { return ArgObj.factory('AttWriteReq'); },
    AttWriteRsp: function () { return ArgObj.factory('AttWriteRsp'); },
    AttPrepareWriteReq: function () { return ArgObj.factory('AttPrepareWriteReq'); },
    AttPrepareWriteRsp: function () { return ArgObj.factory('AttPrepareWriteRsp'); },
    AttExecuteWriteReq: function () { return ArgObj.factory('AttExecuteWriteReq'); },
    AttExecuteWriteRsp: function () { return ArgObj.factory('AttExecuteWriteRsp'); },
    AttHandleValueNoti: function () { return ArgObj.factory('AttHandleValueNoti'); },
    AttHandleValueInd: function () { return ArgObj.factory('AttHandleValueInd'); },
    AttHandleValueCfm: function () { return ArgObj.factory('AttHandleValueCfm'); },
    /*************************************************************************************************/
    /*** Argument Constructor of GATT Layer HCI APIs (and ZPIs)                                    ***/
    /*************************************************************************************************/
    GattClientCharCfgUpdate: function () { return ArgObj.factory('GattClientCharCfgUpdate'); },
    /*************************************************************************************************/
    /*** Argument Constructor of GAP Layer HCI APIs (and ZPIs)                                     ***/
    /*************************************************************************************************/
    GapDeviceInitDone: function () { return ArgObj.factory('GapDeviceInitDone'); },
    GapDeviceDiscovery: function () { return ArgObj.factory('GapDeviceDiscovery'); },
    GapAdvDataUpdateDone: function () { return ArgObj.factory('GapAdvDataUpdateDone'); },
    GapMakeDiscoverableDone: function () { return ArgObj.factory('GapMakeDiscoverableDone'); },
    GapEndDiscoverableDone: function () { return ArgObj.factory('GapEndDiscoverableDone'); },
    GapLinkEstablished: function () { return ArgObj.factory('GapLinkEstablished'); },
    GapLinkTerminated: function () { return ArgObj.factory('GapLinkTerminated'); },
    GapLinkParamUpdate: function () { return ArgObj.factory('GapLinkParamUpdate'); },
    GapRandomAddrChanged: function () { return ArgObj.factory('GapRandomAddrChanged'); },
    GapSignatureUpdated: function () { return ArgObj.factory('GapSignatureUpdated'); },
    GapAuthenticationComplete: function () { return ArgObj.factory('GapAuthenticationComplete'); },
    GapPasskeyNeeded: function () { return ArgObj.factory('GapPasskeyNeeded'); },
    GapSlaveRequestedSecurity: function () { return ArgObj.factory('GapSlaveRequestedSecurity'); },
    GapDeviceInfo: function () { return ArgObj.factory('GapDeviceInfo'); },
    GapBondComplete: function () { return ArgObj.factory('GapBondComplete'); },
    GapPairingReq: function () { return ArgObj.factory('GapPairingReq'); },
    GapCmdStatus: function () { return ArgObj.factory('GapCmdStatus'); }
};

/***************************************************************************************************/
/*** Private Member in This Module                                                               ***/
/***************************************************************************************************/

/***************************************************************************************************/
/*** ArgObj Class                                                                                ***/
/***************************************************************************************************/
// Parent constructor of all argobjs which have command and event type. It has a static factory method() to create argobjs
// It also has methods: getEvtAttrs(), storeEvtAttrs(), getHciEvtParser(), getHciEvtPacket(),
// We use the meta-programming to create instances when needed. The meta-data is the argument information of each API.
/**
 * @class ArgObj
 * @constructor
 * @private
 */
function ArgObj() {
}

/**
 * @method getEvtAttrs
 * @return {Object} the attribute of the hci event arguments
 * @private
 */
ArgObj.prototype.getEvtAttrs = function () {
    return this.constructor[this.constr_name].evtAttrs;
};

/**
 * @method storeEvtAttrs
 * @param evtAttrs {Object} the event constructor evtAttrs
 * @return {Object} value object made by the input arguments
 * @private
 */
ArgObj.prototype.storeEvtAttrs = function (evtAttrs) {
    // store evtAttrs to the specialized constructor only once
    if (ArgObj[this.constr_name].evtAttrs === undefined) {
        ArgObj[this.constr_name].evtAttrs = evtAttrs;
    }
    return this;
};

/**
 * @method getHciEvtParser
 * @param bufLen {Number} length of bBuffer and add 2(opcode length)
 * @return {Object} the parser corresponding to the hci event
 * @private
 */
ArgObj.prototype.getHciEvtParser = function (bufLen) {
    var self = this,
        evtAttrs = this.getEvtAttrs(),
        attrParams = evtAttrs.params,
        attrLen = attrParams.length,
        attrTypes = evtAttrs.types,
        attrParamLen = evtAttrs.paramLens,
        chunkRule = [],
        extChunkRule = [],
        bufferLen;

    for (var i = 0; i < attrLen; i += 1) {
        (function () {
            if (_.startsWith(attrTypes[i], 'buffer')) {
                bufferLen = _.parseInt(attrTypes[i].slice(6));
                chunkRule.push(ru.buffer(attrParams[i], bufferLen));
            } else {
                chunkRule.push(ru[attrTypes[i]](attrParams[i]));
            }   
        }());
    }

    if (attrParamLen === 'variable') {
        extChunkRule = processAppendEvtAttrs(self, bufLen);
        return DChunks().join(chunkRule).join(extChunkRule).compile();
    }
    return DChunks().join(chunkRule).compile();
}

/**
 * @method getHciEvtPacket
 * @param bufLen {Number} length of bBuffer and add 2(opcode length)
 * @param bBuffer {Buffer} buffer of HCI event parameters
 * @param callback {Function} 
 * @return {Object} the attribute of HCI event
 * @private
 */
ArgObj.prototype.getHciEvtPacket = function (bufLen, bBuffer, callback) {
    var deferred = Q.defer(),
        evtAttrs = this.getEvtAttrs(),
        attrParamLen = evtAttrs.paramLens,
        parser;

    if (_.isNumber(attrParamLen) && (attrParamLen !== bufLen)) {
        deferred.reject(new Error('Parameter length incorrect.'));
    } else {
        parser = this.getHciEvtParser(bufLen);
        parser.on('parsed', function (result) {
            deferred.resolve(result);
        });
        parser.write(bBuffer);
    }

    return deferred.promise.nodeify(callback);
}

/**
 * This is the factory of the argument value object for the event constructor
 * @method factory
 * @static
 * @param type {String} event constructor name
 * @return {Object} value object of the corresponding event constructor
 * @private
 */
ArgObj.factory = function (type) {
    var constr = type;

    if (typeof ArgObj[constr] !== "function") { throw new Error(constr + " doesn't exist"); }

    if (typeof ArgObj[constr].prototype.getevtAttrs !== "function") {
        ArgObj[constr].prototype = new ArgObj();
    }

    return new ArgObj[constr]();
};

// Specialize the sub-classes
/*************************************************************************************************/
/*** Specialized ArgObj Constructor of HCI HCI APIs                                             ***/
/*************************************************************************************************/
var subConstr = [ 
    'HciSetRxGain', 'HciSetTxPower', 'HciOnePktPerEvt', 'HciClkDivideOnHalt', 'HciDeclareNvUsage', 'HciSetLocalSupportedFeatures',
    'HciSetFastTxRespTime', 'HciModemTestTx', 'HciModemHopTestTx','HciModemTestRx', 'HciEndModemTest', 'HciSetBdaddr', 'HciSetSca',
    'HciSetFreqTune', 'HciSaveFreqTune', 'HciSetMaxDtmTxPower', 'HciMapPmIoPort', 'HciDisconnectImmed', 'HciPerByChan', 'HciExtendRfRange',
    'HciHaltDuringRf', 'HciOverrideSl', 'HciDelaySleep', 'HciResetSystem', 'HciOverlappedProcessing', 'HciNumCompletedPktsLimit'
];

_.forEach(subConstr, function (name) {
    ArgObj[name] = function () {
        this.constr_name = name;
        this.storeEvtAttrs(BHCI.HciAttrs);
    };
});

ArgObj.HciDecrypt = function () {
    var evtAttrs = {
        paramLens: 21,
        params: ['status', 'cmdOpcode', 'plainTextData'],
        types: ['uint8', 'uint16le', 'buffer16']
    };
    this.constr_name = 'HciDecrypt';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.HciPer = function () {
    var evtAttrs = {
        paramLens: 'variable',
        params: ['status', 'cmdOpcode', 'cmdVal'],
        types: ['uint8', 'uint16le', 'uint8'],
        append: {
            paramLens: 14,
            params: ['numPkts', 'numCrcErr', 'numEvents', 'numMissedEvents'],
            types: ['uint16le', 'uint16le', 'uint16le', 'uint16le'],
        }
    };
    this.constr_name = 'HciPer';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.HciBuildRevision = function () {
    var evtAttrs = {
        paramLens: 9,
        params: ['status', 'cmdOpcode', 'userRevNum', 'buildRevNum'],
        types: ['uint8', 'uint16le', 'uint16le', 'uint16le']
    };
    this.constr_name = 'HciBuildRevision';
    this.storeEvtAttrs(evtAttrs);
};
/*************************************************************************************************/
/*** Specialized ArgObj Constructor of L2CAP HCI APIs                                          ***/
/*************************************************************************************************/
ArgObj.L2capCmdReject = function () {
    var evtAttrs = {
        paramLens: 7,
        params: ['status', 'connHandle', 'reason'],
        types: ['uint8', 'uint16le', 'uint16le']
    };
    this.constr_name = 'L2capCmdReject';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.L2capParamUpdateRsp = function () {
    var evtAttrs = {
        paramLens: 7,
        params: ['status', 'connHandle', 'reason'],
        types: ['uint8', 'uint16le', 'uint16le']
    };
    this.constr_name = 'L2capParamUpdateRsp';
    this.storeEvtAttrs(evtAttrs);
};
/*************************************************************************************************/
/*** Specialized ArgObj Constructor of ATT HCI APIs                                            ***/
/*************************************************************************************************/
ArgObj.AttErrorRsp = function () {
    var evtAttrs = {
        paramLens: 10,
        params: ['status', 'connHandle', 'pduLen', 'reqOpcode', 'handle', 'errCode'],
        types: ['uint8', 'uint16le', 'uint8', 'uint8', 'uint16le', 'uint8']
    };
    this.constr_name = 'AttErrorRsp';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.AttExchangeMtuReq = function () {
    var evtAttrs = {
        paramLens: 8,
        params: ['status', 'connHandle', 'pduLen', 'clientRxMTU'],
        types: ['uint8', 'uint16le', 'uint8', 'uint16le']
    };
    this.constr_name = 'AttExchangeMtuReq';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.AttExchangeMtuRsp = function () {
    var evtAttrs = {
        paramLens: 8,
        params: ['status', 'connHandle', 'pduLen', 'serverRxMTU'],
        types: ['uint8', 'uint16le', 'uint8', 'uint16le']
    };
    this.constr_name = 'AttExchangeMtuRsp';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.AttFindInfoReq = function () {
    var evtAttrs = {
        paramLens: 10,
        params: ['status', 'connHandle', 'pduLen', 'startHandle', 'endHandle'],
        types: ['uint8', 'uint16le', 'uint8', 'uint16le', 'uint16le']
    };
    this.constr_name = 'AttFindInfoReq';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.AttFindInfoRsp = function () {
    var evtAttrs = {
        paramLens: 'variable',
        params: ['status', 'connHandle', 'pduLen'],
        types: ['uint8', 'uint16le', 'uint8'],
        append: {
            precedingLen: 7,
            minLen: 4,
            params: ['format', 'info']
        }
    };
    this.constr_name = 'AttFindInfoRsp';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.AttFindByTypeValueReq = function () {
    var evtAttrs = {
        paramLens: 'variable',
        params: ['status', 'connHandle', 'pduLen', 'startHandle', 'endHandle', 'type'],
        types: ['uint8', 'uint16le', 'uint8', 'uint16le', 'uint16le', 'uint16le'],
        append: {
            precedingLen: 12,
            minLen: 0,
            params: ['value']
        }
    };
    this.constr_name = 'AttFindByTypeValueReq';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.AttFindByTypeValueRsp = function () {
    var evtAttrs = {
        paramLens: 'variable',
        params: ['status', 'connHandle', 'pduLen'],
        types: ['uint8', 'uint16le', 'uint8'],
        append: {
            precedingLen: 6,
            minLen: 4,
            params: ['handlesInfo'],
            objAttrs : {
                objLen: 4,
                params: ['attrHandle', 'grpEndHandle'],
                types: ['uint16le', 'uint16le']
            }
        }
    };
    this.constr_name = 'AttFindByTypeValueRsp';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.AttReadByTypeReq = function () { 
    var evtAttrs = {
        paramLens: 'variable',
        params: ['status', 'connHandle', 'pduLen', 'startHandle', 'endHandle'],
        types: ['uint8', 'uint16le', 'uint8', 'uint16le', 'uint16le'],
        append: {
            precedingLen: 10,
            minLen: 2,
            params: ['format']
        }
    };
    this.constr_name = 'AttReadByTypeReq';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.AttReadByTypeRsp = function () { 
    var evtAttrs = {
        paramLens: 'variable',
        params: ['status', 'connHandle', 'pduLen'],
        types: ['uint8', 'uint16le', 'uint8'],
        append: {
            precedingLen: 7,
            minLen: 2,
            params: ['length', 'format'],
            types: ['uint8', 'obj'],
            objAttrs : {
                objBufPreLen: 2,
                params: ['attrHandle', 'attrVal'],
                types: ['uint16le', 'buffer']
            }
        }
    };
    this.constr_name = 'AttReadByTypeRsp';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.AttReadReq = function () {
    var evtAttrs = {
        paramLens: 8,
        params: ['status', 'connHandle', 'pduLen', 'handle'],
        types: ['uint8', 'uint16le', 'uint8', 'uint16le']
    };
    this.constr_name = 'AttReadReq';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.AttReadRsp = function () {
    var evtAttrs = {
        paramLens: 'variable',
        params: ['status', 'connHandle', 'pduLen'],
        types: ['uint8', 'uint16le', 'uint8'],
        append: {
            precedingLen: 6,
            minLen: 0,
            params: ['value']
        }
    };
    this.constr_name = 'AttReadRsp';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.AttReadBlobReq = function () {
    var evtAttrs = {
        paramLens: 10,
        params: ['status', 'connHandle', 'pduLen', 'handle', 'offset'],
        types: ['uint8', 'uint16le', 'uint8', 'uint16le', 'uint16le']
    };
    this.constr_name = 'AttReadBlobReq';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.AttReadBlobRsp = function () {
    var evtAttrs = {
        paramLens: 'variable',
        params: ['status', 'connHandle', 'pduLen'],
        types: ['uint8', 'uint16le', 'uint8'],
        append: {
            precedingLen: 6,
            minLen: 0,
            params: ['value']
        }
    };
    this.constr_name = 'AttReadBlobRsp';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.AttReadMultiReq = function () {
    var evtAttrs = {
        paramLens: 'variable',
        params: ['status', 'connHandle', 'pduLen'],
        types: ['uint8', 'uint16le', 'uint8'],
        append: {
            precedingLen: 6,
            minLen: 4,
            params: ['handles'],
            objAttrs : {
                objLen: 2,
                params: ['handle'],
                types: ['uint16le']
            }
        }
    };
    this.constr_name = 'AttReadMultiReq';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.AttReadMultiRsp = function () {
    var evtAttrs = {
        paramLens: 'variable',
        params: ['status', 'connHandle', 'pduLen'],
        types: ['uint8', 'uint16le', 'uint8'],
        append: {
            precedingLen: 6,
            minLen: 0,
            params: ['value']
        }
    };
    this.constr_name = 'AttReadMultiRsp';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.AttReadByGrpTypeReq = function () { //append
    var evtAttrs = {
        paramLens: 'variable',
        params: ['status', 'connHandle', 'pduLen', 'startHandle', 'endHandle'],
        types: ['uint8', 'uint16le', 'uint8', 'uint16le', 'uint16le'],
        append: {
            precedingLen: 10,
            minLen: 2,
            params: ['type']
        }
    };
    this.constr_name = 'AttReadByGrpTypeReq';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.AttReadByGrpTypeRsp = function () { //append
    var evtAttrs = {
        paramLens: 'variable',
        params: ['status', 'connHandle', 'pduLen', 'length'],
        types: ['uint8', 'uint16le', 'uint8', 'uint8'],
        append: {
            precedingLen: 7,
            minLen: 2,
            params: ['length', 'data'],
            types: ['uint8', 'obj'],
            objAttrs : {
                objBufPreLen: 4,
                params: ['attrHandle', 'endGrpHandle', 'attrVal'],
                types: ['uint16le', 'uint16le', 'buffer']
            }
        }
    };
    this.constr_name = 'AttReadByGrpTypeRsp';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.AttWriteReq = function () {
    var evtAttrs = {
        paramLens: 'variable',
        params: ['status', 'connHandle', 'pduLen', 'signature', 'command', 'handle'],
        types: ['uint8', 'uint16le', 'uint8', 'uint8', 'uint8', 'uint16le'],
        append: {
            precedingLen: 10,
            minLen: 0,
            params: ['value']
        }
    };
    this.constr_name = 'AttWriteReq';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.AttWriteRsp = function () {
    var evtAttrs = {
        paramLens: 6,
        params: ['status', 'connHandle', 'pduLen'],
        types: ['uint8', 'uint16le', 'uint8'],
    };
    this.constr_name = 'AttWriteRsp';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.AttPrepareWriteReq = function () {
    var evtAttrs = {
        paramLens: 'variable',
        params: ['status', 'connHandle', 'pduLen', 'handle', 'offset'],
        types: ['uint8', 'uint16le', 'uint8', 'uint16le', 'uint16le'],
        append: {
            precedingLen: 10,
            minLen: 0,
            params: ['value']
        }
    };	
    this.constr_name = 'AttPrepareWriteReq';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.AttPrepareWriteRsp = function () {
    var evtAttrs = {
        paramLens: 'variable',
        params: ['status', 'connHandle', 'pduLen', 'handle', 'offset'],
        types: ['uint8', 'uint16le', 'uint8', 'uint16le', 'uint16le'],
        append: {
            precedingLen: 10,
            minLen: 0,
            params: ['value']
        }
    };
    this.constr_name = 'AttPrepareWriteRsp';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.AttExecuteWriteReq = function () {
    var evtAttrs = {
        paramLens: 7,
        params: ['status', 'connHandle', 'pduLen', 'value'],
        types: ['uint8', 'uint16le', 'uint8', 'uint8']
    };
    this.constr_name = 'AttExecuteWriteReq';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.AttExecuteWriteRsp = function () {
    var evtAttrs = {
        paramLens: 6,
        params: ['status', 'connHandle', 'pduLen'],
        types: ['uint8', 'uint16le', 'uint8']
    };
    this.constr_name = 'AttExecuteWriteRsp';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.AttHandleValueNoti = function () {
    var evtAttrs = {
        paramLens: 'variable',
        params: ['status', 'connHandle', 'pduLen', 'authenticated', 'handle'],
        types: ['uint8', 'uint16le', 'uint8', 'uint8', 'uint16le'],
        append: {
            precedingLen: 9,
            minLen: 0,
            params: ['value']
        }
    };
    this.constr_name = 'AttHandleValueNoti';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.AttHandleValueInd = function () {
    var evtAttrs = {
        paramLens: 'variable',
        params: ['status', 'connHandle', 'pduLen', 'authenticated', 'handle'],
        types: ['uint8', 'uint16le', 'uint8', 'uint8', 'uint16le'],
        append: {
            precedingLen: 9,
            minLen: 0,
            params: ['value']
        }
    };
    this.constr_name = 'AttHandleValueInd';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.AttHandleValueCfm = function () {
    var evtAttrs = {
        paramLens: 6,
        params: ['status', 'connHandle', 'pduLen'],
        types: ['uint8', 'uint16le', 'uint8']
    };
    this.constr_name = 'AttHandleValueCfm';
    this.storeEvtAttrs(evtAttrs);
};
/*************************************************************************************************/
/*** Specialized ArgObj Constructor of GATT HCI APIs                                           ***/
/*************************************************************************************************/
ArgObj.GattClientCharCfgUpdate = function () {
    var evtAttrs = {
        paramLens: 10,
        params: ['status', 'connHandle', 'pduLen', 'attributeHandle', 'value'],
        types: ['uint8', 'uint16le', 'uint8', 'uint16le', 'uint16le']
    };
    this.constr_name = 'GattClientCharCfgUpdate';
    this.storeEvtAttrs(evtAttrs);
};
/*************************************************************************************************/
/*** Specialized ArgObj Constructor of GAP HCI APIs                                            ***/
/*************************************************************************************************/
ArgObj.GapDeviceInitDone = function () {
    var evtAttrs = {
        paramLens: 44,
        params: ['status', 'devAddr', 'dataPltLen', 'numDataPkts', 'IRK', 'CSRK'],
        types: ['uint8', 'addr', 'uint16le', 'uint8', 'buffer16', 'buffer16']
    };
    this.constr_name = 'GapDeviceInitDone';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.GapDeviceDiscovery = function () {
    var evtAttrs = {
        paramLens: 'variable',
        params: ['status'],
        types: ['uint8'],
        append: {
            params: ['numDevs', 'eventType', 'addrType', 'addr'],
            types: ['uint8', 'uint8', 'uint8', 'addr'],
        }
    };
    this.constr_name = 'GapDeviceDiscovery';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.GapAdvDataUpdateDone = function () {
    var evtAttrs = {
        paramLens: 4,
        params: ['status', 'adType'],
        types: ['uint8', 'uint8']
    };
    this.constr_name = 'GapAdvDataUpdateDone';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.GapMakeDiscoverableDone = function () {
    var evtAttrs = {
        paramLens: 5,
        params: ['status', 'interval'],
        types: ['uint8', 'uint16le']
    };
    this.constr_name = 'GapMakeDiscoverableDone';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.GapEndDiscoverableDone = function () {
    var evtAttrs = {
        paramLens: 3,
        params: ['status'],
        types: ['uint8']
    };
    this.constr_name = 'GapEndDiscoverableDone';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.GapLinkEstablished = function () {
    var evtAttrs = {
        paramLens: 19,
        params: ['status', 'addrType', 'addr', 'connHandle', 'connInterval', 'connLatency', 'connTimeout', 'clockAccuracy'],
        types: ['uint8', 'uint8', 'addr', 'uint16le', 'uint16le', 'uint16le', 'uint16le', 'uint8']
    };
    this.constr_name = 'GapLinkEstablished';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.GapLinkTerminated = function () {
    var evtAttrs = {
        paramLens: 6,
        params: ['status', 'connHandle', 'reason'],
        types: ['uint8', 'uint16le', 'uint8']
    };
    this.constr_name = 'GapLinkTerminated';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.GapLinkParamUpdate = function () {
    var evtAttrs = {
        paramLens: 11,
        params: ['status', 'connHandle', 'connInterval', 'connLatency', 'connTimeout'],
        types: ['uint8', 'uint16le', 'uint16le', 'uint16le', 'uint16le']
    };
    this.constr_name = 'GapLinkParamUpdate';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.GapRandomAddrChanged = function () {
    var evtAttrs = {
        paramLens: 10,
        params: ['status', 'addrType', 'newRandomAddr'],
        types: ['uint8', 'uint8', 'addr']
    };
    this.constr_name = 'GapRandomAddrChanged';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.GapSignatureUpdated = function () { 
    var evtAttrs = {
        paramLens: 16,
        params: ['status', 'addrType', 'devAddr', 'signCounter'],
        types: ['uint8', 'uint8', 'addr', 'buffer6']
    };
    this.constr_name = 'GapSignatureUpdated';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.GapAuthenticationComplete = function () { //TODO, Test
    var evtAttrs = {
        paramLens: 104,
        params: ['status', 'connHandle', 'authState', 'secInfo', 'sec_ltkSize', 'sec_ltk', 'sec_div', 'sec_rand', 'devSecInfo', 'dev_ltkSize',
                 'dev_ltk', 'dev_div', 'dev_rand', 'identityInfo', 'identity_irk', 'identity_bd_addr', 'signingInfo', 'signing_irk', 'signing_signCounter'],
        types: ['uint8', 'uint16le', 'uint8', 'uint8', 'uint8', 'buffer16', 'uint16le', 'uint64', 'uint8', 'uint8', 'buffer16', 'uint16le', 'uint64',
                'uint8', 'buffer16', 'addr', 'uint8', 'buffer16', 'uint32le'],
    };
    this.constr_name = 'GapAuthenticationComplete';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.GapPasskeyNeeded = function () {
    var evtAttrs = {
        paramLens: 13,
        params: ['status', 'devAddr', 'connHandle', 'uiInput', 'uiOutput'],
        types: ['uint8', 'addr', 'uint16le', 'uint8', 'uint8']
    };
    this.constr_name = 'GapPasskeyNeeded';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.GapSlaveRequestedSecurity = function () {
    var evtAttrs = {
        paramLens: 12,
        params: ['status', 'connHandle', 'devAddr', 'authReq'],
        types: ['uint8', 'uint16le', 'addr', 'uint8']
    };
    this.constr_name = 'GapSlaveRequestedSecurity';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.GapDeviceInfo = function () {
    var evtAttrs = {
        paramLens: 'variable',
        params: ['status', 'eventType', 'addrType', 'addr', 'rssi'],
        types: ['uint8', 'uint8', 'uint8', 'addr', 'uint8'],
        append: {
            params: ['dataLen', 'dataField'],
            types: ['uint8', 'buffer'],
        }
    };
    this.constr_name = 'GapDeviceInfo';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.GapBondComplete = function () {
    var evtAttrs = {
        paramLens: '5',
        params: ['status', 'connHandle'],
        types: ['uint8', 'uint16le']
    };
    this.constr_name = 'GapBondComplete';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.GapPairingReq = function () {
    var evtAttrs = {
        paramLens: '10',
        params: ['status', 'connHandle', 'ioCap', 'oobDataFlag', 'authReq', 'maxEncKeySize', 'keyDist'],
        types: ['uint8', 'uint16le', 'uint8', 'uint8', 'uint8', 'uint8', 'uint8']
    };
    this.constr_name = 'GapPairingReq';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.GapCmdStatus = function () {
    var evtAttrs = {
        paramLens: 'variable',
        params: ['status', 'opCode'],
        types: ['uint8', 'uint16le'],
        append: {
            params: ['dataLen', 'payload'],
            types: ['uint8', 'buffer'],
        }
    };
    this.constr_name = 'GapCmdStatus';
    this.storeEvtAttrs(evtAttrs);
};
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

ru.clause('bufWithLen', function (lenName, bufName, lenType) {
    this[lenType](lenName).tap(function () {
        this.buffer(bufName, this.vars[lenName]);
    });
});

ru.clause('attObj', function (buflen, objName, objAttrs) {
    var objLen = objAttrs.objLen,
        objParams = objAttrs.params,
        objTypes = objAttrs.types,
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

ru.clause('attObjPreLen', function (bufLen, objName, lenName, lenType, objAttrs) {
    var objLen,
        objParams = objAttrs.params,
        objTypes = objAttrs.types,
        objBufPreLen = objAttrs.objBufPreLen,
        loopTimes,
        self = this;

    this[lenType](lenName).tap(function () {
        objLen = this.vars[lenName];
        loopTimes = bufLen / objLen;
        this.tap(objName, function (end) {
            for (var i = 0; i < loopTimes; i += 1) {
                _.forEach(objParams, function (param, key) {
                    if (objTypes[key] === 'buffer') {
                        self.buffer((param + i), (objLen - objBufPreLen));
                    } else {
                        self[objTypes[key]](param + i);
                    } 
                });
            }
        }).tap(function () {
            for (var k in this.vars) {
                delete this.vars[k].__proto__;
            }
        });
    });
});

ru.clause('GapDeviceDiscovery', function () {
    var count = 0;

    this.uint8('numDevs').loop(function (end) {
        var inCount = 0;
        var name = 'dev' + count;
        this.loop(name, function (end) {
            if (inCount === 2) {
                ru.addr('addr')(this);
            } else {
                this.uint8();
            }
            inCount++;
            if (inCount === 3) { 
                inCount = 0;
                end(); 
            }
        }).tap(function () {
            this.vars[name] = [this.vars[name][0].undefined, this.vars[name][1].undefined, this.vars[name][2].addr];
        });
        count++;
        if (count === this.vars.numDevs) {
            count = 0;
            end(); 
        }
    });
});

ru.clause('AttFindInfoRsp', function (bufLen, format, objName) {
    var loopTimes,
        uuidType;

    this.uint8(format).tap(function () {
        if (this.vars[format] === 1) {
            loopTimes = bufLen / 4;
            uuidType = 'uint16le';
        } else if (this.vars[format] === 2) {
            loopTimes = bufLen / 18;
            uuidType = 'buffer';
        }
        this.tap(objName, function (end) {
            for (var i = 0; i < loopTimes; i += 1) {
                this.uint16le('handle' + i)[uuidType](('uuid' + i), 16);
            }
        }).tap(function () {
            for (var k in this.vars) {
                delete this.vars[k].__proto__;
            }
        });
    });
});
/*************************************************************************************************/
/*** Private Functions                                                                         ***/
/*************************************************************************************************/
function processAppendEvtAttrs (argObj, bufLen) {
    var extChunkRule = [],
        constrName = argObj.constr_name,
        evtAttrs = argObj.getEvtAttrs(),
        appendAttrs = evtAttrs.append,
        appendParams = appendAttrs.params,
        appendTypes = appendAttrs.types,
        bufferLen,
        objAttrs = appendAttrs.objAttrs;

    if (_.startsWith(constrName, 'Att')) {
        bufferLen = bufLen - appendAttrs.precedingLen;
        if (bufferLen < appendAttrs.minLen) {
            throw new Error('The length of the ' + appendParams[0] + ' field of ' + constrName + ' is incorrect.');
        }
    }

    switch (constrName) {
        case 'HciPer':
            if (bufLen === appendAttrs.paramLens) {
                for (var i = 0; i < appendAttrs.len; i += 1) {
                    extChunkRule.push(ru[appendTypes[i]](appendParams[i]));
                }
            }
            break;

        case 'GapDeviceDiscovery':
            extChunkRule.push(ru.GapDeviceDiscovery());
            break;

        case 'GapDeviceInfo':
        case 'GapCmdStatus':
            extChunkRule.push(ru.bufWithLen(appendParams[0], appendParams[1], appendTypes[0]));
            break;

        case 'AttFindByTypeValueReq':
        case 'AttReadByTypeReq':
        case 'AttReadRsp':
        case 'AttReadBlobRsp':
        case 'AttReadMultiRsp':
        case 'AttReadByGrpTypeReq':
        case 'AttWriteReq':
        case 'AttPrepareWriteReq':
        case 'AttPrepareWriteRsp':
        case 'AttHandleValueNoti':
        case 'AttHandleValueInd':
            if ((constrName === 'AttReadByTypeReq' || constrName === 'AttReadByGrpTypeReq') && (bufferLen !== 2 || bufferLen !== 16)) {
                throw new Error('The length of the ' + appendParams[0] + ' field of ' + constrName + ' must be 2 or 16 bytes.');
            }
            extChunkRule.push(ru.buffer(appendParams[0], bufferLen));
            break;

        case 'AttFindInfoRsp':
            extChunkRule.push(ru.AttFindInfoRsp(bufferLen, appendParams[0], appendParams[1]));
            break;

        case 'AttFindByTypeValueRsp':
        case 'AttReadMultiReq':
            extChunkRule.push(ru.attObj(bufferLen, appendParams[0], objAttrs));
            break;

        case 'AttReadByTypeRsp':
        case 'AttReadByGrpTypeRsp':
            extChunkRule.push(ru.attObjPreLen(bufferLen, appendParams[1], appendParams[0], appendTypes[0], objAttrs));
            break;

        default:
            throw new Error(argObj.constr_name + 'event packet error!');
    }
    return extChunkRule;
};

module.exports = hciEventDissolver;