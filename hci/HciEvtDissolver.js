'use strict'

var Q = require('q'),
    _ = require('lodash'),
    DChunks = require('dissolve-chunks'),
    ru = DChunks().Rule(),
    BHCI = require('../defs/blehcidefs'),
    evtMeta = require('./HciEvtMeta');

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
 * @param type {String} constrName constructor name
 * @return {Object} value object of the corresponding event constructor
 * @private
 */
ArgObj.factory = function (constrName) {

    ArgObj[constrName] = function () {
        var evtAttrs = evtMeta[constrName];
        this.constr_name = constrName;
        this.storeEvtAttrs(evtAttrs);
    };

    if (!evtMeta[constrName]) { throw new Error(ArgObj[constrName] + " doesn't exist"); }

    if (!_.isFunction(ArgObj[constrName].prototype.getEvtAttrs)) {
        ArgObj[constrName].prototype = new ArgObj();
    }

    return new ArgObj[constrName]();
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
            if ((constrName === 'AttReadByTypeReq' || constrName === 'AttReadByGrpTypeReq') && (bufferLen !== 2 && bufferLen !== 16)) {
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
