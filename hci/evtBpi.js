'use strict'

var Q = require('q'),
    _ = require('lodash'),
    DChunks = require('dissolve-chunks'),
    ru = DChunks().Rule(),
    BHCI = require('../defs/bhcidefs');
var extCRules = {};

var evtBpi = {
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
    HciEnablePtm: function () { return ArgObj.factory('HciEnablePtm'); },
    HciSetFreqTune: function () { return ArgObj.factory('HciSetFreqTune'); },
    HciSaveFreqTune: function () { return ArgObj.factory('HciSaveFreqTune'); },
    HciSetMaxDtmTxPower: function () { return ArgObj.factory('HciSetMaxDtmTxPower'); },
    HciMapPmIoPort: function () { return ArgObj.factory('HciMapPmIoPort'); },
    HciDisconnectImmed: function () { return ArgObj.factory('HciDisconnectImmed'); },
    HciPer: function () { return ArgObj.factory('HciPer'); },
    HciPerByChan: function () { return ArgObj.factory('HciPerByChan'); },
    HciExtendRfRange: function () { return ArgObj.factory('HciExtendRfRange'); },
    HciAdvEventNotice: function () { return ArgObj.factory('HciAdvEventNotice'); },
    HciConnEventNotice: function () { return ArgObj.factory('HciConnEventNotice'); },
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
 * @param evtAttrs {Object} the evtBpi evtAttrs
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
        attrLen = evtAttrs.len,
        attrParams = evtAttrs.params,
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
        extChunkRule = processExtevtAttrs(self, bufLen);
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
 * This is the factory of the argument value object for the evtBpis
 * @method factory
 * @static
 * @param type {String} evtBpi name
 * @return {Object} value object of the corresponding evtBpi
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
ArgObj.HciSetRxGain = function () {
    var evtAttrs = BHCI.HciAttrs;
    this.constr_name = 'HciSetRxGain';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.HciSetTxPower = function () {
    var evtAttrs = BHCI.HciAttrs;
    this.constr_name = 'HciSetTxPower';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.HciOnePktPerEvt = function () {
    var evtAttrs = BHCI.HciAttrs;
    this.constr_name = 'HciOnePktPerEvt';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.HciClkDivideOnHalt = function () {
    var evtAttrs = BHCI.HciAttrs;
    this.constr_name = 'HciClkDivideOnHalt';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.HciDeclareNvUsage = function () {
    var evtAttrs = BHCI.HciAttrs;
    this.constr_name = 'HciDeclareNvUsage';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.HciDecrypt = function () {
    var evtAttrs = {
        len: 3,
        paramLens: 19,
        params: ['status', 'cmdOpcode', 'plainTextData'],
        types: ['uint8', 'uint16le', 'buffer16'],
    };
    this.constr_name = 'HciDecrypt';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.HciSetLocalSupportedFeatures = function () {
    var evtAttrs = BHCI.HciAttrs;
    this.constr_name = 'HciSetLocalSupportedFeatures';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.HciSetFastTxRespTime = function () {
    var evtAttrs = BHCI.HciAttrs;
    this.constr_name = 'HciSetFastTxRespTime';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.HciModemTestTx = function () {
    var evtAttrs = BHCI.HciAttrs;
    this.constr_name = 'HciModemTestTx';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.HciModemHopTestTx = function () {
    var evtAttrs = BHCI.HciAttrs;
    this.constr_name = 'HciModemHopTestTx';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.HciModemTestRx = function () {
    var evtAttrs = BHCI.HciAttrs;
    this.constr_name = 'HciModemTestRx';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.HciEndModemTest = function () {
    var evtAttrs = BHCI.HciAttrs;
    this.constr_name = 'HciEndModemTest';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.HciSetBdaddr = function () {
    var evtAttrs = BHCI.HciAttrs;
    this.constr_name = 'HciSetBdaddr';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.HciSetSca = function () {
    var evtAttrs = BHCI.HciAttrs;
    this.constr_name = 'HciSetSca';
    this.storeEvtAttrs(evtAttrs);
};
/*ArgObj.HciEnablePtm = function () {
    var evtAttrs = {
        len: ,
        paramLens: ,
        params: [],
        types: [],
        range: [],
        hisZDEFS: []
    };
    this.constr_name = 'HciEnablePtm';
    this.storeEvtAttrs(evtAttrs);
};*/
ArgObj.HciSetFreqTune = function () {
    var evtAttrs = BHCI.HciAttrs;
    this.constr_name = 'HciSetFreqTune';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.HciSaveFreqTune = function () {
    var evtAttrs = BHCI.HciAttrs;
    this.constr_name = 'HciSaveFreqTune';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.HciSetMaxDtmTxPower = function () {
    var evtAttrs = BHCI.HciAttrs;
    this.constr_name = 'HciSetMaxDtmTxPower';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.HciMapPmIoPort = function () {
    var evtAttrs = BHCI.HciAttrs;
    this.constr_name = 'HciMapPmIoPort';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.HciDisconnectImmed = function () {
    var evtAttrs = BHCI.HciAttrs;
    this.constr_name = 'HciDisconnectImmed';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.HciPer = function () {
    var evtAttrs = {
        len: 3,
        paramLens: 'variable',
        params: ['status', 'cmdOpcode', 'cmdVal'],
        types: ['uint8', 'uint16le', 'uint8'],
        ext: {
            len: 4,
            paramLens: 14,
            params: ['numPkts', 'numCrcErr', 'numEvents', 'numMissedEvents'],
            types: ['uint16le', 'uint16le', 'uint16le', 'uint16le'],
        }
    };
    this.constr_name = 'HciPer';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.HciPerByChan = function () {
    var evtAttrs = BHCI.HciAttrs;
    this.constr_name = 'HciPerByChan';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.HciExtendRfRange = function () {
    var evtAttrs = BHCI.HciAttrs;
    this.constr_name = 'HciExtendRfRange';
    this.storeEvtAttrs(evtAttrs);
};
/*ArgObj.HciAdvEventNotice = function () {
    var evtAttrs = {
        len: ,
        paramLens: ,
        params: [],
        types: [],
        range: [],
        hisZDEFS: []
    };
    this.constr_name = 'HciAdvEventNotice';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.HciConnEventNotice = function () {
    var evtAttrs = {
        len: ,
        paramLens: ,
        params: [],
        types: [],
        range: [],
        hisZDEFS: []
    };
    this.constr_name = 'HciConnEventNotice';
    this.storeEvtAttrs(evtAttrs);
};*/
ArgObj.HciHaltDuringRf = function () {
    var evtAttrs = BHCI.HciAttrs;
    this.constr_name = 'HciHaltDuringRf';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.HciOverrideSl = function () {
    var evtAttrs = BHCI.HciAttrs;
    this.constr_name = 'HciOverrideSl';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.HciBuildRevision = function () {
    var evtAttrs = {
        len: 4,
        paramLens: 7,
        params: ['status', 'cmdOpcode', 'userRevNum', 'buildRevNum'],
        types: ['uint8', 'uint16le', 'uint16le', 'uint16le'],
    };
    this.constr_name = 'HciBuildRevision';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.HciDelaySleep = function () {
    var evtAttrs = BHCI.HciAttrs;
    this.constr_name = 'HciDelaySleep';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.HciResetSystem = function () {
    var evtAttrs = BHCI.HciAttrs;
    this.constr_name = 'HciResetSystem';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.HciOverlappedProcessing = function () {
    var evtAttrs = BHCI.HciAttrs;
    this.constr_name = 'HciOverlappedProcessing';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.HciNumCompletedPktsLimit = function () {
    var evtAttrs = BHCI.HciAttrs;
    this.constr_name = 'HciNumCompletedPktsLimit';
    this.storeEvtAttrs(evtAttrs);
};
/*************************************************************************************************/
/*** Specialized ArgObj Constructor of L2CAP HCI APIs                                          ***/
/*************************************************************************************************/

/*************************************************************************************************/
/*** Specialized ArgObj Constructor of ATT HCI APIs                                            ***/
/*************************************************************************************************/
ArgObj.AttFindInfoRsp = function () {
    var evtAttrs = {
        len: 4,
        paramLens: 'variable',
        params: ['status', 'connHandle', 'pduLen', 'format'],
        types: ['uint8', 'uint16le', 'uint8', 'uint8'],
        ext: {
            withoutBufLen: 7,
            minLen: 4,
            params: ['info']
        }
    };
    this.constr_name = 'AttFindInfoRsp';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.AttFindByTypeValueReq = function () {
    var evtAttrs = {
        len: 6,
        paramLens: 'variable',
        params: ['status', 'connHandle', 'pduLen', 'startHandle', 'endHandle', 'type'],
        types: ['uint8', 'uint16le', 'uint8', 'uint16le', 'uint16le', 'uint16le'],
        ext: {
            withoutBufLen: 12,
            minLen: 0,
            params: ['value']
        }
    };
    this.constr_name = 'AttFindByTypeValueReq';
    this.storeEvtAttrs(evtAttrs);
};
/*************************************************************************************************/
/*** Specialized ArgObj Constructor of GATT HCI APIs                                           ***/
/*************************************************************************************************/

/*************************************************************************************************/
/*** Specialized ArgObj Constructor of GAP HCI APIs                                            ***/
/*************************************************************************************************/

/*************************************************************************************************/
/*** Specialized ArgObj Constructor of UTIL HCI APIs                                           ***/
/*************************************************************************************************/
ArgObj.GapDeviceDiscovery = function () {
    var evtAttrs = {
        len: 1,
        paramLens: 'variable',
        params: ['status'],
        types: ['uint8'],
        ext: {
            len: 4,
            params: ['numDevs', 'eventType', 'addrType', 'addr'],
            types: ['uint8', 'uint8', 'uint8', 'addr'],
        }
    };
    this.constr_name = 'GapDeviceDiscovery';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.GapAuthenticationComplete = function () { //TODO, Test
    var evtAttrs = {
        len: 19,
        paramLens: 104,
        params: ['status', 'connHandle', 'authState', 'secInfo', 'sec_ltkSize', 'sec_ltk', 'sec_div', 'sec_rand', 'devSecInfo', 'dev_ltkSize',
                 'dev_ltk', 'dev_div', 'dev_rand', 'identityInfo', 'identity_irk', 'identity_bd_addr', 'signingInfo', 'signing_irk', 'signing_signCounter'],
        types: ['uint8', 'uint16le', 'uint8', 'uint8', 'uint8', 'buffer16', 'uint16le', 'uint64', 'uint8', 'uint8', 'buffer16', 'uint16le', 'uint64',
                'uint8', 'buffer16', 'addr', 'uint8', 'buffer16', 'uint32le'],
    };
    this.constr_name = 'GapAuthenticationComplete';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.GapDeviceInfo = function () {
    var evtAttrs = {
        len: 5,
        paramLens: 'variable',
        params: ['status', 'eventType', 'addrType', 'addr', 'rssi'],
        types: ['uint8', 'uint8', 'uint8', 'addr', 'uint8'],
        ext: {
            len: 2,
            params: ['dataLen', 'dataField'],
            types: ['uint8', 'buffer'],
        }
    };
    this.constr_name = 'GapDeviceInfo';
    this.storeEvtAttrs(evtAttrs);
};
ArgObj.GapCmdStatus = function () {
    var evtAttrs = {
        len: 2,
        paramLens: 'variable',
        params: ['status', 'opCode'],
        types: ['uint8', 'uint16le'],
        ext: {
            len: 2,
            params: ['dataLen', 'payload'],
            types: ['uint8', 'buffer'],
        }
    };
    this.constr_name = 'GapCmdStatus';
    this.storeEvtAttrs(evtAttrs);
};
/*************************************************************************************************/
/*** Extend Chunk Rules                                                                        ***/
/*************************************************************************************************/
extCRules.addr = ru.clause('addr', function (name) {
    this.buffer(name, 6).tap(function () {
        var tmpBuf = new Buffer(6).fill(0),
            origBuf = this.vars[name];
        for (var i = 0; i < 6; i++) {
            tmpBuf.writeUInt8( origBuf.readUInt8(i), (5-i) );
        }
        this.vars[name] = tmpBuf;
    });
});

extCRules.bufWithLen = ru.clause('bufWithLen', function (lenName, bufName, lenType) {
    this[lenType](lenName).tap(function () {
        this.buffer(bufName, this.vars[lenName]);
    });
});

extCRules.GapDeviceDiscovery = ru.clause('GapDeviceDiscovery', function () {
    var count = 0;
    this.uint8('numDevs').loop(function (end) {
        var inCount = 0;
        var name = 'dev' + count;
        this.loop(name, function (end) {
            if (inCount === 2) {
                ru.addr('addr')(this);
                // this.uint16('addr').uint32('addr');
                // this.buffer('addr', 6).tap(function () {
                //     var tmpBuf = new Buffer(6).fill(0),
                //         origBuf = this.vars['addr'];
                //     for (var i = 0; i < 6; i++) {
                //         tmpBuf.writeUInt8( origBuf.readUInt8(i), (5-i) );
                //     }
                //     this.vars['addr'] = tmpBuf;
                // });
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
/*************************************************************************************************/
/*** Private Functions                                                                         ***/
/*************************************************************************************************/
function processExtevtAttrs (argObj, bufLen) {
    var extChunkRule = [],
        evtAttrs = argObj.getEvtAttrs(),
        extAttrs = evtAttrs.ext,
        extParams = extAttrs.params,
        extTypes = extAttrs.types,
        bufferLen;
    switch (argObj.constr_name) {
        case 'HciPer':
            if (bufLen === extAttrs.paramLens) {
                for (var i = 0; i < extAttrs.len; i += 1) {
                    extChunkRule.push(ru[extTypes[i]](extParams[i]));
                }
            }
            break;

        case 'GapDeviceDiscovery':
            extChunkRule.push(ru.GapDeviceDiscovery());
            break;

        case 'GapDeviceInfo':
        case 'GapCmdStatus':
            extChunkRule.push(ru.bufWithLen(extParams[0], extParams[1], extTypes[0]));
            break;

        case 'AttFindInfoRsp':
        case 'AttFindByTypeValueReq':
            bufferLen = bufLen - extAttrs.withoutBufLen;
            if (bufferLen < extAttrs.minLen) {
                throw new Error('The length of the ' + extParams[0] + ' field of ' + argObj.constr_name + ' is incorrect.');
            }
            extChunkRule.push(ru.buffer(extParams[0], bufferLen));
            break;

        default:
            throw new Error(argObj.constr_name + 'event packet error!');
    }
    return extChunkRule;
};
module.exports = evtBpi;