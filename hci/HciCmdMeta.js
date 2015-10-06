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

    /*** Metadata of ATT APIs***/
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
    /*** Metadata of GATT APIs***/

    /*** Metadata of GAP APIs***/

    /*** Metadata of UTIL APIs***/

};