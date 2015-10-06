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
};

_.forEach(hciSubMeta, function (name) {
    hciEvtMeta[name] = hciNormalMeta;
});

module.exports = hciEvtMeta;