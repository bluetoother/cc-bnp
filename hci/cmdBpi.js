'use strict'

var Concentrate = require('concentrate'),
    BHCI = require('../defs/bhcidefs');

var cmdBpi = {
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
    L2capParamUPpdateReq: function () { return ArgObj.factory('L2capParamUPpdateReq', arguments); },
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
    GattExchangeMtu: function () { return ArgObj.factory('GattExchangeMtu', arguments); },
    GattDiscAllPrimaryServices: function () { return ArgObj.factory('GattDiscAllPrimaryServices', arguments); },
    GattDiscPrimaryServiceByUuid: function () { return ArgObj.factory('GattDiscPrimaryServiceByUuid', arguments); },
    GattFindIncludedServices: function () { return ArgObj.factory('GattFindIncludedServices', arguments); },
    GattDiscAllChars: function () { return ArgObj.factory('GattDiscAllChars', arguments); },
    GattDiscCharsByUuid: function () { return ArgObj.factory('GattDiscCharsByUuid', arguments); },
    GattDiscAllCharDescs: function () { return ArgObj.factory('GattDiscAllCharDescs', arguments); },
    GattReadCharValue: function () { return ArgObj.factory('GattReadCharValue', arguments); },
    GattReadUsingCharUuid: function () { return ArgObj.factory('GattReadUsingCharUuid', arguments); },
    GattReadLongCharValue: function () { return ArgObj.factory('GattReadLongCharValue', arguments); },
    GattReadMultiCharValues:function () { return ArgObj.factory('GattReadMultiCharValues', arguments); }, 
    GattWriteNoRsp: function () { return ArgObj.factory('GattWriteNoRsp', arguments); },
    GattSignedWriteNoRsp: function () { return ArgObj.factory('GattSignedWriteNoRsp', arguments); },
    GattWriteCharValue: function () { return ArgObj.factory('GattWriteCharValue', arguments); },
    GattWriteLongCharValue: function () { return ArgObj.factory('GattWriteLongCharValue', arguments); },
    GattReliableWrites: function () { return ArgObj.factory('GattReliableWrites', arguments); },
    GattReadCharDesc: function () { return ArgObj.factory('GattReadCharDesc', arguments); },
    GattReadLongCharDesc: function () { return ArgObj.factory('GattReadLongCharDesc', arguments); },
    GattWriteCharDesc: function () { return ArgObj.factory('GattWriteCharDesc', arguments); },
    GattWriteLongCharDesc: function () { return ArgObj.factory('GattWriteLongCharDesc', arguments); },
    GattNotification: function () { return ArgObj.factory('GattNotification', arguments); },
    GattIndication: function () { return ArgObj.factory('GattIndication', arguments); },
    GattAddService: function () { return ArgObj.factory('GattAddService', arguments); },
    GattDelService: function () { return ArgObj.factory('GattDelService', arguments); },
    GattAddAttribute: function () { return ArgObj.factory('GattAddAttribute', arguments); },
    /*************************************************************************************************/
    /*** Argument Constructor of GAP Layer HCI APIs (and ZPIs)                                     ***/
    /*************************************************************************************************/
    GapDeviceInit: function () { return ArgObj.factory('GapDeviceInit', arguments); },
    GapConfigDeviceAddr: function () { return ArgObj.factory('GapConfigDeviceAddr', arguments); },
    GapDeviceDiscReq: function () { return ArgObj.factory('GapDeviceDiscReq', arguments); },
    GapDeviceDiscCancel: function () { return ArgObj.factory('GapDeviceDiscCancel', arguments); },
    GapMakeDiscoverable: function () { return ArgObj.factory('GapMakeDiscoverable', arguments); },
    GapUpdateAdvData: function () { return ArgObj.factory('GapUpdateAdvData', arguments); },
    GapEndDisc: function () { return ArgObj.factory('GapEndDisc', arguments); },
    GapEstLinkReq: function () { return ArgObj.factory('GapEstLinkReq', arguments); },
    GapTerminateLink: function () { return ArgObj.factory('GapTerminateLink', arguments); },
    GapAuthenticate: function () { return ArgObj.factory('GapAuthenticate', arguments); },
    GapPasskeyUpdate: function () { return ArgObj.factory('GapPasskeyUpdate', arguments); },
    GapSlaveSecurityReqUpdate: function () { return ArgObj.factory('GapSlaveSecurityReqUpdate', arguments); },
    GapSignable: function () { return ArgObj.factory('GapSignable', arguments); },
    GapBond: function () { return ArgObj.factory('GapBond', arguments); },
    GapTerminateAuth: function () { return ArgObj.factory('GapTerminateAuth', arguments); },
    GapUpdateLinkParamReq: function () { return ArgObj.factory('GapUpdateLinkParamReq', arguments); },
    GapSetParam: function () { return ArgObj.factory('GapSetParam', arguments); },
    GapGetParam: function () { return ArgObj.factory('GapGetParam', arguments); },
    GapResolvePrivateAddr: function () { return ArgObj.factory('GapResolvePrivateAddr', arguments); },
    GapSETAdvToken: function () { return ArgObj.factory('GapSETAdvToken', arguments); },
    GapRemoveAdvToken: function () { return ArgObj.factory('GapRemoveAdvToken', arguments); },
    GapUpdateAdvTokens: function () { return ArgObj.factory('GapUpdateAdvTokens', arguments); },
    GapBondSetParam: function () { return ArgObj.factory('GapBondSetParam', arguments); },
    GapBondGetParam: function () { return ArgObj.factory('GapBondGetParam', arguments); },
    GapBondServiceChange: function () { return ArgObj.factory('GapBondServiceChange', arguments); },
    /*************************************************************************************************/
    /*** Argument Constructor of UTIL Layer HCI APIs (and ZPIs)                                    ***/
    /*************************************************************************************************/
    UtilNvRead: function () { return ArgObj.factory('UtilNvRead', arguments); },
	UtilNvWrite: function () { return ArgObj.factory('UtilNvWrite', arguments); },
	UtilForceBoot: function () { return ArgObj.factory('UtilForceBoot', arguments); }
};

/***************************************************************************************************/
/*** Private Member in This Module                                                               ***/
/***************************************************************************************************/

/***************************************************************************************************/
/*** ArgObj Class                                                                                ***/
/***************************************************************************************************/
// Parent constructor of all argobjs which have command and event type. It has a static factory method() to create argobjs
// It also has methods: getCmdBpiMeta(), makeArgObj(), storeMeta(), getHciCmdBuf(),
// We use the meta-programming to create instances when needed. The meta-data is the argument information of each API.
/**
 * @class ArgObj
 * @constructor
 * @private
 */
function ArgObj() {}

/**
 * @method getCmdBpiMeta
 * @return {Object} the meta data of the cmdBpi
 * @private
 */
ArgObj.prototype.getCmdBpiMeta = function () {
    return this.constructor[this.constr_name].cmdBpiMeta;
};

/**
 * @method makeArgObj
 * @param inArg {Array} the cmdBpi input arguments
 * @return {Object} value object made from the input arguments
 * @private
 */
ArgObj.prototype.makeArgObj = function (inArg) {
    var i,
        arg_len = this.getCmdBpiMeta().len,
        arg_param = this.getCmdBpiMeta().params;

    for (i = 0; i < arg_len; i += 1) {
        this[arg_param[i]] = inArg[i];
    }

    return this;
};

/**
 * @method storeMeta
 * @param cmdBpiMeta {Object} the cmdBpi meta data
 * @return {Object} value object made by the input arguments
 * @private
 */
ArgObj.prototype.storeMeta = function (cmdBpiMeta) {
    // store zpiMeta to the specialized constructor only once
    if (ArgObj[this.constr_name].cmdBpiMeta === undefined) {
        ArgObj[this.constr_name].cmdBpiMeta = cmdBpiMeta;
    }
    return this;
};

/**
 * @method getHciCmdBuf
 * @return {Buffer} HCI command frame of the zpi
 * @private
 */
ArgObj.prototype.getHciCmdBuf = function () {
    //TODO
}

 /**
 * This is the factory of the argument value object for the cmdBpis
 * @method factory
 * @static
 * @param type {String} cmdBpi name
 * @param inArg {Array} input arguments of the cmdBpi
 * @return {Object} value object of the corresponding cmdBpi
 * @private
 */
ArgObj.factory = function (type, inArg) {
    var constr = type,
        new_argobj;

    if (typeof ArgObj[constr] !== "function") { throw new Error(constr + " doesn't exist"); }

    if (typeof ArgObj[constr].prototype.getZpiMeta !== "function") {
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
    var cmdBpiMeta = {

    };
    this.constr_name = 'HciSetReceiverGain';
    this.storeMeta(cmdBpiMeta);
}
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

module.exports = cmdBpi;