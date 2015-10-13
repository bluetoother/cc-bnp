var _ = require('lodash'),
    hciNormalMeta = {
        len: 2,
        paramLens: 5,
        params: ['status', 'cmdOpcode'],
        types: ['uint8', 'uint16le'],    
    },
    hciSubMeta = [ 
        'HciSetRxGain', 'HciSetTxPower', 'HciOnePktPerEvt', 'HciClkDivideOnHalt', 'HciDeclareNvUsage', 'HciSetLocalSupportedFeatures',
        'HciSetFastTxRespTime', 'HciModemTestTx', 'HciModemHopTestTx','HciModemTestRx', 'HciEndModemTest', 'HciSetBdaddr', 'HciSetSca',
        'HciSetFreqTune', 'HciSaveFreqTune', 'HciSetMaxDtmTxPower', 'HciMapPmIoPort', 'HciDisconnectImmed', 'HciPerByChan', 'HciExtendRfRange',
        'HciHaltDuringRf', 'HciOverrideSl', 'HciDelaySleep', 'HciResetSystem', 'HciOverlappedProcessing', 'HciNumCompletedPktsLimit'
    ];

var hciEvtMeta = {
    /*** Metadata of HCI APIs***/
    HciDecrypt: {
        paramLens: 21,
        params: ['status', 'cmdOpcode', 'plainTextData'],
        types: ['uint8', 'uint16le', 'buffer16']
    },
    HciPer: {
        paramLens: 'variable',
        params: ['status', 'cmdOpcode', 'cmdVal'],
        types: ['uint8', 'uint16le', 'uint8'],
        append: {
            paramLens: 14,
            params: ['numPkts', 'numCrcErr', 'numEvents', 'numMissedEvents'],
            types: ['uint16le', 'uint16le', 'uint16le', 'uint16le'],
        }
    },
    HciBuildRevision: {
        paramLens: 9,
        params: ['status', 'cmdOpcode', 'userRevNum', 'buildRevNum'],
        types: ['uint8', 'uint16le', 'uint16le', 'uint16le']
    },

    /*** Metadata of L2CAP APIs***/
L2capCmdReject: {
        paramLens: 7,
        params: ['status', 'connHandle', 'reason'],
        types: ['uint8', 'uint16le', 'uint16le']
    },

L2capParamUpdateRsp: {
        paramLens: 7,
        params: ['status', 'connHandle', 'reason'],
        types: ['uint8', 'uint16le', 'uint16le']
    },

    /*** Metadata of GAP APIs***/
GapDeviceInitDone: {
        paramLens: 44,
        params: ['status', 'devAddr', 'dataPltLen', 'numDataPkts', 'IRK', 'CSRK'],
        types: ['uint8', 'addr', 'uint16le', 'uint8', 'buffer16', 'buffer16']
    },

GapDeviceDiscovery: {
        paramLens: 'variable',
        params: ['status'],
        types: ['uint8'],
        append: {
            params: ['numDevs', 'eventType', 'addrType', 'addr'],
            types: ['uint8', 'uint8', 'uint8', 'addr'],
        }
    },

GapAdvDataUpdateDone: {
        paramLens: 4,
        params: ['status', 'adType'],
        types: ['uint8', 'uint8']
    },

GapMakeDiscoverableDone: {
        paramLens: 5,
        params: ['status', 'interval'],
        types: ['uint8', 'uint16le']
    },

GapEndDiscoverableDone: {
        paramLens: 3,
        params: ['status'],
        types: ['uint8']
    },

GapLinkEstablished: {
        paramLens: 19,
        params: ['status', 'addrType', 'addr', 'connHandle', 'connInterval', 'connLatency', 'connTimeout', 'clockAccuracy'],
        types: ['uint8', 'uint8', 'addr', 'uint16le', 'uint16le', 'uint16le', 'uint16le', 'uint8']
    },

GapLinkTerminated: {
        paramLens: 6,
        params: ['status', 'connHandle', 'reason'],
        types: ['uint8', 'uint16le', 'uint8']
    },

GapLinkParamUpdate: {
        paramLens: 11,
        params: ['status', 'connHandle', 'connInterval', 'connLatency', 'connTimeout'],
        types: ['uint8', 'uint16le', 'uint16le', 'uint16le', 'uint16le']
    },

GapRandomAddrChanged: {
        paramLens: 10,
        params: ['status', 'addrType', 'newRandomAddr'],
        types: ['uint8', 'uint8', 'addr']
    },

GapSignatureUpdated: { 
        paramLens: 14,
        params: ['status', 'addrType', 'devAddr', 'signCounter'],
        types: ['uint8', 'uint8', 'addr', 'uint32le']
    },

GapAuthenticationComplete: { //TODO, Test
        paramLens: 106,
        params: ['status', 'connHandle', 'authState', 'secInfo', 'sec_ltkSize', 'sec_ltk', 'sec_div', 'sec_rand', 'devSecInfo', 'dev_ltkSize',
                 'dev_ltk', 'dev_div', 'dev_rand', 'identityInfo', 'identity_irk', 'identity_bd_addr', 'signingInfo', 'signing_irk', 'signing_signCounter'],
        types: ['uint8', 'uint16le', 'uint8', 'uint8', 'uint8', 'buffer16', 'uint16le', 'uint64', 'uint8', 'uint8', 'buffer16', 'uint16le', 'uint64',
                'uint8', 'buffer16', 'addr', 'uint8', 'buffer16', 'uint32le'],
    },

GapPasskeyNeeded: {
        paramLens: 13,
        params: ['status', 'devAddr', 'connHandle', 'uiInput', 'uiOutput'],
        types: ['uint8', 'addr', 'uint16le', 'uint8', 'uint8']
    },

GapSlaveRequestedSecurity: {
        paramLens: 12,
        params: ['status', 'connHandle', 'devAddr', 'authReq'],
        types: ['uint8', 'uint16le', 'addr', 'uint8']
    },

GapDeviceInfo: {
        paramLens: 'variable',
        params: ['status', 'eventType', 'addrType', 'addr', 'rssi'],
        types: ['uint8', 'uint8', 'uint8', 'addr', 'uint8'],
        append: {
            params: ['dataLen', 'dataField'],
            types: ['uint8', 'buffer'],
        }
    },

GapBondComplete: {
        paramLens: '5',
        params: ['status', 'connHandle'],
        types: ['uint8', 'uint16le']
    },

GapPairingReq: {
        paramLens: '10',
        params: ['status', 'connHandle', 'ioCap', 'oobDataFlag', 'authReq', 'maxEncKeySize', 'keyDist'],
        types: ['uint8', 'uint16le', 'uint8', 'uint8', 'uint8', 'uint8', 'uint8']
    },

GapCmdStatus: {
        paramLens: 'variable',
        params: ['status', 'opCode'],
        types: ['uint8', 'uint16le'],
        append: {
            params: ['dataLen', 'payload'],
            types: ['uint8', 'buffer'],
        }
    },

    /*** Metadata of ATT APIs***/
AttErrorRsp: {
        paramLens: 10,
        params: ['status', 'connHandle', 'pduLen', 'reqOpcode', 'handle', 'errCode'],
        types: ['uint8', 'uint16le', 'uint8', 'uint8', 'uint16le', 'uint8']
    },

AttExchangeMtuReq: {
        paramLens: 8,
        params: ['status', 'connHandle', 'pduLen', 'clientRxMTU'],
        types: ['uint8', 'uint16le', 'uint8', 'uint16le']
    },

AttExchangeMtuRsp: {
        paramLens: 8,
        params: ['status', 'connHandle', 'pduLen', 'serverRxMTU'],
        types: ['uint8', 'uint16le', 'uint8', 'uint16le']
    },

AttFindInfoReq: {
        paramLens: 10,
        params: ['status', 'connHandle', 'pduLen', 'startHandle', 'endHandle'],
        types: ['uint8', 'uint16le', 'uint8', 'uint16le', 'uint16le']
    },

AttFindInfoRsp: {
        paramLens: 'variable',
        params: ['status', 'connHandle', 'pduLen'],
        types: ['uint8', 'uint16le', 'uint8'],
        append: {
            precedingLen: 7,
            minLen: 4,
            params: ['format', 'info']
        }
    },

AttFindByTypeValueReq: {
        paramLens: 'variable',
        params: ['status', 'connHandle', 'pduLen', 'startHandle', 'endHandle', 'type'],
        types: ['uint8', 'uint16le', 'uint8', 'uint16le', 'uint16le', 'uint16le'],
        append: {
            precedingLen: 12,
            minLen: 0,
            params: ['value']
        }
    },

AttFindByTypeValueRsp: {
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
    },

AttReadByTypeReq: {
        paramLens: 'variable',
        params: ['status', 'connHandle', 'pduLen', 'startHandle', 'endHandle'],
        types: ['uint8', 'uint16le', 'uint8', 'uint16le', 'uint16le'],
        append: {
            precedingLen: 10,
            minLen: 2,
            params: ['format']
        }
    },

AttReadByTypeRsp: {
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
    },

AttReadReq: {
        paramLens: 8,
        params: ['status', 'connHandle', 'pduLen', 'handle'],
        types: ['uint8', 'uint16le', 'uint8', 'uint16le']
    },

AttReadRsp: {
        paramLens: 'variable',
        params: ['status', 'connHandle', 'pduLen'],
        types: ['uint8', 'uint16le', 'uint8'],
        append: {
            precedingLen: 6,
            minLen: 0,
            params: ['value']
        }
    },

AttReadBlobReq: {
        paramLens: 10,
        params: ['status', 'connHandle', 'pduLen', 'handle', 'offset'],
        types: ['uint8', 'uint16le', 'uint8', 'uint16le', 'uint16le']
    },

AttReadBlobRsp: {
        paramLens: 'variable',
        params: ['status', 'connHandle', 'pduLen'],
        types: ['uint8', 'uint16le', 'uint8'],
        append: {
            precedingLen: 6,
            minLen: 0,
            params: ['value']
        }
    },

AttReadMultiReq: {
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
    },

AttReadMultiRsp: {
        paramLens: 'variable',
        params: ['status', 'connHandle', 'pduLen'],
        types: ['uint8', 'uint16le', 'uint8'],
        append: {
            precedingLen: 6,
            minLen: 0,
            params: ['value']
        }
    },

AttReadByGrpTypeReq: {
        paramLens: 'variable',
        params: ['status', 'connHandle', 'pduLen', 'startHandle', 'endHandle'],
        types: ['uint8', 'uint16le', 'uint8', 'uint16le', 'uint16le'],
        append: {
            precedingLen: 10,
            minLen: 2,
            params: ['type']
        }
    },

AttReadByGrpTypeRsp: {
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
    },

AttWriteReq: {
        paramLens: 'variable',
        params: ['status', 'connHandle', 'pduLen', 'signature', 'command', 'handle'],
        types: ['uint8', 'uint16le', 'uint8', 'uint8', 'uint8', 'uint16le'],
        append: {
            precedingLen: 10,
            minLen: 0,
            params: ['value']
        }
    },

AttWriteRsp: {
        paramLens: 6,
        params: ['status', 'connHandle', 'pduLen'],
        types: ['uint8', 'uint16le', 'uint8'],
    },

AttPrepareWriteReq: {
        paramLens: 'variable',
        params: ['status', 'connHandle', 'pduLen', 'handle', 'offset'],
        types: ['uint8', 'uint16le', 'uint8', 'uint16le', 'uint16le'],
        append: {
            precedingLen: 10,
            minLen: 0,
            params: ['value']
        }
    },  

AttPrepareWriteRsp: {
        paramLens: 'variable',
        params: ['status', 'connHandle', 'pduLen', 'handle', 'offset'],
        types: ['uint8', 'uint16le', 'uint8', 'uint16le', 'uint16le'],
        append: {
            precedingLen: 10,
            minLen: 0,
            params: ['value']
        }
    },

AttExecuteWriteReq: {
        paramLens: 7,
        params: ['status', 'connHandle', 'pduLen', 'value'],
        types: ['uint8', 'uint16le', 'uint8', 'uint8']
    },

AttExecuteWriteRsp: {
        paramLens: 6,
        params: ['status', 'connHandle', 'pduLen'],
        types: ['uint8', 'uint16le', 'uint8']
    },

AttHandleValueNoti: {
        paramLens: 'variable',
        params: ['status', 'connHandle', 'pduLen', 'authenticated', 'handle'],
        types: ['uint8', 'uint16le', 'uint8', 'uint8', 'uint16le'],
        append: {
            precedingLen: 9,
            minLen: 0,
            params: ['value']
        }
    },

AttHandleValueInd: {
        paramLens: 'variable',
        params: ['status', 'connHandle', 'pduLen', 'authenticated', 'handle'],
        types: ['uint8', 'uint16le', 'uint8', 'uint8', 'uint16le'],
        append: {
            precedingLen: 9,
            minLen: 0,
            params: ['value']
        }
    },

AttHandleValueCfm: {
        paramLens: 6,
        params: ['status', 'connHandle', 'pduLen'],
        types: ['uint8', 'uint16le', 'uint8']
    },

    /*** Metadata of GATT APIs***/
GattClientCharCfgUpdate: {
        paramLens: 10,
        params: ['status', 'connHandle', 'pduLen', 'attributeHandle', 'value'],
        types: ['uint8', 'uint16le', 'uint8', 'uint16le', 'uint16le']
    }

};

_.forEach(hciSubMeta, function (name) {
    hciEvtMeta[name] = hciNormalMeta;
});

module.exports = hciEvtMeta;
