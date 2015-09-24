'use strict'

var Dissolve = require('dissolve'),
    BHCI = require('../defs/bhcidefs');

var evtBpi = {
	/*************************************************************************************************/
    /*** Argument Constructor of HCI Layer HCI APIs (and ZPIs)                                     ***/
    /*************************************************************************************************/
    HciSetReceiverGain: function () { return ArgObj.factory('HciSetReceiverGain', arguments); },
    HciSetRxGain: function () { return ArgObj.factory('HciSetRxGain', arguments); },
    HciSetTxPower: function () { return ArgObj.factory('HciSetTxPower', arguments); },
    HciOnePktPerEvt: function () { return ArgObj.factory('HciOnePktPerEvt', arguments); },
    HciClkDivideOnHalt: function () { return ArgObj.factory('HciClkDivideOnHalt', arguments); },
    HciDeclareNvUsage: function () { return ArgObj.factory('HciDeclareNvUsage', arguments); },
    HciDecrypt: function () { return ArgObj.factory('HciDecrypt', arguments); },
    HciSetLocalSupportedFeatures: function () { return ArgObj.factory('HciSetLocalSupportedFeatures', arguments); },
    HciSetFastTxRespTime: function () { return ArgObj.factory('HciSetFastTxRespTime', arguments); },
    HciModemTestTx: function () { return ArgObj.factory('HciModemTestTx', arguments); },
    HciModemHopTestTx: function () { return ArgObj.factory('HciModemHopTestTx', arguments); },
    HciModemTestRx: function () { return ArgObj.factory('HciModemTestRx', arguments); },
    HciEndModemTest: function () { return ArgObj.factory('HciEndModemTest', arguments); },
    HciSetBdaddr: function () { return ArgObj.factory('HciSetBdaddr', arguments); },
    HciSetSca: function () { return ArgObj.factory('HciSetSca', arguments); },
    HciEnablePtm: function () { return ArgObj.factory('HciEnablePtm', arguments); },
    HciSetFreqTune: function () { return ArgObj.factory('HciSetFreqTune', arguments); },
    HciSaveFreqTune: function () { return ArgObj.factory('HciSaveFreqTune', arguments); },
    HciSetMaxDtmTxPower: function () { return ArgObj.factory('HciSetMaxDtmTxPower', arguments); },
    HciMapPmIoPort: function () { return ArgObj.factory('HciMapPmIoPort', arguments); },
    HciDisconnectImmed: function () { return ArgObj.factory('HciDisconnectImmed', arguments); },
    HciPer: function () { return ArgObj.factory('HciPer', arguments); },
    HciPerByChan: function () { return ArgObj.factory('HciPerByChan', arguments); },
    HciExtendRfRange: function () { return ArgObj.factory('HciExtendRfRange', arguments); },
    HciAdvEventNotice: function () { return ArgObj.factory('HciAdvEventNotice', arguments); },
    HciConnEventNotice: function () { return ArgObj.factory('HciConnEventNotice', arguments); },
    HciHaltDuringRf: function () { return ArgObj.factory('HciHaltDuringRf', arguments); },
    HciOverrideSl: function () { return ArgObj.factory('HciOverrideSl', arguments); },
    HciBuildRevision: function () { return ArgObj.factory('HciBuildRevision', arguments); },
    HciDelaySleep: function () { return ArgObj.factory('HciDelaySleep', arguments); },
    HciResetSystem: function () { return ArgObj.factory('HciResetSystem', arguments); },
    HciOverlappedProcessing: function () { return ArgObj.factory('HciOverlappedProcessing', arguments); },
    HciNumCompletedPktsLimit: function () { return ArgObj.factory('HciNumCompletedPktsLimit', arguments); },
    /*************************************************************************************************/
    /*** Argument Constructor of L2CAP Layer HCI APIs (and ZPIs)                                   ***/
    /*************************************************************************************************/
    L2capCmdReject: function () { return ArgObj.factory('L2capCmdReject', arguments); },
    L2capParamUpdateRsp: function () { return ArgObj.factory('L2capParamUpdateRsp', arguments); },
    /*************************************************************************************************/
    /*** Argument Constructor of ATT Layer HCI APIs (and ZPIs)                                     ***/
    /*************************************************************************************************/
    AttErrorRsp: function () { return ArgObj.factory('AttErrorRsp', arguments); },
    AttExchangeMtuReq: function () { return ArgObj.factory('AttExchangeMtuReq', arguments); },
    AttExchangeMtuRsp: function () { return ArgObj.factory('AttExchangeMtuRsp', arguments); },
    AttFindInfoReq: function () { return ArgObj.factory('AttFindInfoReq', arguments); },
    AttFindInfoRsp: function () { return ArgObj.factory('AttFindInfoRsp', arguments); },
    AttFindByTypeValueReq: function () { return ArgObj.factory('AttFindByTypeValueReq', arguments); },
    AttFindByTypeValueRsp: function () { return ArgObj.factory('AttFindByTypeValueRsp', arguments); },
    AttReadByTypeReq: function () { return ArgObj.factory('AttReadByTypeReq', arguments); },
    AttReadByTypeRsp: function () { return ArgObj.factory('AttReadByTypeRsp', arguments); },
    AttReadReq: function () { return ArgObj.factory('AttReadReq', arguments); },
    AttReadRsp: function () { return ArgObj.factory('AttReadRsp', arguments); },
    AttReadBlobReq: function () { return ArgObj.factory('AttReadBlobReq', arguments); },
    AttReadBlobRsp: function () { return ArgObj.factory('AttReadBlobRsp', arguments); },
    AttReadMultiReq: function () { return ArgObj.factory('AttReadMultiReq', arguments); },
    AttReadMultiRsp: function () { return ArgObj.factory('AttReadMultiRsp', arguments); },
    AttReadByGrpTypeReq: function () { return ArgObj.factory('AttReadByGrpTypeReq', arguments); },
    AttReadByGrpTypeRsp: function () { return ArgObj.factory('AttReadByGrpTypeRsp', arguments); },
    AttWriteReq: function () { return ArgObj.factory('AttWriteReq', arguments); },
    AttWriteRsp: function () { return ArgObj.factory('AttWriteRsp', arguments); },
    AttPrepareWriteReq: function () { return ArgObj.factory('AttPrepareWriteReq', arguments); },
    AttPrepareWriteRsp: function () { return ArgObj.factory('AttPrepareWriteRsp', arguments); },
    AttExecuteWriteReq: function () { return ArgObj.factory('AttExecuteWriteReq', arguments); },
    AttExecuteWriteRsp: function () { return ArgObj.factory('AttExecuteWriteRsp', arguments); },
    AttHandleValueNoti: function () { return ArgObj.factory('AttHandleValueNoti', arguments); },
    AttHandleValueInd: function () { return ArgObj.factory('AttHandleValueInd', arguments); },
    AttHandleValueCfm: function () { return ArgObj.factory('AttHandleValueCfm', arguments); },
    /*************************************************************************************************/
    /*** Argument Constructor of GATT Layer HCI APIs (and ZPIs)                                    ***/
    /*************************************************************************************************/
    GattClientCharCfgUpdate: function () { return ArgObj.factory('GattClientCharCfgUpdate', arguments); },
    /*************************************************************************************************/
    /*** Argument Constructor of GAP Layer HCI APIs (and ZPIs)                                     ***/
    /*************************************************************************************************/
    GapDeviceInitDone: function () { return ArgObj.factory('GapDeviceInitDone', arguments); },,
    GapDeviceDiscovery: function () { return ArgObj.factory('GapDeviceDiscovery', arguments); },,
    GapAdvDataUpdateDone: function () { return ArgObj.factory('GapAdvDataUpdateDone', arguments); },,
    GapMakeDiscoverableDone: function () { return ArgObj.factory('GapMakeDiscoverableDone', arguments); },,
    GapEndDiscoverableDone: function () { return ArgObj.factory('GapEndDiscoverableDone', arguments); },,
    GapLinkEstablished: function () { return ArgObj.factory('GapLinkEstablished', arguments); },,
    GapLinkTerminated: function () { return ArgObj.factory('GapLinkTerminated', arguments); },,
    GapLinkParamUpdate: function () { return ArgObj.factory('GapLinkParamUpdate', arguments); },,
    GapRandomAddrChanged: function () { return ArgObj.factory('GapRandomAddrChanged', arguments); },,
    GapSignatureUpdated: function () { return ArgObj.factory('GapSignatureUpdated', arguments); },,
    GapAuthenticationComplete: function () { return ArgObj.factory('GapAuthenticationComplete', arguments); },,
    GapPasskeyNeeded: function () { return ArgObj.factory('GapPasskeyNeeded', arguments); },,
    GapSlaveRequestedSecurity: function () { return ArgObj.factory('GapSlaveRequestedSecurity', arguments); },,
    GapDeviceInfo: function () { return ArgObj.factory('GapDeviceInfo', arguments); },,
    GapBondComplete: function () { return ArgObj.factory('GapBondComplete', arguments); },,
    GapPairingReq: function () { return ArgObj.factory('GapPairingReq', arguments); },,
    GapCmdStatus: function () { return ArgObj.factory('GapCmdStatus', arguments); },
};

/***************************************************************************************************/
/*** Private Member in This Module                                                               ***/
/***************************************************************************************************/

/***************************************************************************************************/
/*** ArgObj Class                                                                                ***/
/***************************************************************************************************/
// Parent constructor of all argobjs which have command and event type. It has a static factory method() to create argobjs
// It also has methods: getEvtBpiMeta(), makeArgObj(), storeMeta(), getHciCmdPacket(),
// We use the meta-programming to create instances when needed. The meta-data is the argument information of each API.
/**
 * @class ArgObj
 * @constructor
 * @private
 */
function ArgObj() {}

/**
 * @method getEvtBpiMeta
 * @return {Object} the attribute of the hci event arguments
 * @private
 */
ArgObj.prototype.getEvtBpiMeta = function () {
    return this.constructor[this.constr_name].evtBpiMeta;
};

/**
 * @method makeArgObj
 * @param inArg {Array} the evtBpi input arguments
 * @return {Object} value object made from the input arguments
 * @private
 */
ArgObj.prototype.makeArgObj = function (inArg) {
    var i,
        arg_len = this.getEvtBpiMeta().len,
        arg_param = this.getEvtBpiMeta().params;

    for (i = 0; i < arg_len; i += 1) {
        this[arg_param[i]] = inArg[i];
    }

    return this;
};

/**
 * @method storeMeta
 * @param evtBpiMeta {Object} the evtBpi meta data
 * @return {Object} value object made by the input arguments
 * @private
 */
ArgObj.prototype.storeMeta = function (evtBpiMeta) {
    // store evtBpiMeta to the specialized constructor only once
    if (ArgObj[this.constr_name].evtBpiMeta === undefined) {
        ArgObj[this.constr_name].evtBpiMeta = evtBpiMeta;
    }
    return this;
};

/**
 * @method getHciEvtPacket
 * @param bBuffer {Buffer} buffer of HCI event parameters
 * @return {Object} the attribute of HCI event
 * @private
 */
ArgObj.prototype.getHciEvtPacket = function (bBuffer) {
    //TODO
}

/**
 * This is the factory of the argument value object for the evtBpis
 * @method factory
 * @static
 * @param type {String} evtBpi name
 * @param inArg {Array} input arguments of the evtBpi
 * @return {Object} value object of the corresponding evtBpi
 * @private
 */
ArgObj.factory = function (type, inArg) {
    var constr = type,
        new_argobj;

    if (typeof ArgObj[constr] !== "function") { throw new Error(constr + " doesn't exist"); }

    if (typeof ArgObj[constr].prototype.getEvtBpiMeta !== "function") {
        ArgObj[constr].prototype = new ArgObj();
    }

    new_argobj = (new ArgObj[constr]()).makeArgObj(inArg);

    return new_argobj;
};

// Specialize the sub-classes
/*************************************************************************************************/
/*** Specialized ArgObj Constructor of HCI HCI APIs                                             ***/
/*************************************************************************************************/
ArgObj.HciSetReceiverGain = function () {
    var evtBpiMeta = {
        len: 2,
        paramLens: 5,
        params: ['status', 'cmdopcode'],
        types: ['uint8', 'uint16'],
        range: [],
        hisZDEFS: []
    };
    this.constr_name = 'HciSetReceiverGain';
    this.storeMeta(evtBpiMeta);
};
ArgObj.HciSetRxGain = function () {
    var evtBpiMeta = {
        len: ,
        paramLens: ,
        params: [],
        types: [],
        range: [],
        hisZDEFS: []
    };
    this.constr_name = 'HciSetRxGain';
    this.storeMeta(evtBpiMeta);
};
ArgObj.HciSetTxPower = function () {
    var evtBpiMeta = {
        len: ,
        paramLens: ,
        params: [],
        types: [],
        range: [],
        hisZDEFS: []
    };
    this.constr_name = 'HciSetTxPower';
    this.storeMeta(evtBpiMeta);
};
ArgObj.HciOnePktPerEvt = function () {
    var evtBpiMeta = {
        len: ,
        paramLens: ,
        params: [],
        types: [],
        range: [],
        hisZDEFS: []
    };
    this.constr_name = 'HciOnePktPerEvt';
    this.storeMeta(evtBpiMeta);
};
ArgObj.HciClkDivideOnHalt = function () {
    var evtBpiMeta = {
        len: ,
        paramLens: ,
        params: [],
        types: [],
        range: [],
        hisZDEFS: []
    };
    this.constr_name = 'HciClkDivideOnHalt';
    this.storeMeta(evtBpiMeta);
};
ArgObj.HciDeclareNvUsage = function () {
    var evtBpiMeta = {
        len: ,
        paramLens: ,
        params: [],
        types: [],
        range: [],
        hisZDEFS: []
    };
    this.constr_name = 'HciDeclareNvUsage';
    this.storeMeta(evtBpiMeta);
};
ArgObj.HciDecrypt = function () {
    var evtBpiMeta = {
        len: ,
        paramLens: ,
        params: [],
        types: [],
        range: [],
        hisZDEFS: []
    };
    this.constr_name = 'HciDecrypt';
    this.storeMeta(evtBpiMeta);
};
ArgObj.HciSetLocalSupportedFeatures = function () {
    var evtBpiMeta = {
        len: ,
        paramLens: ,
        params: [],
        types: [],
        range: [],
        hisZDEFS: []
    };
    this.constr_name = 'HciSetLocalSupportedFeatures';
    this.storeMeta(evtBpiMeta);
};
ArgObj.HciSetFastTxRespTime = function () {
    var evtBpiMeta = {
        len: ,
        paramLens: ,
        params: [],
        types: [],
        range: [],
        hisZDEFS: []
    };
    this.constr_name = 'HciSetFastTxRespTime';
    this.storeMeta(evtBpiMeta);
};
ArgObj.HciModemTestTx = function () {
    var evtBpiMeta = {
        len: ,
        paramLens: ,
        params: [],
        types: [],
        range: [],
        hisZDEFS: []
    };
    this.constr_name = 'HciModemTestTx';
    this.storeMeta(evtBpiMeta);
};
ArgObj.HciModemHopTestTx = function () {
    var evtBpiMeta = {
        len: ,
        paramLens: ,
        params: [],
        types: [],
        range: [],
        hisZDEFS: []
    };
    this.constr_name = 'HciModemHopTestTx';
    this.storeMeta(evtBpiMeta);
};
ArgObj.HciModemTestRx = function () {
    var evtBpiMeta = {
        len: ,
        paramLens: ,
        params: [],
        types: [],
        range: [],
        hisZDEFS: []
    };
    this.constr_name = 'HciModemTestRx';
    this.storeMeta(evtBpiMeta);
};
ArgObj.HciEndModemTest = function () {
    var evtBpiMeta = {
        len: ,
        paramLens: ,
        params: [],
        types: [],
        range: [],
        hisZDEFS: []
    };
    this.constr_name = 'HciEndModemTest';
    this.storeMeta(evtBpiMeta);
};
ArgObj.HciSetBdaddr = function () {
    var evtBpiMeta = {
        len: ,
        paramLens: ,
        params: [],
        types: [],
        range: [],
        hisZDEFS: []
    };
    this.constr_name = 'HciSetBdaddr';
    this.storeMeta(evtBpiMeta);
};
ArgObj.HciSetSca = function () {
    var evtBpiMeta = {
        len: ,
        paramLens: ,
        params: [],
        types: [],
        range: [],
        hisZDEFS: []
    };
    this.constr_name = 'HciSetSca';
    this.storeMeta(evtBpiMeta);
};
ArgObj.HciEnablePtm = function () {
    var evtBpiMeta = {
        len: ,
        paramLens: ,
        params: [],
        types: [],
        range: [],
        hisZDEFS: []
    };
    this.constr_name = 'HciEnablePtm';
    this.storeMeta(evtBpiMeta);
};
ArgObj.HciSetFreqTune = function () {
    var evtBpiMeta = {
        len: ,
        paramLens: ,
        params: [],
        types: [],
        range: [],
        hisZDEFS: []
    };
    this.constr_name = 'HciSetFreqTune';
    this.storeMeta(evtBpiMeta);
};
ArgObj.HciSaveFreqTune = function () {
    var evtBpiMeta = {
        len: ,
        paramLens: ,
        params: [],
        types: [],
        range: [],
        hisZDEFS: []
    };
    this.constr_name = 'HciSaveFreqTune';
    this.storeMeta(evtBpiMeta);
};
ArgObj.HciSetMaxDtmTxPower = function () {
    var evtBpiMeta = {
        len: ,
        paramLens: ,
        params: [],
        types: [],
        range: [],
        hisZDEFS: []
    };
    this.constr_name = 'HciSetMaxDtmTxPower';
    this.storeMeta(evtBpiMeta);
};
ArgObj.HciMapPmIoPort = function () {
    var evtBpiMeta = {
        len: ,
        paramLens: ,
        params: [],
        types: [],
        range: [],
        hisZDEFS: []
    };
    this.constr_name = 'HciMapPmIoPort';
    this.storeMeta(evtBpiMeta);
};
ArgObj.HciDisconnectImmed = function () {
    var evtBpiMeta = {
        len: ,
        paramLens: ,
        params: [],
        types: [],
        range: [],
        hisZDEFS: []
    };
    this.constr_name = 'HciDisconnectImmed';
    this.storeMeta(evtBpiMeta);
};
ArgObj.HciPer = function () {
    var evtBpiMeta = {
        len: ,
        paramLens: ,
        params: [],
        types: [],
        range: [],
        hisZDEFS: []
    };
    this.constr_name = 'HciPer';
    this.storeMeta(evtBpiMeta);
};
ArgObj.HciPerByChan = function () {
    var evtBpiMeta = {
        len: ,
        paramLens: ,
        params: [],
        types: [],
        range: [],
        hisZDEFS: []
    };
    this.constr_name = 'HciPerByChan';
    this.storeMeta(evtBpiMeta);
};
ArgObj.HciExtendRfRange = function () {
    var evtBpiMeta = {
        len: ,
        paramLens: ,
        params: [],
        types: [],
        range: [],
        hisZDEFS: []
    };
    this.constr_name = 'HciExtendRfRange';
    this.storeMeta(evtBpiMeta);
};
ArgObj.HciAdvEventNotice = function () {
    var evtBpiMeta = {
        len: ,
        paramLens: ,
        params: [],
        types: [],
        range: [],
        hisZDEFS: []
    };
    this.constr_name = 'HciAdvEventNotice';
    this.storeMeta(evtBpiMeta);
};
ArgObj.HciConnEventNotice = function () {
    var evtBpiMeta = {
        len: ,
        paramLens: ,
        params: [],
        types: [],
        range: [],
        hisZDEFS: []
    };
    this.constr_name = 'HciConnEventNotice';
    this.storeMeta(evtBpiMeta);
};
ArgObj.HciHaltDuringRf = function () {
    var evtBpiMeta = {
        len: ,
        paramLens: ,
        params: [],
        types: [],
        range: [],
        hisZDEFS: []
    };
    this.constr_name = 'HciHaltDuringRf';
    this.storeMeta(evtBpiMeta);
};
ArgObj.HciOverrideSl = function () {
    var evtBpiMeta = {
        len: ,
        paramLens: ,
        params: [],
        types: [],
        range: [],
        hisZDEFS: []
    };
    this.constr_name = 'HciOverrideSl';
    this.storeMeta(evtBpiMeta);
};
ArgObj.HciBuildRevision = function () {
    var evtBpiMeta = {
        len: ,
        paramLens: ,
        params: [],
        types: [],
        range: [],
        hisZDEFS: []
    };
    this.constr_name = 'HciBuildRevision';
    this.storeMeta(evtBpiMeta);
};
ArgObj.HciDelaySleep = function () {
    var evtBpiMeta = {
        len: ,
        paramLens: ,
        params: [],
        types: [],
        range: [],
        hisZDEFS: []
    };
    this.constr_name = 'HciDelaySleep';
    this.storeMeta(evtBpiMeta);
};
ArgObj.HciResetSystem = function () {
    var evtBpiMeta = {
        len: ,
        paramLens: ,
        params: [],
        types: [],
        range: [],
        hisZDEFS: []
    };
    this.constr_name = 'HciResetSystem';
    this.storeMeta(evtBpiMeta);
};
ArgObj.HciOverlappedProcessing = function () {
    var evtBpiMeta = {
        len: ,
        paramLens: ,
        params: [],
        types: [],
        range: [],
        hisZDEFS: []
    };
    this.constr_name = 'HciOverlappedProcessing';
    this.storeMeta(evtBpiMeta);
};
ArgObj.HciNumCompletedPktsLimit = function () {
    var evtBpiMeta = {
        len: ,
        paramLens: ,
        params: [],
        types: [],
        range: [],
        hisZDEFS: []
    };
    this.constr_name = 'HciNumCompletedPktsLimit';
    this.storeMeta(evtBpiMeta);
};
/*************************************************************************************************/
/*** Specialized ArgObj Constructor of L2CAP HCI APIs                                             ***/
/*************************************************************************************************/

/*************************************************************************************************/
/*** Specialized ArgObj Constructor of ATT HCI APIs                                             ***/
/*************************************************************************************************/

/*************************************************************************************************/
/*** Specialized ArgObj Constructor of GATT HCI APIs                                             ***/
/*************************************************************************************************/

/*************************************************************************************************/
/*** Specialized ArgObj Constructor of GAP HCI APIs                                             ***/
/*************************************************************************************************/

/*************************************************************************************************/
/*** Specialized ArgObj Constructor of UTIL HCI APIs                                             ***/
/*************************************************************************************************/

module.exports = evtBpi;