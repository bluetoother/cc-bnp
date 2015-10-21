var DChunks = require('dissolve-chunks'),
    ru = DChunks().Rule(),
    _ = require('lodash'),
	evtBpi = require('../hci/HciEvtDiscriminator');

/*************************************************************************************************/
/*** Test HCI Events HCI APIs                                                                  ***/
/*************************************************************************************************/
var hciSetRxGain = evtBpi.HciSetRxGain();
hciSetRxGain.getHciEvtPacket(5, new Buffer([0x00, 0x00, 0xFC]), function (err, result) {
	console.log('/**********HciSetRxGain**********/');
	console.log(err);
	console.log(result);
});

var hciSetTxPower                = evtBpi.HciSetTxPower();                  hciSetTxPower               .getHciEvtPacket(5, new Buffer([0x00, 0x01, 0xFC]), function (err, result) {console.log('/**********HciSetTxPower**********/'); console.log(err); console.log(result);});
var hciOnePktPerEvt              = evtBpi.HciOnePktPerEvt();                hciOnePktPerEvt             .getHciEvtPacket(5, new Buffer([0x00, 0x02, 0xFC]), function (err, result) {console.log('/**********HciOnePktPerEvt**********/'); console.log(err); console.log(result);});
var hciClkDivideOnhalt           = evtBpi.HciClkDivideOnHalt();             hciClkDivideOnhalt          .getHciEvtPacket(5, new Buffer([0x00, 0x03, 0xFC]), function (err, result) {console.log('/**********HciClkDivideOnHalt**********/'); console.log(err); console.log(result);});
var hciDeclareNvUsage            = evtBpi.HciDeclareNvUsage();              hciDeclareNvUsage           .getHciEvtPacket(5, new Buffer([0x00, 0x04, 0xFC]), function (err, result) {console.log('/**********HciDeclareNvUsage**********/'); console.log(err); console.log(result);});
var hciDecrypt                   = evtBpi.HciDecrypt();                     hciDecrypt.getHciEvtPacket(21, new Buffer([0x00, 0x05, 0xFC, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01]), function (err, result) {console.log('/**********HciDecrypt**********/'); console.log(err); console.log(result);});
var hciSetLocalSupportedFeatures = evtBpi.HciSetLocalSupportedFeatures();   hciSetLocalSupportedFeatures.getHciEvtPacket(5, new Buffer([0x00, 0x06, 0xFC]), function (err, result) {console.log('/**********HciSetLocalSupportedFeatures**********/'); console.log(err); console.log(result);});
var hciSetFastTxRespTime         = evtBpi.HciSetFastTxRespTime();           hciSetFastTxRespTime        .getHciEvtPacket(5, new Buffer([0x00, 0x07, 0xFC]), function (err, result) {console.log('/**********HciSetFastTxRespTime**********/'); console.log(err); console.log(result);});
var hciModemTestTx               = evtBpi.HciModemTestTx();                 hciModemTestTx              .getHciEvtPacket(5, new Buffer([0x00, 0x08, 0xFC]), function (err, result) {console.log('/**********HciModemTestTx**********/'); console.log(err); console.log(result);});
var hciModemhopTestTx            = evtBpi.HciModemHopTestTx();              hciModemhopTestTx           .getHciEvtPacket(5, new Buffer([0x00, 0x09, 0xFC]), function (err, result) {console.log('/**********HciModemHopTestTx**********/'); console.log(err); console.log(result);});
var hciModemTestRx               = evtBpi.HciModemTestRx();                 hciModemTestRx              .getHciEvtPacket(5, new Buffer([0x00, 0x0A, 0xFC]), function (err, result) {console.log('/**********HciModemTestRx**********/'); console.log(err); console.log(result);});
var hciEndModemTest              = evtBpi.HciEndModemTest();                hciEndModemTest             .getHciEvtPacket(5, new Buffer([0x00, 0x0B, 0xFC]), function (err, result) {console.log('/**********HciEndModemTest**********/'); console.log(err); console.log(result);});
var hciSetBdaddr                 = evtBpi.HciSetBdaddr();                   hciSetBdaddr                .getHciEvtPacket(5, new Buffer([0x00, 0x0C, 0xFC]), function (err, result) {console.log('/**********HciSetBdaddr**********/'); console.log(err); console.log(result);});
var hciSetSca                    = evtBpi.HciSetSca();                      hciSetSca                   .getHciEvtPacket(5, new Buffer([0x00, 0x0D, 0xFC]), function (err, result) {console.log('/**********HciSetSca**********/'); console.log(err); console.log(result);});
var hciSetFreqTune               = evtBpi.HciSetFreqTune();                 hciSetFreqTune              .getHciEvtPacket(5, new Buffer([0x00, 0x0F, 0xFC]), function (err, result) {console.log('/**********HciSetFreqTune**********/'); console.log(err); console.log(result);});
var hciSaveFreqTune              = evtBpi.HciSaveFreqTune();                hciSaveFreqTune             .getHciEvtPacket(5, new Buffer([0x00, 0x10, 0xFC]), function (err, result) {console.log('/**********HciSaveFreqTune**********/'); console.log(err); console.log(result);});
var hciSetMaxDtmTxPower          = evtBpi.HciSetMaxDtmTxPower();            hciSetMaxDtmTxPower         .getHciEvtPacket(5, new Buffer([0x00, 0x11, 0xFC]), function (err, result) {console.log('/**********HciSetMaxDtmTxPower**********/'); console.log(err); console.log(result);});
var hciMapPmIoPort               = evtBpi.HciMapPmIoPort();                 hciMapPmIoPort              .getHciEvtPacket(5, new Buffer([0x00, 0x12, 0xFC]), function (err, result) {console.log('/**********HciMapPmIoPort**********/'); console.log(err); console.log(result);});
var hciDisconnectImmed           = evtBpi.HciDisconnectImmed();             hciDisconnectImmed          .getHciEvtPacket(5, new Buffer([0x00, 0x13, 0xFC]), function (err, result) {console.log('/**********HciDisconnectImmed**********/'); console.log(err); console.log(result);});

var hciPer = evtBpi.HciPer();
hciPer.getHciEvtPacket(14, new Buffer([0x00, 0x14, 0xFC, 0x01, 0x47, 0x00, 0x00, 0x00, 0x47, 0x00, 0x00, 0x00]), function (err, result) {
	console.log('/**********HciPer1**********/');
	console.log(err);
	console.log(result);
});
hciPer.getHciEvtPacket(6, new Buffer([0x00, 0x14, 0xFC, 0x00]), function (err, result) {
	console.log('/**********HciPer2**********/');
	console.log(err);
	console.log(result);
});

var hciPerByChan             = evtBpi.HciPerByChan();               hciPerByChan            .getHciEvtPacket(5, new Buffer([0x00, 0x15, 0xFC]), function (err, result) {console.log('/**********HciPerByChan**********/'); console.log(err); console.log(result);});
var hciExtendRfRange         = evtBpi.HciExtendRfRange();           hciExtendRfRange        .getHciEvtPacket(5, new Buffer([0x00, 0x16, 0xFC]), function (err, result) {console.log('/**********HciExtendRfRange**********/'); console.log(err); console.log(result);});
var hcihaltDuringRf          = evtBpi.HciHaltDuringRf();            hcihaltDuringRf         .getHciEvtPacket(5, new Buffer([0x00, 0x19, 0xFC]), function (err, result) {console.log('/**********HciHaltDuringRf**********/'); console.log(err); console.log(result);});
var hciOverrideSl            = evtBpi.HciOverrideSl();              hciOverrideSl           .getHciEvtPacket(5, new Buffer([0x00, 0x1A, 0xFC]), function (err, result) {console.log('/**********HciOverrideSl**********/'); console.log(err); console.log(result);});
var hciBuildRevision         = evtBpi.HciBuildRevision();           hciBuildRevision        .getHciEvtPacket(9, new Buffer([0x00, 0x1B, 0xFC, 0x01, 0x00, 0x01, 0x00 ]), function (err, result) {console.log('/**********HciBuildRevision**********/'); console.log(err); console.log(result);});
var hciDelaySleep            = evtBpi.HciDelaySleep();              hciDelaySleep           .getHciEvtPacket(5, new Buffer([0x00, 0x1C, 0xFC]), function (err, result) {console.log('/**********HciDelaySleep**********/'); console.log(err); console.log(result);});
var hciResetSystem           = evtBpi.HciResetSystem();             hciResetSystem          .getHciEvtPacket(5, new Buffer([0x00, 0x1D, 0xFC]), function (err, result) {console.log('/**********HciResetSystem**********/'); console.log(err); console.log(result);});
var hciOverlappedProcessing  = evtBpi.HciOverlappedProcessing();    hciOverlappedProcessing .getHciEvtPacket(5, new Buffer([0x00, 0x1E, 0xFC]), function (err, result) {console.log('/**********HciOverlappedProcessing**********/'); console.log(err); console.log(result);});
var hciNumCompletedPktsLimit = evtBpi.HciNumCompletedPktsLimit();   hciNumCompletedPktsLimit.getHciEvtPacket(5, new Buffer([0x00, 0x1F, 0xFC]), function (err, result) {console.log('/**********HciNumCompletedPktsLimit**********/'); console.log(err); console.log(result);});

/*************************************************************************************************/
/*** Test ATT Events HCI APIs                                                                  ***/
/*************************************************************************************************/
var attErrorRsp           = evtBpi.AttErrorRsp          ();       attErrorRsp          .getHciEvtPacket(10, new Buffer([0x00, 0x01, 0x00, 0x04, 0x09, 0x01, 0x00, 0x11]), function(err, result) {console.log('/**********AttErrorRsp**********/'); console.log(err); console.log(result);});
var attExchangeMtuReq     = evtBpi.AttExchangeMtuReq    ();       attExchangeMtuReq    .getHciEvtPacket(8, new Buffer([0x00, 0x01, 0x00, 0x02, 0x18, 0x02]), function(err, result) {console.log('/**********AttExchangeMtuReq**********/'); console.log(err); console.log(result);});
var attExchangeMtuRsp     = evtBpi.AttExchangeMtuRsp    ();       attExchangeMtuRsp    .getHciEvtPacket(8, new Buffer([0x00, 0x01, 0x00, 0x02, 0x18, 0x01]), function(err, result) {console.log('/**********AttExchangeMtuRsp**********/'); console.log(err); console.log(result);});
var attFindInfoReq        = evtBpi.AttFindInfoReq       ();       attFindInfoReq       .getHciEvtPacket(10, new Buffer([0x00, 0x01, 0x00, 0x04, 0x01, 0x00, 0x1C, 0x00]), function(err, result) {console.log('/**********AttFindInfoReq**********/'); console.log(err); console.log(result);});

var attFindInfoRsp = evtBpi.AttFindInfoRsp();
attFindInfoRsp.getHciEvtPacket(27, new Buffer([0x00, 0x00, 0x00, 0x15, 0x01, 0x3D, 0x00, 0xA9, 0xAA, 0x3E, 0x00, 0x01, 0x29, 0x3F, 0x00, 0x03, 0x28, 0x40, 0x00, 0xAA, 0xAA, 0x41, 0x00, 0x01, 0x29]), function (err, result) {
	console.log('/**********AttFindInfoRsp**********/');
	console.log(err);
	console.log(result);
});

var attFindByTypeValueReq = evtBpi.AttFindByTypeValueReq();
attFindByTypeValueReq.getHciEvtPacket(16, new Buffer([0x00, 0x00, 0x00, 0x0A, 0x01, 0x00, 0x02, 0x00, 0x03, 0x00, 0x04, 0x05, 0x06, 0x07]), function (err, result) {
	console.log('/**********AttFindByTypeValueReq**********/');
	console.log(err);
	console.log(result);
})

var attFindByTypeValueRsp = evtBpi.AttFindByTypeValueRsp();       attFindByTypeValueRsp.getHciEvtPacket(10, new Buffer([0x00, 0x01, 0x00, 0x04, 0x01, 0x00, 0x02, 0x00]), function(err, result) {console.log('/**********AttFindByTypeValueRsp**********/'); console.log(err); console.log(result);});
var attReadByTypeReq      = evtBpi.AttReadByTypeReq     ();       attReadByTypeReq     .getHciEvtPacket(12, new Buffer([0x00, 0x01, 0x00, 0x06, 0x01, 0x00, 0x1C, 0x00, 0x03, 0x01]), function(err, result) {console.log('/**********AttReadByTypeReq**********/'); console.log(err); console.log(result);});
var attReadByTypeRsp      = evtBpi.AttReadByTypeRsp     ();       attReadByTypeRsp     .getHciEvtPacket(9, new Buffer([0x00, 0x01, 0x00, 0x03, 0x02, 0x23, 0x03]), function(err, result) {console.log('/**********AttReadByTypeRsp**********/'); console.log(err); console.log(result);});
var attReadReq            = evtBpi.AttReadReq           ();       attReadReq           .getHciEvtPacket(8, new Buffer([0x00, 0x01, 0x00, 0x02, 0x01, 0x00]), function(err, result) {console.log('/**********AttReadReq**********/'); console.log(err); console.log(result);});
var attReadRsp            = evtBpi.AttReadRsp           ();       attReadRsp           .getHciEvtPacket(6, new Buffer([0x00, 0x01, 0x00, 0x00]), function(err, result) {console.log('/**********AttReadRsp**********/'); console.log(err); console.log(result);});
var attReadBlobReq        = evtBpi.AttReadBlobReq       ();       attReadBlobReq       .getHciEvtPacket(10, new Buffer([0x00, 0x01, 0x00, 0x04, 0x01, 0x00, 0x03, 0x01]), function(err, result) {console.log('/**********AttReadBlobReq**********/'); console.log(err); console.log(result);});
var attReadBlobRsp        = evtBpi.AttReadBlobRsp       ();       attReadBlobRsp       .getHciEvtPacket(8, new Buffer([0x00, 0x01, 0x00, 0x02, 0x03, 0x0A]), function(err, result) {console.log('/**********AttReadBlobRsp**********/'); console.log(err); console.log(result);});
var attReadMultiReq       = evtBpi.AttReadMultiReq      ();       attReadMultiReq      .getHciEvtPacket(10, new Buffer([0x00, 0x01, 0x00, 0x04, 0x0B, 0x05, 0x03, 0x0C]), function(err, result) {console.log('/**********AttReadMultiReq**********/'); console.log(err); console.log(result);});
var attReadMultiRsp       = evtBpi.AttReadMultiRsp      ();       attReadMultiRsp      .getHciEvtPacket(6, new Buffer([0x00, 0x01, 0x00, 0x00]), function(err, result) {console.log('/**********AttReadMultiRsp**********/'); console.log(err); console.log(result);});
var attReadByGrpTypeReq   = evtBpi.AttReadByGrpTypeReq  ();       attReadByGrpTypeReq  .getHciEvtPacket(26, new Buffer([0x00, 0x01, 0x00, 0x14, 0x01, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), function(err, result) {console.log('/**********AttReadByGrpTypeReq**********/'); console.log(err); console.log(result);});
var attReadByGrpTypeRsp   = evtBpi.AttReadByGrpTypeRsp  ();       attReadByGrpTypeRsp  .getHciEvtPacket(9, new Buffer([0x00, 0x01, 0x00, 0x03, 0x02, 0x0C, 0x00]), function(err, result) {console.log('/**********AttReadByGrpTypeRsp**********/'); console.log(err); console.log(result);});
var attWriteReq           = evtBpi.AttWriteReq          ();       attWriteReq          .getHciEvtPacket(11, new Buffer([0x00, 0x01, 0x00, 0x05, 0x00, 0x00, 0x03, 0x00, 0x05, 0x08]), function(err, result) {console.log('/**********AttWriteReq**********/'); console.log(err); console.log(result);});
var attWriteRsp           = evtBpi.AttWriteRsp          ();       attWriteRsp          .getHciEvtPacket(6, new Buffer([0x00, 0x01, 0x00, 0x00]), function(err, result) {console.log('/**********AttWriteRsp**********/'); console.log(err); console.log(result);});
var attPrepareWriteReq    = evtBpi.AttPrepareWriteReq   ();       attPrepareWriteReq   .getHciEvtPacket(12, new Buffer([0x00, 0x01, 0x00, 0x06, 0x03, 0x00, 0x03, 0x00, 0x03, 0x00]), function(err, result) {console.log('/**********AttPrepareWriteReq**********/'); console.log(err); console.log(result);});
var attPrepareWriteRsp    = evtBpi.AttPrepareWriteRsp   ();       attPrepareWriteRsp   .getHciEvtPacket(12, new Buffer([0x00, 0x01, 0x00, 0x06, 0x01, 0x00, 0x01, 0x00, 0x01, 0x00]), function(err, result) {console.log('/**********AttPrepareWriteRsp**********/'); console.log(err); console.log(result);});
var attExecuteWriteReq    = evtBpi.AttExecuteWriteReq   ();       attExecuteWriteReq   .getHciEvtPacket(7, new Buffer([0x00, 0x01, 0x00, 0x01, 0x01]), function(err, result) {console.log('/**********AttExecuteWriteReq**********/'); console.log(err); console.log(result);});
var attExecuteWriteRsp    = evtBpi.AttExecuteWriteRsp   ();       attExecuteWriteRsp   .getHciEvtPacket(6, new Buffer([0x00, 0x01, 0x00, 0x00]), function(err, result) {console.log('/**********AttExecuteWriteRsp**********/'); console.log(err); console.log(result);});
var attHandleValueNoti    = evtBpi.AttHandleValueNoti   ();       attHandleValueNoti   .getHciEvtPacket(11, new Buffer([0x00, 0x01, 0x00, 0x05, 0x00, 0x09, 0x00, 0x03, 0x00]), function(err, result) {console.log('/**********AtthandleValueNoti**********/'); console.log(err); console.log(result);});
var attHandleValueInd     = evtBpi.AttHandleValueInd    ();       attHandleValueInd    .getHciEvtPacket(11, new Buffer([0x00, 0x01, 0x00, 0x05, 0x00, 0x09, 0x00, 0x03, 0x00]), function(err, result) {console.log('/**********AtthandleValueInd**********/'); console.log(err); console.log(result);});
var attHandleValueCfm     = evtBpi.AttHandleValueCfm    ();       attHandleValueCfm    .getHciEvtPacket(6, new Buffer([0x00, 0x01, 0x00, 0x00]), function(err, result) {console.log('/**********AtthandleValueCfm**********/'); console.log(err); console.log(result);});


/*************************************************************************************************/
/*** Test GAP Events HCI APIs                                                                  ***/
/*************************************************************************************************/
var gapDeviceInitDone         = evtBpi.GapDeviceInitDone        ();     gapDeviceInitDone        .getHciEvtPacket(44, new Buffer([0x00, 0xCA, 0x01, 0x81, 0x20, 0x0A, 0xD0, 0x01, 0x00, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), function(err, result) {console.log('/**********GapDeviceInitDone**********/'); console.log(err); console.log(result);});

var gapDeviceDiscovery = evtBpi.GapDeviceDiscovery();
gapDeviceDiscovery.getHciEvtPacket(12, new Buffer([0x00, 0x01, 0x00, 0x00, 0x7F, 0x73, 0x70, 0xE5, 0xC5, 0x78]), function (err, result) {
	console.log('/**********GapDeviceDiscovery**********/');
	console.log(err);
	console.log(result);
});

var gapAdvDataUpdateDone      = evtBpi.GapAdvDataUpdateDone     ();     gapAdvDataUpdateDone     .getHciEvtPacket(4, new Buffer([0x00, 0x00]), function(err, result) {console.log('/**********GapAdvDataUpdateDone**********/'); console.log(err); console.log(result);});
var gapMakeDiscoverableDone   = evtBpi.GapMakeDiscoverableDone  ();     gapMakeDiscoverableDone  .getHciEvtPacket(5, new Buffer([0x00, 0x00, 0xC0]), function(err, result) {console.log('/**********GapMakeDiscoverableDone**********/'); console.log(err); console.log(result);});
var gapEndDiscoverableDone    = evtBpi.GapEndDiscoverableDone   ();     gapEndDiscoverableDone   .getHciEvtPacket(3, new Buffer([0x00]), function(err, result) {console.log('/**********GapEndDiscoverableDone**********/'); console.log(err); console.log(result);});
var gapLinkEstablished        = evtBpi.GapLinkEstablished       ();     gapLinkEstablished       .getHciEvtPacket(19, new Buffer([0x00, 0x02, 0x03, 0x00, 0x00, 0xCA, 0x01, 0x80, 0x01, 0x00, 0x00, 0xC0, 0x50, 0x00, 0x00, 0x0A, 0x05]), function(err, result) {console.log('/**********GapLinkEstablished**********/'); console.log(err); console.log(result);});
var gapLinkTerminated         = evtBpi.GapLinkTerminated        ();     gapLinkTerminated        .getHciEvtPacket(6, new Buffer([0x00, 0x01, 0x00, 0x16]), function(err, result) {console.log('/**********GapLinkTerminated**********/'); console.log(err); console.log(result);});
var gapLinkParamUpdate        = evtBpi.GapLinkParamUpdate       ();     gapLinkParamUpdate       .getHciEvtPacket(11, new Buffer([0x00, 0x01, 0x00, 0xC0, 0x00, 0xB0, 0x00, 0x0A, 0x00]), function(err, result) {console.log('/**********GapLinkParamUpdate**********/'); console.log(err); console.log(result);});
var gapRandomAddrChanged      = evtBpi.GapRandomAddrChanged     ();     gapRandomAddrChanged     .getHciEvtPacket(10, new Buffer([0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), function(err, result) {console.log('/**********GapRandomaddrChanged**********/'); console.log(err); console.log(result);});
var gapSignatureUpdated       = evtBpi.GapSignatureUpdated      ();     gapSignatureUpdated      .getHciEvtPacket(14, new Buffer([0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x56, 0x34, 0x12]), function(err, result) {console.log('/**********GapSignatureUpdated**********/'); console.log(err); console.log(result);});
var gapAuthenticationComplete = evtBpi.GapAuthenticationComplete();     gapAuthenticationComplete.getHciEvtPacket(106, new Buffer([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), function(err, result) {console.log('/**********GapAuthenticationComplete**********/'); console.log(err); console.log(result);});
var gapPasskeyNeeded          = evtBpi.GapPasskeyNeeded         ();     gapPasskeyNeeded         .getHciEvtPacket(13, new Buffer([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00]), function(err, result) {console.log('/**********GapPasskeyNeeded**********/'); console.log(err); console.log(result);});
var gapSlaveRequestedSecurity = evtBpi.GapSlaveRequestedSecurity();     gapSlaveRequestedSecurity.getHciEvtPacket(12, new Buffer([0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02]), function(err, result) {console.log('/**********GapSlaveRequestedSecurity**********/'); console.log(err); console.log(result);});

var gapDeviceInfo = evtBpi.GapDeviceInfo();
gapDeviceInfo.getHciEvtPacket(17, new Buffer([0x00, 0x01, 0x00, 0x7F, 0x73, 0x70, 0xE5, 0xC5, 0x78, 0x01, 0x04, 0x11, 0x022, 0x33, 0x44]), function (err, result) {
	console.log('/**********GapDeviceInfo**********/');
	console.log(err);
	console.log(result);
})

var gapBondComplete           = evtBpi.GapBondComplete          ();     gapBondComplete          .getHciEvtPacket(5, new Buffer([0x00, 0x01, 0x00]), function(err, result) {console.log('/**********GapBondComplete**********/'); console.log(err); console.log(result);});
var gapPairingReq             = evtBpi.GapPairingReq            ();     gapPairingReq            .getHciEvtPacket(10, new Buffer([0x00, 0x01, 0x00, 0x01, 0x00, 0x02, 0x0C, 0x03]), function(err, result) {console.log('/**********GapPairingReq**********/'); console.log(err); console.log(result);});

var gapCmdStatus = evtBpi.GapCmdStatus();
gapCmdStatus.getHciEvtPacket(6, new Buffer([0x02, 0x37, 0xFE, 0x02, 0x11, 0x22]), function (err, result) {
	console.log('/**********GapCmdStatus**********/');
	console.log(err);
	console.log(result);
});

/*************************************************************************************************/
/*** Test L2CAP Events HCI APIs                                                                ***/
/*************************************************************************************************/
var l2capCmdReject = evtBpi.L2capCmdReject();     l2capCmdReject.getHciEvtPacket(7, new Buffer([0x00, 0x01, 0x00, 0x00, 0x00]), function(err, result){console.log('/**********L2capCmdReject**********/'); console.log(err); console.log(result);});
var l2capParamUpdateRsp = evtBpi.L2capParamUpdateRsp();     l2capParamUpdateRsp.getHciEvtPacket(7, new Buffer([0x00, 0x01, 0x00, 0x00, 0x00]), function(err, result){console.log('/**********L2capParamUpdateRsp**********/'); console.log(err); console.log(result);});

/*************************************************************************************************/
/*** Test GATT Events HCI APIs                                                                 ***/
/*************************************************************************************************/
var gattClientCharCfgUpdate = evtBpi.GattClientCharCfgUpdate();     gattClientCharCfgUpdate.getHciEvtPacket(10, new Buffer([0x00, 0x01, 0x00, 0x02, 0x01, 0x00, 0x00, 0x00]), function(err, result){console.log('/**********GattClientCharCfgUpdate**********/'); console.log(err); console.log(result);});
