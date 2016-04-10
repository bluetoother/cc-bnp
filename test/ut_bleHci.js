var _ = require('lodash'),
    Q = require('q'),
    should = require('should'),
    Chance = require('chance'),
    chance = new Chance(),
    util = require('util'),
    EventEmitter = require('events').EventEmitter,
    SerialPort = require('serialport').SerialPort;

var bleHci = require('../lib/hci/bleHci'),
    hciCmdBuilder = require('../lib/hci/hciCmdBuilder');
    BHCI = require('../lib/defs/blehcidefs');

var sp = new SerialPort("/dev/ttyACM0", {
    baudrate: 115200,
    rtscts: true,
    flowControl: true
}, false);

bleHci.registerSp(sp);

bleHci.openSp();



describe('Testing Command Response From Local Controller', function () {
    var gapCmdNameArr = ['PasskeyUpdate', 'SlaveSecurityReqUpdate', 'Signable', 'SetParam', 'GetParam', 
                         'ResolvePrivateAddr', 'SetAdvToken', 'RemoveAdvToken', 'UpdateAdvTokens', 'BondSetParam', 'BondGetParam'],
        attCmdNameArr = ['ErrorRsp', 'ExchangeMtuRsp', 'FindInfoRsp', 'FindByTypeValueRsp', 'ReadByTypeRsp', 
                         'ReadRsp', 'ReadBlobRsp', 'ReadMultiRsp', 'ReadByGrpTypeRsp', 'WriteRsp'],
        gattCmdNameArr = ['WriteNoRsp', 'SignedWriteNoRsp'],
        attFindInfoRspObj = {
            handle0: 1,
            uuid0: '0x2a11',
            handle1: 2,
            uuid1: '0x2a22',
            handle2: 3,
            uuid2: '0x2a33'
        },
        attFindByTypeValueRspObj = {
            attrHandle0: 0x0102,
            grpEndHandle0: 0x0304,
            attrHandle1: 0x0506,
            grpEndHandle1: 0x0708
        },
        attReadByTypeRspObj = {
            attrHandle0: 0x0102,
            attrVal0: new Buffer([0x01, 0x02]),
            attrHandle1: 0x0506,
            attrVal1: new Buffer([0x01, 0x02])
        },
        attReadByGrpTypeRspObj = {
            attrHandle0: 0x0102, 
            endGroupHandle0: 0x010C, 
            attrVal0: new Buffer([0x01, 0x02]),
            attrHandle1: 0x0300, 
            endGroupHandle1: 0x030A, 
            attrVal1: new Buffer([0x01, 0x02])
        },
        attObj = {
            AttFindInfoRsp: {connHandle: 100, format:1, info: attFindInfoRspObj}, 
            AttFindByTypeValueRsp: {connHandle: 100, handlesInfo: attFindByTypeValueRspObj},
            AttReadByTypeRsp: {connHandle: 100, length: 4, data: attReadByTypeRspObj}, 
            AttReadByGrpTypeRsp: {connHandle: 100, length: 6, data: attReadByGrpTypeRspObj} 
        };
    this.timeout(10000);

    _.forEach(BHCI.SubGroupCmd.Hci._enumMap, function (val, key) {
        it('Hci Level: ' + key, function () {
            var argObj = genCmdArgObj('Hci', key);
            if (key === 'DisconnectImmed' || key === 'ResetSystem') { return; }
            return bleHci.execCmd('Hci', key, argObj).should.be.fulfilled();
        });
    });

    _.forEach(BHCI.SubGroupCmd.Util._enumMap, function (val, key) {
        it('Util Level: ' + key, function () {
            var argObj = genCmdArgObj('Util', key);
            return bleHci.execCmd('Util', key, argObj).should.be.rejected();
        });
    });

    it('L2cap Level: ParamUpdateReq', function () {
        var argObj = genCmdArgObj('L2cap', 'ParamUpdateReq');
        return bleHci.execCmd('L2cap', 'ParamUpdateReq', argObj).should.be.rejected();
    });

    _.forEach(gapCmdNameArr, function (val) {
        it('Gap Level: ' + val, function () {
            var argObj = genCmdArgObj('Gap', val);
            if (val === 'SetParam' || val === 'GetParam') {
                return bleHci.execCmd('Gap', val, argObj).should.be.fulfilled();
            }
            return bleHci.execCmd('Gap', val, argObj).should.be.rejected();
        });
    });

    _.forEach(attCmdNameArr, function (val) {
        it('Att Level: ' + val, function () {
            var argObj = genCmdArgObj('Att', val);
            if (attObj['Att' + val]) { argObj = attObj['Att' + val]; }
            return bleHci.execCmd('Att', val, argObj).should.be.rejected();
        });
    });

    _.forEach(gattCmdNameArr, function (val) {
        it('Gatt Level: ' + val, function () {
            var argObj = genCmdArgObj('Gatt', val);
            return bleHci.execCmd('Gatt', val, argObj).should.be.rejected();
        });
    });
});

describe('Testing Command Response From Local Controller And Remote Slave', function () {
    var buffer16 = new Buffer([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    this.timeout(15000);

    /*---Hci---*/
    it('Hci Level: DisconnectImmed', function () {
        bleHci.execCmd('Gap', 'DeviceInit', {profileRole: 8, maxScanResponses: 5, irk: buffer16, csrk: buffer16, signCounter: 1}).then(function () {
            return bleHci.execCmd('Gap', 'EstLinkReq', {highDutyCycle: 0, whiteList: 0, addrtypePeer: 0, peerAddr: '0x9059af0b8159'});
        }).then(function () {
            return bleHci.execCmd('Hci', 'DisconnectImmed', {connHandle: 0}).should.be.fulfilled();
        });
    });

    /*---GAP---*/
    it('Gap Level: DeviceInit', function () {
        return bleHci.execCmd('Gap', 'DeviceInit', {profileRole: 8, maxScanResponses: 5, irk: buffer16, csrk: buffer16, signCounter: 1}).should.be.fulfilled();
    });
    it('Gap Level: DeviceDiscReq1', function () {
        return bleHci.execCmd('Gap', 'DeviceDiscReq', {mode: 3, activeScan: 1, whiteList: 0}).should.be.fulfilled();
    });
    it('Gap Level: EstLinkReq', function () {
        return bleHci.execCmd('Gap', 'EstLinkReq', {highDutyCycle: 0, whiteList: 0, addrtypePeer: 0, peerAddr: '0x9059af0b8159'}).should.be.fulfilled();
    });
    

    /*---ATT---*/
    it('Att Level: FindInfoReq', function () {
        return bleHci.execCmd('Att', 'FindInfoReq', {connHandle: 0, startHandle: 0x0001, endHandle: 0xFFFF}).should.be.fulfilled();
    });
    it('Att Level: ReadByTypeReq', function () {
        return bleHci.execCmd('Att', 'ReadByTypeReq', {connHandle: 0, startHandle: 1, endHandle: 65535, type: '0xfff1'}).should.be.fulfilled();
    });
    it('Att Level: ReadReq', function () {
        return bleHci.execCmd('Att', 'ReadReq', {connHandle: 0, handle: 3}).should.be.fulfilled();
    });
    it('Att Level: ReadBlobReq', function () {
        return bleHci.execCmd('Att', 'ReadBlobReq', {connHandle: 0, handle: 37, offset: 0}).should.be.fulfilled();
    });
    it('Att Level: ReadMultiReq', function () {
        return bleHci.execCmd('Att', 'ReadMultiReq', {connHandle: 0, handles: {handle0: 0x0025, handle1: 0x0026}}).should.be.fulfilled();
    });

    it('Att Level: ReadByGrpTypeReq', function () {
        return bleHci.execCmd('Att', 'ReadByGrpTypeReq', {connHandle: 0, startHandle: 1, endHandle: 65535, type: '0x2800'}).should.be.fulfilled();
    });
    it('Att Level: WriteReq', function () {
        return bleHci.execCmd('Att', 'WriteReq', {connHandle: 0, signature: 0, command: 0, handle: 37, value: new Buffer([0x00])}).should.be.fulfilled();
    });

    /*---GATT---*/
    it('Gatt Level: ExchangeMtu', function () {
        return bleHci.execCmd('Gatt', 'ExchangeMtu', {connHandle: 0, clientRxMTU: 23}).should.be.fulfilled();
    });
    it('Gatt Level: DiscAllPrimaryServices', function () {
        return bleHci.execCmd('Gatt', 'DiscAllPrimaryServices', {connHandle: 0}).should.be.fulfilled();
    });
    it('Gatt Level: DiscPrimaryServiceByUuid', function () {
        return bleHci.execCmd('Gatt', 'DiscPrimaryServiceByUuid', {connHandle: 0, value: '0xfff0'}).should.be.fulfilled();
    });
    it('Gatt Level: FindIncludedServices', function () {
        return bleHci.execCmd('Gatt', 'FindIncludedServices', {connHandle: 0, startHandle: 1, endHandle: 65535}).should.be.rejected();
    });
    it('Gatt Level: DiscAllChars', function () {
        return bleHci.execCmd('Gatt', 'DiscAllChars', {connHandle: 0, startHandle: 1, endHandle: 65535}).should.be.fulfilled();
    });
    this.timeout(25000);
    it('Gatt Level: DiscCharsByUuid', function () {
        return bleHci.execCmd('Gatt', 'DiscCharsByUuid', {connHandle: 0, startHandle: 1, endHandle: 65535, type: '0xfff1'}).should.be.fulfilled();
    });
    it('Gatt Level: DiscAllCharDescs', function () {
        return bleHci.execCmd('Gatt', 'DiscAllCharDescs', {connHandle: 0, startHandle: 1, endHandle: 65535}).should.be.fulfilled();
    });
    this.timeout(15000);
    it('Gatt Level: ReadCharValue', function () {
        return bleHci.execCmd('Gatt', 'ReadCharValue', {connHandle: 0, handle: 3}).should.be.fulfilled();
    });
    it('Gatt Level: ReadUsingCharUuid', function () {
        return bleHci.execCmd('Gatt', 'ReadUsingCharUuid', {connHandle: 0, startHandle: 1, endHandle: 65535, type: '0xfff1'}).should.be.fulfilled();
    });
    it('Gatt Level: ReadLongCharValue', function () {
        return bleHci.execCmd('Gatt', 'ReadLongCharValue', {connHandle: 0, handle: 37, offset: 0}).should.be.fulfilled();
    });
    it('Gatt Level: ReadMultiCharValues', function () {
        return bleHci.execCmd('Gatt', 'ReadMultiCharValues', {connHandle: 0, handles: {handle0: 0x0025, handle1: 0x0026}}).should.be.fulfilled();
    });
    it('Gatt Level: WriteCharValue', function () {
        return bleHci.execCmd('Gatt', 'WriteCharValue', {connHandle: 0, handle: 37, value: new Buffer([0])}).should.be.fulfilled();
    });
    it('Gatt Level: WriteLongCharValue', function () {
        return bleHci.execCmd('Gatt', 'WriteLongCharValue', {connHandle: 0, handle: 37, offset: 0, value: new Buffer([0])}).should.be.fulfilled();
    });
    it('Gatt Level: ReadCharDesc', function () {
        return bleHci.execCmd('Gatt', 'ReadCharDesc', {connHandle: 0, handle: 37}).should.be.fulfilled();
    });
    it('Gatt Level: ReadLongCharDesc', function () {
        return bleHci.execCmd('Gatt', 'ReadLongCharDesc', {connHandle: 0, handle: 37, offset: 0}).should.be.fulfilled();
    });
    it('Gatt Level: WriteCharDesc', function () {
        return bleHci.execCmd('Gatt', 'WriteCharDesc', {connHandle: 0, offset: 0, value: new Buffer([37])}).should.be.rejected();
    });

    it('Gap Level: TerminateLink', function () {
        return bleHci.execCmd('Gap', 'TerminateLink', {connHandle: 0, reason: 19}).should.be.fulfilled();
    });
});


function genCmdArgObj(subGrp, cmd) {
    var argObj = hciCmdBuilder[subGrp + cmd](),
        cmdAttrs = argObj.getCmdAttrs(),
        params = cmdAttrs.params,
        types = cmdAttrs.types;

    for(var i = 0; i < params.length; i += 1) {
        argObj[params[i]] = randomArg(types[i]);
    }
    delete argObj.constr_name;
    return argObj;
}

function randomArg(type) {
    var k,
        testBuf,
        bufLen;

    switch (type) {
        case 'uint8':
            //return chance.integer({min: 0, max: 255});
            return 1;
        case 'uint16be':
        case 'uint16le':
            return chance.integer({min: 0, max: 65535});
        case 'uint32le':
            return chance.integer({min: 0, max: 4294967295});
        case 'uint64':
            return chance.integer({min: 0, max: 18446744073709551615});
        case 'buffer':
        case 'buffer6':
        case 'buffer8':
        case 'buffer16':
            if (type === 'buffer') {
                bufLen = chance.integer({min: 0, max: 10});
            } else if (type === 'addr') {
                bufLen = 6;
            } else {
                bufLen = _.parseInt(type.slice(6));
            }
            
            testBuf = new Buffer(bufLen);

            for (k = 0; k < bufLen; k += 1) {
                testBuf[k] = chance.integer({min: 0, max: 255});
            }
            return testBuf;
        case 'addr':
            return '0x123456789011';
        case 'uuid':
            return '0x2a00';
        case 'passkey':
            return '012345';
        case 'string':
            return chance.string();
        default:
            break;
    }

    return;
}

function delay(count) {
    count -= 1;
    if (count === 0) {  return; }
}