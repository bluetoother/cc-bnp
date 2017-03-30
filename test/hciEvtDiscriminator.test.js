var evtBpi = require('../lib/hci/hciEvtDiscriminator');

/*************************************************************************************************/
/*** Test HCI Events HCI APIs                                                                  ***/
/*************************************************************************************************/
describe('hciCmdBuilder Functional check', function () {
    it('hciSetRxGain check', function (done) {
        var hciSetRxGain = evtBpi.HciSetRxGain();
        hciSetRxGain.getHciEvtPacket(5, new Buffer([0x00, 0x00, 0xFC]), function (err, result) {
            if (result) done();
        });
    });
    it('hciSetTxPower check', function (done) {
        var hciSetTxPower                = evtBpi.HciSetTxPower();                  hciSetTxPower               .getHciEvtPacket(5, new Buffer([0x00, 0x01, 0xFC]), function (err, result) {if (result) done();});
    });
    it('hciOnePktPerEvt check', function (done) {
        var hciOnePktPerEvt              = evtBpi.HciOnePktPerEvt();                hciOnePktPerEvt             .getHciEvtPacket(5, new Buffer([0x00, 0x02, 0xFC]), function (err, result) {if (result) done();});
    });
    it('hciClkDivideOnhalt check', function (done) {
        var hciClkDivideOnhalt           = evtBpi.HciClkDivideOnHalt();             hciClkDivideOnhalt          .getHciEvtPacket(5, new Buffer([0x00, 0x03, 0xFC]), function (err, result) {if (result) done();});
    });
    it('hciDeclareNvUsage check', function (done) {
        var hciDeclareNvUsage            = evtBpi.HciDeclareNvUsage();              hciDeclareNvUsage           .getHciEvtPacket(5, new Buffer([0x00, 0x04, 0xFC]), function (err, result) {if (result) done();});
    });
    it('hciDecrypt check', function (done) {
        var hciDecrypt                   = evtBpi.HciDecrypt();                     hciDecrypt.getHciEvtPacket(21, new Buffer([0x00, 0x05, 0xFC, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01]), function (err, result) {if (result) done();});
    });
    it('hciSetLocalSupportedFeatures check', function (done) {
        var hciSetLocalSupportedFeatures = evtBpi.HciSetLocalSupportedFeatures();   hciSetLocalSupportedFeatures.getHciEvtPacket(5, new Buffer([0x00, 0x06, 0xFC]), function (err, result) {if (result) done();});
    });
    it('hciSetFastTxRespTime check', function (done) {
        var hciSetFastTxRespTime         = evtBpi.HciSetFastTxRespTime();           hciSetFastTxRespTime        .getHciEvtPacket(5, new Buffer([0x00, 0x07, 0xFC]), function (err, result) {if (result) done();});
    });
    it('hciModemTestTx check', function (done) {
        var hciModemTestTx               = evtBpi.HciModemTestTx();                 hciModemTestTx              .getHciEvtPacket(5, new Buffer([0x00, 0x08, 0xFC]), function (err, result) {if (result) done();});
    });
    it('hciModemhopTestTx check', function (done) {
        var hciModemhopTestTx            = evtBpi.HciModemHopTestTx();              hciModemhopTestTx           .getHciEvtPacket(5, new Buffer([0x00, 0x09, 0xFC]), function (err, result) {if (result) done();});
    });
    it('hciModemTestRx check', function (done) {
        var hciModemTestRx               = evtBpi.HciModemTestRx();                 hciModemTestRx              .getHciEvtPacket(5, new Buffer([0x00, 0x0A, 0xFC]), function (err, result) {if (result) done();});
    });
    it('hciEndModemTest check', function (done) {
        var hciEndModemTest              = evtBpi.HciEndModemTest();                hciEndModemTest             .getHciEvtPacket(5, new Buffer([0x00, 0x0B, 0xFC]), function (err, result) {if (result) done();});
    });
    it('hciSetBdaddr check', function (done) {
        var hciSetBdaddr                 = evtBpi.HciSetBdaddr();                   hciSetBdaddr                .getHciEvtPacket(5, new Buffer([0x00, 0x0C, 0xFC]), function (err, result) {if (result) done();});
    });
    it('hciSetSca check', function (done) {
        var hciSetSca                    = evtBpi.HciSetSca();                      hciSetSca                   .getHciEvtPacket(5, new Buffer([0x00, 0x0D, 0xFC]), function (err, result) {if (result) done();});
    });
    it('hciSetFreqTune check', function (done) {
        var hciSetFreqTune               = evtBpi.HciSetFreqTune();                 hciSetFreqTune              .getHciEvtPacket(5, new Buffer([0x00, 0x0F, 0xFC]), function (err, result) {if (result) done();});
    });
    it('hciSaveFreqTune check', function (done) {
        var hciSaveFreqTune              = evtBpi.HciSaveFreqTune();                hciSaveFreqTune             .getHciEvtPacket(5, new Buffer([0x00, 0x10, 0xFC]), function (err, result) {if (result) done();});
    });
    it('hciSetMaxDtmTxPower check', function (done) {
        var hciSetMaxDtmTxPower          = evtBpi.HciSetMaxDtmTxPower();            hciSetMaxDtmTxPower         .getHciEvtPacket(5, new Buffer([0x00, 0x11, 0xFC]), function (err, result) {if (result) done();});
    });
    it('hciMapPmIoPort check', function (done) {
        var hciMapPmIoPort               = evtBpi.HciMapPmIoPort();                 hciMapPmIoPort              .getHciEvtPacket(5, new Buffer([0x00, 0x12, 0xFC]), function (err, result) {if (result) done();});
    });
    it('hciDisconnectImmed check', function (done) {
        var hciDisconnectImmed           = evtBpi.HciDisconnectImmed();             hciDisconnectImmed          .getHciEvtPacket(5, new Buffer([0x00, 0x13, 0xFC]), function (err, result) {if (result) done();});
    });
    it('hciPer check', function (done) {
        var hciPer = evtBpi.HciPer();
        hciPer.getHciEvtPacket(14, new Buffer([0x00, 0x14, 0xFC, 0x01, 0x47, 0x00, 0x00, 0x00, 0x47, 0x00, 0x00, 0x00]), function (err, result) {
            if (result) done();
        });
    });
    it('hciPer check', function (done) {
        var hciPer = evtBpi.HciPer();
        hciPer.getHciEvtPacket(6, new Buffer([0x00, 0x14, 0xFC, 0x00]), function (err, result) {
            if (result) done();
        });

    });
    it('hciPerByChan check', function (done) {
        var hciPerByChan             = evtBpi.HciPerByChan();               hciPerByChan            .getHciEvtPacket(5, new Buffer([0x00, 0x15, 0xFC]), function (err, result) {if (result) done();});
    });
    it('hciExtendRfRange check', function (done) {
        var hciExtendRfRange         = evtBpi.HciExtendRfRange();           hciExtendRfRange        .getHciEvtPacket(5, new Buffer([0x00, 0x16, 0xFC]), function (err, result) {if (result) done();});
    });
    it('hcihaltDuringRf check', function (done) {
        var hcihaltDuringRf          = evtBpi.HciHaltDuringRf();            hcihaltDuringRf         .getHciEvtPacket(5, new Buffer([0x00, 0x19, 0xFC]), function (err, result) {if (result) done();});
    });
    it('hciOverrideSl check', function (done) {
        var hciOverrideSl            = evtBpi.HciOverrideSl();              hciOverrideSl           .getHciEvtPacket(5, new Buffer([0x00, 0x1A, 0xFC]), function (err, result) {if (result) done();});
    });
    it('hciBuildRevision check', function (done) {
        var hciBuildRevision         = evtBpi.HciBuildRevision();           hciBuildRevision        .getHciEvtPacket(9, new Buffer([0x00, 0x1B, 0xFC, 0x01, 0x00, 0x01, 0x00 ]), function (err, result) {if (result) done();});
    });
    it('hciDelaySleep check', function (done) {
        var hciDelaySleep            = evtBpi.HciDelaySleep();              hciDelaySleep           .getHciEvtPacket(5, new Buffer([0x00, 0x1C, 0xFC]), function (err, result) {if (result) done();});
    });
    it('hciResetSystem check', function (done) {
        var hciResetSystem           = evtBpi.HciResetSystem();             hciResetSystem          .getHciEvtPacket(5, new Buffer([0x00, 0x1D, 0xFC]), function (err, result) {if (result) done();});
    });
    it('hciOverlappedProcessing check', function (done) {
        var hciOverlappedProcessing  = evtBpi.HciOverlappedProcessing();    hciOverlappedProcessing .getHciEvtPacket(5, new Buffer([0x00, 0x1E, 0xFC]), function (err, result) {if (result) done();});
    });
    it('hciNumCompletedPktsLimit check', function (done) {
        var hciNumCompletedPktsLimit = evtBpi.HciNumCompletedPktsLimit();   hciNumCompletedPktsLimit.getHciEvtPacket(5, new Buffer([0x00, 0x1F, 0xFC]), function (err, result) {if (result) done();});
    });

/*************************************************************************************************/
/*** Test ATT Events HCI APIs                                                                  ***/
/*************************************************************************************************/
    it('attErrorRsp check', function (done) {
        var attErrorRsp           = evtBpi.AttErrorRsp          ();       attErrorRsp          .getHciEvtPacket(10, new Buffer([0x00, 0x01, 0x00, 0x04, 0x09, 0x01, 0x00, 0x11]), function(err, result) {if (result) done();});
    });
    it('attExchangeMtuReq check', function (done) {
        var attExchangeMtuReq     = evtBpi.AttExchangeMtuReq    ();       attExchangeMtuReq    .getHciEvtPacket(8, new Buffer([0x00, 0x01, 0x00, 0x02, 0x18, 0x02]), function(err, result) {if (result) done();});
    });
    it('attExchangeMtuRsp check', function (done) {
        var attExchangeMtuRsp     = evtBpi.AttExchangeMtuRsp    ();       attExchangeMtuRsp    .getHciEvtPacket(8, new Buffer([0x00, 0x01, 0x00, 0x02, 0x18, 0x01]), function(err, result) {if (result) done();});
    });
    it('attFindInfoReq check', function (done) {
        var attFindInfoReq        = evtBpi.AttFindInfoReq       ();       attFindInfoReq       .getHciEvtPacket(10, new Buffer([0x00, 0x01, 0x00, 0x04, 0x01, 0x00, 0x1C, 0x00]), function(err, result) {if (result) done();});
    });
    it('attFindInfoRsp check', function (done) {
        var attFindInfoRsp = evtBpi.AttFindInfoRsp();
        attFindInfoRsp.getHciEvtPacket(27, new Buffer([0x00, 0x00, 0x00, 0x15, 0x01, 0x3D, 0x00, 0xA9, 0xAA, 0x3E, 0x00, 0x01, 0x29, 0x3F, 0x00, 0x03, 0x28, 0x40, 0x00, 0xAA, 0xAA, 0x41, 0x00, 0x01, 0x29]), function (err, result) {
            if (result) done();
        });
    });
    it('attFindByTypeValueReq check', function (done) {
        var attFindByTypeValueReq = evtBpi.AttFindByTypeValueReq();
        attFindByTypeValueReq.getHciEvtPacket(16, new Buffer([0x00, 0x00, 0x00, 0x0A, 0x01, 0x00, 0x02, 0x00, 0x03, 0x00, 0x04, 0x05, 0x06, 0x07]), function (err, result) {
            if (result) done();
        });
    });
    it('attFindByTypeValueRsp check', function (done) {
        var attFindByTypeValueRsp = evtBpi.AttFindByTypeValueRsp();       attFindByTypeValueRsp.getHciEvtPacket(10, new Buffer([0x00, 0x01, 0x00, 0x04, 0x01, 0x00, 0x02, 0x00]), function(err, result) {if (result) done();});
    });
    it('attReadByTypeReq check', function (done) {
        var attReadByTypeReq      = evtBpi.AttReadByTypeReq     ();       attReadByTypeReq     .getHciEvtPacket(12, new Buffer([0x00, 0x01, 0x00, 0x06, 0x01, 0x00, 0x1C, 0x00, 0x03, 0x01]), function(err, result) {if (result) done();});
    });
    it('attReadByTypeRsp check', function (done) {
        var attReadByTypeRsp      = evtBpi.AttReadByTypeRsp     ();       attReadByTypeRsp     .getHciEvtPacket(9, new Buffer([0x00, 0x01, 0x00, 0x03, 0x02, 0x23, 0x03]), function(err, result) {if (result) done();});
    });
    it('attReadReq check', function (done) {
        var attReadReq            = evtBpi.AttReadReq           ();       attReadReq           .getHciEvtPacket(8, new Buffer([0x00, 0x01, 0x00, 0x02, 0x01, 0x00]), function(err, result) {if (result) done();});
    });
    it('attReadRsp check', function (done) {
        var attReadRsp            = evtBpi.AttReadRsp           ();       attReadRsp           .getHciEvtPacket(6, new Buffer([0x00, 0x01, 0x00, 0x00]), function(err, result) {if (result) done();});
    });
    it('attReadBlobReq check', function (done) {
        var attReadBlobReq        = evtBpi.AttReadBlobReq       ();       attReadBlobReq       .getHciEvtPacket(10, new Buffer([0x00, 0x01, 0x00, 0x04, 0x01, 0x00, 0x03, 0x01]), function(err, result) {if (result) done();});
    });
    it('attReadBlobRsp check', function (done) {
        var attReadBlobRsp        = evtBpi.AttReadBlobRsp       ();       attReadBlobRsp       .getHciEvtPacket(8, new Buffer([0x00, 0x01, 0x00, 0x02, 0x03, 0x0A]), function(err, result) {if (result) done();});
    });
    it('attReadMultiReq check', function (done) {
        var attReadMultiReq       = evtBpi.AttReadMultiReq      ();       attReadMultiReq      .getHciEvtPacket(10, new Buffer([0x00, 0x01, 0x00, 0x04, 0x0B, 0x05, 0x03, 0x0C]), function(err, result) {if (result) done();});
    });
    it('attReadMultiRsp check', function (done) {
        var attReadMultiRsp       = evtBpi.AttReadMultiRsp      ();       attReadMultiRsp      .getHciEvtPacket(6, new Buffer([0x00, 0x01, 0x00, 0x00]), function(err, result) {if (result) done();});
    });
    it('attReadByGrpTypeReq check', function (done) {
        var attReadByGrpTypeReq   = evtBpi.AttReadByGrpTypeReq  ();       attReadByGrpTypeReq  .getHciEvtPacket(26, new Buffer([0x00, 0x01, 0x00, 0x14, 0x01, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), function(err, result) {if (result) done();});
    });
    it('attReadByGrpTypeRsp check', function (done) {
        var attReadByGrpTypeRsp   = evtBpi.AttReadByGrpTypeRsp  ();       attReadByGrpTypeRsp  .getHciEvtPacket(12, new Buffer([0x00, 0x01, 0x00, 0x03, 0x05, 0x0C, 0x00, 0x00, 0x00, 0x00]), function(err, result) {if (result) done();});
    });
    it('attWriteReq check', function (done) {
        var attWriteReq           = evtBpi.AttWriteReq          ();       attWriteReq          .getHciEvtPacket(11, new Buffer([0x00, 0x01, 0x00, 0x05, 0x00, 0x00, 0x03, 0x00, 0x05, 0x08]), function(err, result) {if (result) done();});
    });
    it('attWriteRsp check', function (done) {
        var attWriteRsp           = evtBpi.AttWriteRsp          ();       attWriteRsp          .getHciEvtPacket(6, new Buffer([0x00, 0x01, 0x00, 0x00]), function(err, result) {if (result) done();});
    });
    it('attPrepareWriteReq check', function (done) {
        var attPrepareWriteReq    = evtBpi.AttPrepareWriteReq   ();       attPrepareWriteReq   .getHciEvtPacket(12, new Buffer([0x00, 0x01, 0x00, 0x06, 0x03, 0x00, 0x03, 0x00, 0x03, 0x00]), function(err, result) {if (result) done();});
    });
    it('attPrepareWriteRsp check', function (done) {
        var attPrepareWriteRsp    = evtBpi.AttPrepareWriteRsp   ();       attPrepareWriteRsp   .getHciEvtPacket(12, new Buffer([0x00, 0x01, 0x00, 0x06, 0x01, 0x00, 0x01, 0x00, 0x01, 0x00]), function(err, result) {if (result) done();});
    });
    it('attExecuteWriteReq check', function (done) {
        var attExecuteWriteReq    = evtBpi.AttExecuteWriteReq   ();       attExecuteWriteReq   .getHciEvtPacket(7, new Buffer([0x00, 0x01, 0x00, 0x01, 0x01]), function(err, result) {if (result) done();});
    });
    it('attExecuteWriteRsp check', function (done) {
        var attExecuteWriteRsp    = evtBpi.AttExecuteWriteRsp   ();       attExecuteWriteRsp   .getHciEvtPacket(6, new Buffer([0x00, 0x01, 0x00, 0x00]), function(err, result) {if (result) done();});
    });
    it('attHandleValueNoti check', function (done) {
        var attHandleValueNoti    = evtBpi.AttHandleValueNoti   ();       attHandleValueNoti   .getHciEvtPacket(11, new Buffer([0x00, 0x01, 0x00, 0x05, 0x00, 0x09, 0x00, 0x03, 0x00]), function(err, result) {if (result) done();});
    });
    it('attHandleValueInd check', function (done) {
        var attHandleValueInd     = evtBpi.AttHandleValueInd    ();       attHandleValueInd    .getHciEvtPacket(11, new Buffer([0x00, 0x01, 0x00, 0x05, 0x00, 0x09, 0x00, 0x03, 0x00]), function(err, result) {if (result) done();});
    });
    it('attHandleValueCfm check', function (done) {
        var attHandleValueCfm     = evtBpi.AttHandleValueCfm    ();       attHandleValueCfm    .getHciEvtPacket(6, new Buffer([0x00, 0x01, 0x00, 0x00]), function(err, result) {if (result) done();});
    });


/*************************************************************************************************/
/*** Test GAP Events HCI APIs                                                                  ***/
/*************************************************************************************************/
    it('gapDeviceInitDone check', function (done) {
        var gapDeviceInitDone         = evtBpi.GapDeviceInitDone        ();     gapDeviceInitDone        .getHciEvtPacket(44, new Buffer([0x00, 0xCA, 0x01, 0x81, 0x20, 0x0A, 0xD0, 0x01, 0x00, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), function(err, result) {if (result) done();});
    });
    it('gapDeviceDiscovery check', function (done) {
        var gapDeviceDiscovery = evtBpi.GapDeviceDiscovery();
        gapDeviceDiscovery.getHciEvtPacket(12, new Buffer([0x00, 0x01, 0x00, 0x00, 0x7F, 0x73, 0x70, 0xE5, 0xC5, 0x78]), function (err, result) {
            if (result) done();
        });
    });
    it('gapAdvDataUpdateDone check', function (done) {
        var gapAdvDataUpdateDone      = evtBpi.GapAdvDataUpdateDone     ();     gapAdvDataUpdateDone     .getHciEvtPacket(4, new Buffer([0x00, 0x00]), function(err, result) {if (result) done();});
    });
    it('gapMakeDiscoverableDone check', function (done) {
        var gapMakeDiscoverableDone   = evtBpi.GapMakeDiscoverableDone  ();     gapMakeDiscoverableDone  .getHciEvtPacket(5, new Buffer([0x00, 0x00, 0xC0]), function(err, result) {if (result) done();});
    });
    it('gapEndDiscoverableDone check', function (done) {
        var gapEndDiscoverableDone    = evtBpi.GapEndDiscoverableDone   ();     gapEndDiscoverableDone   .getHciEvtPacket(3, new Buffer([0x00]), function(err, result) {if (result) done();});
    });
    it('gapLinkEstablished check', function (done) {
        var gapLinkEstablished        = evtBpi.GapLinkEstablished       ();     gapLinkEstablished       .getHciEvtPacket(20, new Buffer([0x00, 0x02, 0x03, 0x00, 0x00, 0xCA, 0x01, 0x80, 0x01, 0x00, 0x00, 0x00, 0xC0, 0x50, 0x00, 0x00, 0x0A, 0x05]), function(err, result) {if (result) done();});
    });
    it('gapLinkTerminated check', function (done) {
        var gapLinkTerminated         = evtBpi.GapLinkTerminated        ();     gapLinkTerminated        .getHciEvtPacket(6, new Buffer([0x00, 0x01, 0x00, 0x16]), function(err, result) {if (result) done();});
    });
    it('gapLinkParamUpdate check', function (done) {
        var gapLinkParamUpdate        = evtBpi.GapLinkParamUpdate       ();     gapLinkParamUpdate       .getHciEvtPacket(11, new Buffer([0x00, 0x01, 0x00, 0xC0, 0x00, 0xB0, 0x00, 0x0A, 0x00]), function(err, result) {if (result) done();});
    });
    it('gapRandomAddrChanged check', function (done) {
        var gapRandomAddrChanged      = evtBpi.GapRandomAddrChanged     ();     gapRandomAddrChanged     .getHciEvtPacket(10, new Buffer([0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), function(err, result) {if (result) done();});
    });
    it('gapSignatureUpdated check', function (done) {
        var gapSignatureUpdated       = evtBpi.GapSignatureUpdated      ();     gapSignatureUpdated      .getHciEvtPacket(14, new Buffer([0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x56, 0x34, 0x12]), function(err, result) {if (result) done();});
    });
    it('gapAuthenticationComplete check', function (done) {
        var gapAuthenticationComplete = evtBpi.GapAuthenticationComplete();     gapAuthenticationComplete.getHciEvtPacket(106, new Buffer([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), function(err, result) {if (result) done();});
    });
    it('gapPasskeyNeeded check', function (done) {
        var gapPasskeyNeeded          = evtBpi.GapPasskeyNeeded         ();     gapPasskeyNeeded         .getHciEvtPacket(13, new Buffer([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00]), function(err, result) {if (result) done();});
    });
    it('gapSlaveRequestedSecurity check', function (done) {
        var gapSlaveRequestedSecurity = evtBpi.GapSlaveRequestedSecurity();     gapSlaveRequestedSecurity.getHciEvtPacket(12, new Buffer([0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02]), function(err, result) {if (result) done();});
    });
    it('gapDeviceInfo check', function (done) {
        var gapDeviceInfo = evtBpi.GapDeviceInfo();
        gapDeviceInfo.getHciEvtPacket(17, new Buffer([0x00, 0x01, 0x00, 0x7F, 0x73, 0x70, 0xE5, 0xC5, 0x78, 0x01, 0x04, 0x11, 0x022, 0x33, 0x44]), function (err, result) {
            if (result) done();
        });

    });
    it('gapBondComplete check', function (done) {
        var gapBondComplete           = evtBpi.GapBondComplete          ();     gapBondComplete          .getHciEvtPacket(5, new Buffer([0x00, 0x01, 0x00]), function(err, result) {if (result) done();});
    });
    it('gapPairingReq check', function (done) {
        var gapPairingReq             = evtBpi.GapPairingReq            ();     gapPairingReq            .getHciEvtPacket(10, new Buffer([0x00, 0x01, 0x00, 0x01, 0x00, 0x02, 0x0C, 0x03]), function(err, result) {if (result) done();});

    });
    it('gapCmdStatus check', function (done) {
        var gapCmdStatus = evtBpi.GapCmdStatus();
        gapCmdStatus.getHciEvtPacket(6, new Buffer([0x02, 0x37, 0xFE, 0x02, 0x11, 0x22]), function (err, result) {
            if (result) done();
        });
    });

/*************************************************************************************************/
/*** Test L2CAP Events HCI APIs                                                                ***/
/*************************************************************************************************/
    it('l2capCmdReject check', function (done) {
        var l2capCmdReject = evtBpi.L2capCmdReject();     l2capCmdReject.getHciEvtPacket(7, new Buffer([0x00, 0x01, 0x00, 0x00, 0x00]), function(err, result){if (result) done();});
    });
    it('l2capParamUpdateRsp check', function (done) {
        var l2capParamUpdateRsp = evtBpi.L2capParamUpdateRsp();     l2capParamUpdateRsp.getHciEvtPacket(7, new Buffer([0x00, 0x01, 0x00, 0x00, 0x00]), function(err, result){if (result) done();});
    });

/*************************************************************************************************/
/*** Test GATT Events HCI APIs                                                                 ***/
/*************************************************************************************************/
    it('gattClientCharCfgUpdate check', function (done) {
        var gattClientCharCfgUpdate = evtBpi.GattClientCharCfgUpdate();     gattClientCharCfgUpdate.getHciEvtPacket(10, new Buffer([0x00, 0x01, 0x00, 0x02, 0x01, 0x00, 0x00, 0x00]), function(err, result){if (result) done();});
    });
});