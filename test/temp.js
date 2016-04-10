var _ = require('lodash'),
    Q = require('q'),
    should = require('should-promised'),
    Chance = require('chance'),
    chance = new Chance(),
    util = require('util'),
    EventEmitter = require('events').EventEmitter,
    SerialPort = require('serialport').SerialPort;

var bleHci = require('../lib/hci/bleHci'),
    hciCmdBuilder = require('../lib/hci/hciCmdBuilder');
    BHCI = require('../lib/defs/blehcidefs');

var sp = new SerialPort("/dev/ttyUSB0", {
    baudrate: 115200,
    rtscts: true,
    flowControl: true
}, false);
bleHci.registerSp(sp);

bleHci.openSp().then(function () {
    var buffer16 = new Buffer([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
        resultObj,
        //for test
        charObj,
        charsInfo = [];

    // bleHci.execCmd('Att', 'ReadByTypeReq', {connHandle: 0, startHandle: 1, endHandle: 65535, type: '0xFFF1'}).then(function (result) {
    //     console.log(result);
    //     _.forEach(result[1], function (data) {
    //         console.log(data.data);
    //     });
    // }).fail(function (err) {
    //     console.log(err);
    // });

    bleHci.execCmd('Gatt', 'ReadUsingCharUuid', {connHandle: 0, startHandle: 1, endHandle: 65535, type: '0xfff1'}).then(function (result) {
        console.log(result);
        _.forEach(result[1], function (data) {
            console.log(data.data);
        });
    }).fail(function (err) {
        console.log(err);
    });

    // bleHci.execCmd('Att', 'FindInfoReq', {connHandle: 65534, startHandle: 0x0001, endHandle: 0xFFFF}).then(function (result) {
    //     console.log(result);
    //     console.log(result[1].AttFindInfoRsp0.info)
    // }).fail(function (err) {
    //     console.log(err);
    // });

    // bleHci.execCmd('Gatt', 'AddService', {UUID: '0x2800', numAttrs: 5}).then(function (result) {
    //     console.log(result);
    // }).fail(function (err) {
    //     console.log(err);
    // });

    // bleHci.execCmd('Gatt', 'DelService', {handle: 0x0000}).then(function (result) {
    //     console.log(result);
    // }).fail(function (err) {
    //     console.log(err);
    // });

    // bleHci.execCmd('Gatt', 'AddAttribute', {UUID: '0x2902', permissions: 3}).then(function (result) {
    //     console.log(result);
    // }).fail(function (err) {
    //     console.log(err);
    // });
    // bleHci.execCmd('Gatt', 'AddAttribute', {UUID: '0xFFF1', permissions: 3}).then(function (result) {
    //     console.log(result);
    // }).fail(function (err) {
    //     console.log(err);
    // });
    // bleHci.execCmd('Gatt', 'AddAttribute', {UUID: '0x2902', permissions: 8}).then(function (result) {
    //     console.log(result);
    // }).fail(function (err) {
    //     console.log(err);
    // });

    // bleHci.execCmd('Gatt', 'AddAttribute', {UUID: '0xFFF1', permissions: 3}).then(function (result) {
    //     console.log(result);
    // }).fail(function (err) {
    //     console.log(err);
    // });

    // bleHci.execCmd('Att', 'ReadByGrpTypeReq', {connHandle: 0, startHandle: 1, endHandle: 65535, type: '0x2800'}).then(function (result) {
    //     console.log(result);
    // }).fail(function (err) {
    //     console.log(err);
    // });

    // bleHci.execCmd('Att', 'ReadByTypeReq', {connHandle: 0, startHandle: 1, endHandle: 65535, type: '0x2800'}).then(function (result) {
    //     console.log(result);
    // }).fail(function (err) {
    //     console.log(err);
    // });

    // bleHci.execCmd('Att', 'FindByTypeValueReq', {connHandle: 0, startHandle: 1, endHandle: 65535, type: '0x2800'}).then(function (result) {
    //     console.log(result);
    // }).fail(function (err) {
    //     console.log(err);
    // });

    

    // bleHci.execCmd('Gap', 'Authenticate', {connHandle: 0, secReq_ioCaps: 4, secReq_oobAvailable: 0, secReq_oob: buffer16, secReq_authReq: 5, secReq_maxEncKeySize: 16, 
    // secReq_keyDist: 0x77, pairReq_Enable: 0, pairReq_ioCaps: 0, pairReq_oobDataFlag: 0, pairReq_authReq: 0, pairReq_maxEncKeySize: 16, pairReq_keyDist: 0x77})
    // .then(function (result) {
    //     console.log(result);
    // }, function (err) {
    //     console.log('err');
    //     console.log(err);
    // });

    // setTimeout(function () {
    //     bleHci.execCmd('Gatt', 'DiscAllPrimaryServices', {connHandle: 0}).then(function (result) {
    //         console.log(1);
    //         console.log(result);
    //     }, function (err) {
    //         console.log('err');
    //         console.log(err);
    //     });
    //     bleHci.execCmd('Gatt', 'ReadUsingCharUuid', {connHandle: 0, startHandle: 1, endHandle: 65535, type: new Buffer([0xF1, 0xFF])}).then(function (result) {
    //         console.log('GapDiscCharsByUuid1');
    //         console.log(result);
    //     }, function (err) {
    //         console.log('GapDiscCharsByUuid1:err');
    //         console.log(err);
    //     });
    //     bleHci.execCmd('Gatt', 'ReadUsingCharUuid', {connHandle: 0, startHandle: 1, endHandle:0xFFFF, type: new Buffer([0xF1, 0xFF])}).then(function (result) {
    //         console.log('GapDiscCharsByUuid2');
    //         console.log(result);
    //     }, function (err) {
    //         console.log('GapDiscCharsByUuid2:err');
    //         console.log(err);
    //     });
    //     bleHci.execCmd('Gatt', 'ReadUsingCharUuid', {connHandle: 0, startHandle: 1, endHandle:0xFFFF, type: new Buffer([0xF1, 0xFF])}).then(function (result) {
    //         console.log('GapDiscCharsByUuid3');
    //         console.log(result);
    //     }, function (err) {
    //         console.log('GapDiscCharsByUuid3:err');
    //         console.log(err);
    //     });
    // }, 1000);

    // setTimeout(function () {
    //     bleHci.execCmd('Gap', 'DeviceDiscReq', {mode: 3, activeScan: 1, whiteList: 0}).then(function (result) {
    //         console.log('GapDeviceDiscReq1');
    //         console.log(result);
    //         return bleHci.execCmd('Gap', 'DeviceDiscReq', {mode: 3, activeScan: 1, whiteList: 0});
    //     }).then(function (result) {
    //         console.log('GapDeviceDiscReq2');
    //         console.log(result);
    //         return bleHci.execCmd('Gap', 'DeviceDiscReq', {mode: 3, activeScan: 1, whiteList: 0});
    //     }).then(function (result) {
    //         console.log('GapDeviceDiscReq3');
    //         console.log(result);
    //     });
    // }, 1000);

    // setTimeout(function () {
    //     bleHci.execCmd('Gatt', 'ReadCharValue', {connHandle: 0, handle: 37})
    //     .then(function (result) {
    //         console.log('GapDiscCharsByUuid1');
    //         console.log(result);
    //     });
    // }, 10000);

    // setTimeout(function () {
    //     bleHci.execCmd('Gatt', 'ReadCharValue', {connHandle: 0, handle: 37})
    //     .then(function (result) {
    //         console.log('GapDiscCharsByUuid2');
    //         console.log(result);
    //     });
    // }, 15000);

    // setTimeout(function () {
    //     bleHci.execCmd('Gatt', 'ReadCharValue', {connHandle: 0, handle: 37})
    //     .then(function (result) {
    //         console.log('GapDiscCharsByUuid3');
    //         console.log(result);
    //     });
    // }, 20000);
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