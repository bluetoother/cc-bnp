var _ = require('lodash'),
    Q = require('q'),
    should = require('should-promised'),
    Chance = require('chance'),
    chance = new Chance(),
    util = require('util'),
    EventEmitter = require('events').EventEmitter,
    SerialPort = require('serialport').SerialPort;

var bleHci = require('../hci/bleHci'),
    hciCmdBuilder = require('../hci/HciCmdBuilder');
    BHCI = require('../defs/blehcidefs');

var sp = new SerialPort("/dev/ttyUSB0", {
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
            uuid0: 11,
            handle1: 2,
            uuid1: 22,
            handle2: 3,
            uuid2: 33
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

    _.forEach(BHCI.SubGroupCmd.Hci._enumMap, function (val, key) {
        it('Hci Level: ' + key, function () {
            var argObj = genCmdArgObj('Hci', key);

            if (key === 'DisconnectImmed') { return; }
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

    // it('Hci Level: DisconnectImmed', function () {
    //     var argObj = genCmdArgObj('Hci', 'DisconnectImmed');
    //     return bleHci.execCmd('Hci', 'DisconnectImmed', argObj).should.be.fulfilled();
    // });

    /*---GAP---*/
    it('Gap Level: DeviceInit', function () {
        return bleHci.execCmd('Gap', 'DeviceInit', {profileRole: 8, maxScanResponses: 5, IRK: buffer16, CSRK: buffer16, signCounter: 1}).should.be.fulfilled();
    });
    it('Gap Level: DeviceDiscReq1', function () {
        return bleHci.execCmd('Gap', 'DeviceDiscReq', {mode: 3, activeScan: 1, whiteList: 0}).should.be.fulfilled();
    });
    it('Gap Level: EstLinkReq', function () {
        return bleHci.execCmd('Gap', 'EstLinkReq', {highDutyCycle: 0, whiteList: 0, addrtypePeer: 0, peerAddr: new Buffer([0x78, 0xC5, 0xE5, 0x70, 0x79, 0x6E])}).should.be.fulfilled();
    });
    

    /*---ATT---*/
    it('Att Level: FindInfoReq', function () {
        return bleHci.execCmd('Att', 'FindInfoReq', {connHandle: 0, startHandle: 0x0001, endHandle: 0xFFFF}).should.be.fulfilled();
    });
    it('Att Level: WriteReq', function () {
        return bleHci.execCmd('Att', 'WriteReq', {connHandle: 0, signature: 0, command: 0, handle: 1, value: new Buffer([0x00])}).should.be.rejected();
    });
    it('Att Level: ReadBlobReq', function () {
        return bleHci.execCmd('Att', 'ReadBlobReq', {connHandle: 0, handle: 1, offset: 0}).should.be.fulfilled();
    });

    it('Gap Level: TerminateLink', function () {
        return bleHci.execCmd('Gap', 'TerminateLink', {connHandle: 0, reason: 19}).should.be.fulfilled();
    });

    it('Gatt Level: ', function () {

    });
})


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
            // return chance.integer({min: 0, max: 255});
            return 5;
            break;
        case 'uint16be':
        case 'uint16le':
            return chance.integer({min: 0, max: 65535});
            break;
        case 'uint32le':
            return chance.integer({min: 0, max: 4294967295});
            break;
        case 'uint64':
            return chance.integer({min: 0, max: 18446744073709551615});
            break;
        case 'buffer':
        case 'buffer6':
        case 'buffer8':
        case 'buffer16':
        case 'addr':
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
            break;
        case 'string':
            return chance.string();
            break;

        default:
        break;
    }

    return;
}