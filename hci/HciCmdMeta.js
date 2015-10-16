// Copyright Sivann, Inc. and other Node contributors.
/**
 *  This module provides a object that contains HCI command metadata.
 */
'use strict';

var emptyMeta = {
        params: [],
        types: []
    };
    
module.exports = {
    /*** Metadata of HCI APIs***/
    HciSetRxGain: {
        params: ['rxGain'],
        types: ['uint8']
    },
    HciSetTxPower: {
        params: ['txPower'],
        types: ['uint8']
    },
    HciOnePktPerEvt: {
        params: ['control'],
        types: ['uint8']
    },
    HciClkDivideOnHalt: {
        params: ['control'],
        types: ['uint8']
    },
    HciDeclareNvUsage: {
        params: ['mode'],
        types: ['uint8']
    },
    HciDecrypt: {
        params: ['key', 'encText'],
        types: ['buffer16', 'buffer16']
    },
    HciSetLocalSupportedFeatures: {
        params: ['localFeatures'],
        types: ['buffer8']
    },
    HciSetFastTxRespTime: {
        params: ['control'],
        types: ['uint8']
    },
    HciModemTestTx: {
        params: ['cwMode', 'txFreq'],
        types: ['uint8', 'uint8']
    },
    HciModemHopTestTx: emptyMeta,
    HciModemTestRx: {
        params: ['rxFreq'],
        types: ['uint8']
    },
    HciEndModemTest: emptyMeta,
    HciSetBdaddr: {
        params: ['bdAddr'],
        types: ['addr']
    },
    HciSetSca: {
        params: ['scalnPPM'],
        types: ['uint16le']
    },
    HciEnablePtm: emptyMeta,
    HciSetFreqTune: {
        params: ['step'],
        types: ['uint8']
    },
    HciSaveFreqTune: emptyMeta,
    HciSetMaxDtmTxPower: {
        params: ['txPower'],
        types: ['uint8']
    },
    HciMapPmIoPort: {
        params: ['ioPort', 'ioPin'],
        types: ['uint8', 'uint8']
    },
    HciDisconnectImmed: {
        params: ['connHandle'],
        types: ['uint16le']
    },
    HciPer: {
        params: ['connHandle', 'cmd'],
        types: ['uint16le', 'uint8']
    },
    HciPerByChan: {
        params: ['connHandle', 'perByChan'],
        types: ['uint16le', 'uint16le']
    },
    HciExtendRfRange: emptyMeta,
    HciAdvEventNotice: {
        params: ['taskId', 'cmd'],
        types: ['uint8', 'uint16le']
    },
    HciConnEventNotice: {
        params: ['taskId', 'taskEvt'],
        types: ['uint8', 'uint16le']
    },
    HciHaltDuringRf: {
        params: ['mode'],
        types: ['uint8']
    },
    HciOverrideSl: {
        params: ['taskId'],
        types: ['uint8']
    },
    HciBuildRevision: {
        params: ['mode', 'userRevNum'],
        types: ['uint8', 'uint16le']
    },
    HciDelaySleep: {
        params: ['delay'],
        types: ['uint16le']
    },
    HciResetSystem: {
        params: ['mode'],
        types: ['uint8']
    },
    HciOverlappedProcessing: {
        params: ['mode'],
        types: ['uint8']
    },
    HciNumCompletedPktsLimit: {
        params: ['limit', 'flushOnEvt'],
        types: ['uint8', 'uint8']
    },
    /*** Metadata of L2CAP APIs***/
    L2capParamUPpdateReq: {
        params: ['connHandle', 'intervalMin', 'intervalMax', 'slaveLatency', 'timeoutMultiplier'],
        types: ['uint16le', 'uint16le', 'uint16le', 'uint16le', 'uint16le']
    },
    /*** Metadata of ATT APIs***/
    AttErrorRsp: {
        params: ['connHandle', 'reqOpcode', 'handle', 'errCode'],
        types: ['uint16le', 'uint8', 'uint16le', 'uint8']
    },
    AttExchangeMtuReq: {
        params: ['connHandle', 'clientRxMTU'],
        types: ['uint16le', 'uint16le']
    },
    AttExchangeMtuRsp: {
        params: ['connHandle', 'serverRxMTU'],
        types: ['uint16le', 'uint16le']
    },
    AttFindInfoReq: {
        params: ['connHandle', 'startHandle', 'endHandle'],
        types: ['uint16le', 'uint16le', 'uint16le']
    },
    AttFindInfoRsp: {
        params: ['connHandle', 'format', 'info'],
        types: ['uint16le', 'uint8', 'obj'],
        objInfo: {
            params: ['handle', 'uuid'],
            types: ['uint16le', 'variable'],
            //for test
            precedingLen: 3,
            minLen: 4,
        }
    },
    AttFindByTypeValueReq: {
        params: ['connHandle', 'startHandle', 'endHandle', 'type', 'value'],
        types: ['uint16le', 'uint16le', 'uint16le', 'uint16le', 'buffer'],
        //for test
        preBufLen: 8
    },
    AttFindByTypeValueRsp: {
        params: ['connHandle', 'handlesInfo'],
        types: ['uint16le', 'obj'],
        objInfo: {
            params: ['attrHandle', 'grpEndHandle'],
            types: ['uint16le', 'uint16le'],
            //for test
            objLen: 4,
            precedingLen: 2,
            minLen: 4,
        }
    },
    AttReadByTypeReq: {
        params: ['connHandle', 'startHandle', 'endHandle', 'type'],
        types: ['uint16le', 'uint16le', 'uint16le', 'buffer'],
        //for test
        preBufLen: 6
    },
    AttReadByTypeRsp: {
        params: ['connHandle', 'length', 'data'],
        types: ['uint16le', 'uint8', 'obj'],
        objInfo: {
            params: ['attrHandle', 'attrVal'],
            types: ['uint16le', 'buffer'],
            //for test
            precedingLen: 3,
            preBufLen: 2,
            minLen: 2,
        }
    },
    AttReadReq: {
        params: ['connHandle', 'handle'],
        types: ['uint16le', 'uint16le']
    },
    AttReadRsp: {
        params: ['connHandle', 'value'],
        types: ['uint16le', 'buffer'],
        //for test
        preBufLen: 2
    },
    AttReadBlobReq: {
        params: ['connHandle', 'handle', 'offset'],
        types: ['uint16le', 'uint16le', 'uint16le']
    },
    AttReadBlobRsp: {
        params: ['connHandle', 'value'],
        types: ['uint16le', 'buffer'],
        //for test
        preBufLen: 2
    },
    AttReadMultiReq: {
        params: ['connHandle', 'handles'],
        types: ['uint16le', 'obj'],
        objInfo: {
            params: ['handle'],
            types: ['uint16le'],
            //for test
            objLen: 2,
            precedingLen: 2,
            minLen: 4
        }
    },
    AttReadMultiRsp: {
        params: ['connHandle', 'value'],
        types: ['uint16le', 'buffer'],
        //for test
        preBufLen: 2
    },
    AttReadByGrpTypeReq: {
        params: ['connHandle', 'startHandle', 'endHandle', 'type'],
        types: ['uint16le', 'uint16le', 'uint16le', 'buffer'],
        //for test
        preBufLen: 6
    },
    AttReadByGrpTypeRsp: {
        params: ['connHandle', 'length', 'data'],
        types: ['uint16le', 'uint8', 'obj'],
        objInfo: {
            params: ['attrHandle', 'endGroupHandle', 'attrVal'],
            types: ['uint16le', 'uint16le', 'buffer'],
            //for test
            precedingLen: 3,
            preBufLen: 4,
            minLen: 2,
        }
    },
    AttWriteReq: {
        params: ['connHandle', 'signature', 'command', 'handle', 'value'],
        types: ['uint16le', 'uint8', 'uint8', 'uint16le', 'buffer'],
        //for test
        preBufLen: 6
    },
    AttWriteRsp: {
        params: ['connHandle'],
        types: ['uint16le']
    },
    AttPrepareWriteReq: {
        params: ['connHandle', 'handle', 'offset', 'value'],
        types: ['uint16le', 'uint16le', 'uint16le', 'buffer'],
        //for test
        preBufLen: 6
    },
    AttPrepareWriteRsp: { 
        params: ['connHandle', 'handle', 'offset', 'value'],
        types: ['uint16le', 'uint16le', 'uint16le', 'buffer'],
        //for test
        preBufLen: 6
    },
    AttExecuteWriteReq: {
        params: ['connHandle', 'flags'],
        types: ['uint16le', 'uint8']
    },
    AttExecuteWriteRsp: {
        params: ['connHandle'],
        types: ['uint16le']
    },
    AttHandleValueNoti: {
        params: ['connHandle', 'authenticated', 'handle', 'value'],
        types: ['uint16le', 'uint8', 'uint16le', 'buffer'],
        //for test
        preBufLen: 5
    },
    AttHandleValueInd: {
        params: ['connHandle', 'authenticated', 'handle', 'value'],
        types: ['uint16le', 'uint8', 'uint16le', 'buffer'],
        //for test
        preBufLen: 5
    },
    AttHandleValueCfm: {
        params: ['connHandle'],
        types: ['uint16le']
    },
    /*** Metadata of GATT APIs***/
    GattExchangeMtu: {
        params: ['connHandle', 'clientRxMTU'],
        types: ['uint16le', 'uint16le']
    },
    GattDiscAllPrimaryServices: {
        params: ['connHandle'],
        types: ['uint16le']
    },
    GattDiscPrimaryServiceByUuid: {
        params: ['connHandle', 'value'],
        types: ['uint16le', 'buffer'],
        //for test
        preBufLen: 2
    },
    GattFindIncludedServices: {
        params: ['connHandle', 'startHandle', 'endHandle'],
        types: ['uint16le', 'uint16le', 'uint16le']
    },
    GattDiscAllChars: {
        params: ['connHandle', 'startHandle', 'endHandle'],
        types: ['uint16le', 'uint16le', 'uint16le']
    },
    GattDiscCharsByUuid: {
        params: ['connHandle', 'startHandle', 'endHandle', 'type'],
        types: ['uint16le', 'uint16le', 'uint16le', 'buffer'],
        //for test
        preBufLen: 6
    },
    GattDiscAllCharDescs: {
        params: ['connHandle', 'handle', 'offset'],
        types: ['uint16le', 'uint16le', 'uint16le']
    },
    GattReadCharValue: {
        params: ['connHandle', 'handle'],
        types: ['uint16le', 'uint16le']
    },
    GattReadUsingCharUuid: {
        params: ['connHandle', 'startHandle', 'endHandle', 'type'],
        types: ['uint16le', 'uint16le', 'uint16le', 'buffer'],
        //for test
        preBufLen: 6
    },
    GattReadLongCharValue: {
        params: ['connHandle', 'handle', 'offset'],
        types: ['uint16le', 'uint16le', 'uint16le']
    },
    GattReadMultiCharValues: {
        params: ['connHandle', 'handles'],
        types: ['uint16le', 'obj'],
        objInfo: {
            params: ['handle'],
            types: ['uint16le'],
            //for test
            objLen: 2,
            precedingLen: 2,
            minLen: 4
        }
    },
    GattWriteNoRsp: {
        params: ['connHandle', 'handle', 'value'],
        types: ['uint16le', 'uint16le', 'buffer'],
        //for test
        preBufLen: 4
    },
    GattSignedWriteNoRsp: {
        params: ['connHandle', 'handle', 'value'],
        types: ['uint16le', 'uint16le', 'buffer'],
        //for test
        preBufLen: 4
    },
    GattWriteCharValue: {
        params: ['connHandle', 'signature', 'command', 'handle', 'value'],
        types: ['uint16le', 'uint8', 'uint8', 'uint16le', 'buffer'],
        //for test
        preBufLen: 6
    },
    GattWriteLongCharValue: {
        params: ['connHandle', 'handle', 'offset', 'value'],
        types: ['uint16le', 'uint16le', 'uint16le', 'buffer'],
        //for test
        preBufLen: 6
    },
    GattReliableWrites: {
        params: ['connHandle', 'numberRequests', 'requests'],
        types: ['uint16le', 'uint16le', 'obj'],
        objInfo: {
            params: ['attrValLen', 'handle', 'offset', 'value'],
            types: ['uint8', 'uint16le', 'uint16le', 'buffer'],
            //for test
            precedingLen: 4,
            preBufLen: 5
        }
    },
    GattReadCharDesc: {
        params: ['connHandle', 'handle'],
        types: ['uint16le', 'uint16le']
    },
    GattReadLongCharDesc: {
        params: ['connHandle', 'handle', 'offset'],
        types: ['uint16le', 'uint16le', 'uint16le']
    },
    GattWriteCharDesc: {
        params: ['connHandle', 'signature', 'command', 'handle', 'value'],
        types: ['uint16le', 'uint8', 'uint8', 'uint16le', 'buffer'],
        //for test
        preBufLen: 6
    },
    GattWriteLongCharDesc: {
        params: ['connHandle', 'handle', 'offset', 'value'],
        types: ['uint16le', 'uint16le', 'uint16le', 'buffer'],
        //for test
        preBufLen: 6
    },
    GattNotification: {
        params: ['connHandle', 'authenticated', 'handle', 'value'],
        types: ['uint16le', 'uint8', 'uint16le', 'buffer'],
        //for test
        preBufLen: 5
    },
    GattIndication: {
        params: ['connHandle', 'authenticated', 'handle', 'value'],
        types: ['uint16le', 'uint8', 'uint16le', 'buffer'],
        //for test
        preBufLen: 5
    },
    GattAddService: {
        params: ['UUID', 'numAttrs'],
        types: ['uint16le', 'uint16le']
    },
    GattDelService: {
        params: ['handle'],
        types: ['uint16le']
    },
    GattAddAttribute: { //???
        params: ['UUID', 'permissions'],
        types: ['buffer', 'uint8'],
        //for test
        preBufLen: 1
    },
    /*** Metadata of GAP APIs***/
    GapDeviceInit: {
        params: ['profileRole', 'maxScanResponses', 'IRK', 'CSRK', 'signCounter'],
        types: ['uint8', 'uint8', 'buffer16', 'buffer16', 'uint32le']
    },
    GapConfigDeviceAddr: {
        params: ['BitMask', 'Addr'],
        types: ['uint8', 'addr']
    },
    GapDeviceDiscReq: {
        params: ['mode', 'activeScan', 'whiteList'],
        types: ['uint8', 'uint8', 'uint8']
    },
    GapDeviceDiscCancel: emptyMeta, 
    GapMakeDiscoverable: {
        params: ['eventType', 'initiatorAddrType', 'initiatorAddr', 'channelMap', 'filterPolicy'],
        types: ['uint8', 'uint8', 'addr', 'uint8', 'uint8']
    },
    GapUpdateAdvData: {
        params: ['adType', 'daraLen', 'advertData'],
        types: ['uint8', 'uint8', 'buffer'],
        //for test
        preBufLen: 2
    },
    GapEndDisc: emptyMeta,
    GapEstLinkReq: {
        params: ['highDutyCycle', 'whiteList', 'addrtypePeer', 'peerAddr'],
        types: ['uint8', 'uint8', 'uint8', 'addr']
    },
    GapTerminateLink: {
        params: ['connHandle', 'reason'],
        types: ['uint16le', 'uint8']
    },
    GapAuthenticate: {   //???
        params: ['connHandle', 'secReq_ioCaps', 'secReq_oobAvailable', 'secReq_oob', 'secReq_authReq', 'secReq_maxEncKeySize', 'secReq_keyDist', 'pairReq_Enable', 'pairReq_ioCaps', 'pairReq_oobDataFlag', 'pairReq_authReq', 'pairReq_maxEncKeySize', 'pairReq_keyDist'],
        types: ['uint16le', 'uint8', 'uint8', 'buffer16', 'uint8', 'uint8', 'uint8', 'uint8', 'uint8', 'uint8', 'uint8', 'uint8', 'uint8']
    },
    GapPasskeyUpdate: {
        params: ['connHandle', 'passkey'],
        types: ['uint16le', 'buffer6']
    },
    GapSlaveSecurityReqUpdate: {
        params: ['connHandle', 'authReq'],
        types: ['uint16le', 'uint8']
    },
    GapSignable: {
        params: ['connHandle', 'authenticated', 'CSRK', 'signCounter'],
        types: ['uint16le', 'uint8', 'buffer16', 'uint32le']
    },
    GapBond: {
        params: ['connHandle', 'authenticated', 'LTK', 'DIV', 'rand', 'LTKsize'],
        types: ['uint16le', 'uint8', 'buffer16', 'uint16le', 'buffer8', 'uint8']
    },
    GapTerminateAuth: {
        params: ['connHandle', 'reason'],
        types: ['uint16le', 'uint8']
    },
    GapUpdateLinkParamReq: {
        params: ['connHandle', 'intervalMin', 'intervalMax', 'connLatency', 'connTimeout'],
        types: ['uint16le', 'uint16le', 'uint16le', 'uint16le', 'uint16le']
    },
    GapSetParam: {
        params: ['paramID', 'paramValue'],
        types: ['uint8', 'uint16le']
    },
    GapGetParam: {
        params: ['paramID'],
        types: ['uint8']
    },
    GapResolvePrivateAddr: {
        params: ['IRK', 'Addr'],
        types: ['buffer16', 'addr']
    },
    GapSETAdvToken: {
        params: ['adType', 'advDataLen', 'advData'],
        types: ['uint8', 'uint8', 'buffer'],
        //for test
        preBufLen: 2
    },
    GapRemoveAdvToken: {
        params: ['adType'],
        types: ['uint8']
    },
    GapUpdateAdvTokens: emptyMeta,
    GapBondSetParam: {
        params: ['paramID', 'paramDataLan', 'paramData'],
        types: ['uint16le', 'uint8', 'buffer'],
        //for test
        preBufLen: 3
    },
    GapBondGetParam: {
        params: ['paramID'],
        types: ['uint16le']
    },
    /*** Metadata of UTIL APIs***/
    UtilNvRead: {
        params: ['nvID', 'nvDataLen'],
        types: ['uint8', 'uint8']
    },
    UtilNvWrite: {
        params: ['nvID', 'nvDataLen', 'nvData'],
        types: ['uint8', 'uint8', 'buffer'],
        //for test
        preBufLen: 2
    },
    UtilForceBoot: emptyMeta
};
