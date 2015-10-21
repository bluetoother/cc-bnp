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

var buffer16 = new Buffer([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
var sp = new SerialPort("/dev/ttyUSB0", {
    baudrate: 115200,
    rtscts: true,
    flowControl: true
}, false);
bleHci.registerSp(sp);
bleHci.openSp();
// bleHci.openSp().then(function () {
//     var argObj1 = genCmdArgObj('Hci', 'EnablePtm'),
//         argObj2 = genCmdArgObj('Hci', 'PerByChan');
//     // bleHci.execCmd('Hci', 'EnablePtm', argObj1).then(function (result) {
//     //     console.log('result: ');
//     //     console.log(result);
//     // }, function (err) {
//     //     console.log('err: ');
//     //     console.log(err);
//     // })
//     bleHci.execCmd('Hci', 'PerByChan', argObj2).then(function (result) {
//         console.log('result: ');
//         console.log(result);
//     }, function (err) {
//         console.log('err: ');
//         console.log(err);
//     })
// });

describe('Hci Level Command Testing', function () {
    _.forEach(BHCI.SubGroupCmd.Hci._enumMap, function (val, key) {
        it('test ' + key +' response from local host', function () {
            var argObj = genCmdArgObj('Hci', key);
            // bleHci.execCmd('Hci', key, argObj).then(function (result) {
            //     console.log(result);
            //     return result.should.be.an.Object;
            // })
            if (key === 'DisconnectImmed') { return; }
            return bleHci.execCmd('Hci', key, argObj).should.be.fulfilled();
        });
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
            // return chance.integer({min: 0, max: 255});
            return 1;
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
                bufLen = chance.integer({min: 0, max: 255});
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
// bleHci.openSp().then(function () {
//     setTimeout(function () {
        // bleHci.execCmd('Hci', 'SetRxGain', {rxGain: 1}).then(function (result) {
        //     console.log('result: ');
        //     console.log(result);
        // }, function (err) {
        //     console.log('err: ');
        //     console.log(err);
        // })
//         bleHci.execCmd('Hci', 'SetTxPower', {txPower: 2}).then(function (result) {
//             console.log('result: ');
//             console.log(result);
//         }, function (err) {
//             console.log('err: ');
//             console.log(err);
//         });
//         bleHci.execCmd('Hci', 'SetTxPower', {txPower: 2}).then(function (result) {
//             console.log('result: ');
//             console.log(result);
//         }, function (err) {
//             console.log('err: ');
//             console.log(err);
//         });
//         bleHci.execCmd('Gap', 'DeviceInit', {profileRole: 8, maxScanResponses: 5, IRK: buffer16, CSRK: buffer16, signCounter: 1}).then(function (result) {
//             console.log(result);
//         }, function (err) {
//             console.log(err);
//         });
//         // bleHci.execCmd('Gap', 'DeviceDiscReq', {mode: 3, activeScan: 1, whiteList: 0}).then(function (result) {
//         //     console.log(result);
//         // }, function (err) {
//         //     console.log(err);
//         // });
//         // bleHci.execCmd('Gap', 'DeviceDiscReq', {mode: 3, activeScan: 1, whiteList: 0}).then(function (result) {
//         //     console.log(result);
//         // }, function (err) {
//         //     console.log(err);
//         // });
//         // bleHci.execCmd('Gap', 'DeviceDiscReq', {mode: 3, activeScan: 1, whiteList: 0}).then(function (result) {
//         //     console.log(result);
//         // }, function (err) {
//         //     console.log(err);
//         // });
//         // bleHci.execCmd('Gap', 'EstLinkReq', {highDutyCycle: 0, whiteList: 0, addrtypePeer: 0, peerAddr: new Buffer([0x78, 0xC5, 0xE5, 0x70, 0x79, 0x6E])}).then(function (result) {
//         //     console.log('result: ');
//         //     console.log(result);
//         // }, function (err) {
//         //     console.log('err: ');
//         //     console.log(err);
//         // });
//         // bleHci.execCmd('Gap', 'EstLinkReq', {highDutyCycle: 0, whiteList: 0, addrtypePeer: 0, peerAddr: new Buffer([0x78, 0xC5, 0xE5, 0x70, 0x79, 0x6E])}).then(function (result) {
//         //     console.log('result: ');
//         //     console.log(result);
//         // }, function (err) {
//         //     console.log('err: ');
//         //     console.log(err);
//         // });
//         // bleHci.execCmd('Gap', 'TerminateLink', {connHandle: 0, reason: 19}).then(function (result) {
//         //     console.log('result: ');
//         //     console.log(result);
//         // }, function (err) {
//         //     console.log('err: ');
//         //     console.log(err);
//         // });
//         // bleHci.execCmd('Gap', 'TerminateLink', {connHandle: 0, reason: 19}).then(function (result) {
//         //     console.log('result: ');
//         //     console.log(result);
//         // }, function (err) {
//         //     console.log('err: ');
//         //     console.log(err);
//         // });
//         // bleHci.execCmd('Att', 'FindInfoReq', {connHandle: 0, startHandle: 0x0001, endHandle: 0xFFFF}).then(function (result) {
//         //     console.log('result: ');
//         //     console.log(result);
//         // }, function (err) {
//         //     console.log('err: ');
//         //     console.log(err);
//         // });
//         // bleHci.execCmd('Att', 'FindInfoReq', {connHandle: 0, startHandle: 0x0001, endHandle: 0xFFFF}).then(function (result) {
//         //     console.log('result: ');
//         //     console.log(result);
//         // }, function (err) {
//         //     console.log('err: ');
//         //     console.log(err);
//         // });
//         // bleHci.execCmd('Att', 'ExecuteWriteReq', {connHandle: 0, flags: 0}).then(function (result) {
//         //     console.log('result: ');
//         //     console.log(result);
//         // }, function (err) {
//         //     console.log('err: ');
//         //     console.log(err);
//         // });
//         // bleHci.execCmd('Att', 'WriteReq', {connHandle: 65534, signature: 0, command: 0, handle: 1, value: new Buffer([0x00])}).then(function (result) {
//         //     console.log('result: ');
//         //     console.log(result);
//         // }, function (err) {
//         //     console.log('err: ');
//         //     console.log(err);
//         // });
//         // bleHci.execCmd('Att', 'ReadBlobReq', {connHandle: 0, handle: 1, offset: 0}).then(function (result) {
//         //     console.log(result);
//         // }, function (err) {
//         //     console.log(err);
//         // });
//         // bleHci.execCmd('Att', 'ReadBlobReq', {connHandle: 0, handle: 1, offset: 0}).then(function (result) {
//         //     console.log(result);
//         // }, function (err) {
//         //     console.log(err);
//         // });
//     }, 100);
// })