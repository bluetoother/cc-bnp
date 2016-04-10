'use strict';
var _ = require('lodash'),
	should = require('should'),
	Chance = require('chance'),
	chance = new Chance(),
    Q = require('q');

var hciCharBuilder = require('../lib/hci/hciCharBuilder'),
    hciCharMeta = require('../lib/hci/hciCharMeta'),
    hciCharDiscrim = require('../lib/hci/hciCharDiscriminator');

var furtherProcessArr = [
    '0x2905', '0x290a', '0x290e', '0x2a18', '0x2a1c', '0x2a1e', '0x2a22', '0x2a32', '0x2a33', 
    '0x2a34', '0x2a35', '0x2a36', '0x2a37', '0x2a53', '0x2a5b', '0x2a9c', '0x2a9d'];

var uuidObj = {
        '0x2905': {
            listOfHandles: {
                handle0: 3,
                handle1: 4,
                handle2: 5
            }
        },
        '0x290a': {
            condition: 1,
            analog: 0x0101
    	},
    	'0x290e': {
            condition: 2,
            timeInterval: 0x010203
    	},
    	'0x2a18': {
            flags: 15,
            sequenceNum: 8,
            year: 2015, 
            month: 12, 
            day: 15, 
            hours: 13, 
            minutes: 20, 
            seconds: 10,
            timeOffset: 0,
            glucoseMol: 12.34,
            type: 2, 
            sampleLocation: 3,
            sensorStatus: 4
    	},
        '0x2a1c': {
            flags: 7,
            tempF: 96.5,
            year: 2015, 
            month: 12, 
            day: 15, 
            hours: 13, 
            minutes: 20, 
            seconds: 10,
            tempType: 1
        },
        '0x2a1e': {
            flags: 6,
            tempC: 23.24,
            year: 2015, 
            month: 12, 
            day: 15, 
            hours: 13, 
            minutes: 20, 
            seconds: 10,
            tempType: 1
        },
        '0x2a22': {
            bootKeyboardInput: {
                value0: 3,
                value1: 4,
                value2: 5
            }
        },
        '0x2a32': {
            bootKeyboardOutput: {
                value0: 3,
                value1: 4,
                value2: 5
            }
        },
        '0x2a33': {
            bootMouseInput: {
                value0: 3,
                value1: 4,
                value2: 5
            }
        },
        '0x2a34': {
            flags: 255,
            sequenceNum: 8,
            extendedFlags: 1, 
            carbohydrateID: 12, 
            carbohydrate: 12.34,
            meal: 10,
            tester: 1,
            health: 2,
            exerciseDuration: 20,
            exerciseIntensity: 30,
            medicationID: 40,
            medicationL: 56.78,
            hbA1c: 123.456
        },
        '0x2a35': {
            flags: 255,
            systolicKpa: 1.2,
            diastolicKpa: 2.3,
            arterialPresKpa: 3.4,
            year: 2015, 
            month: 12, 
            day: 15, 
            hours: 13, 
            minutes: 20, 
            seconds: 10,
            pulseRate: 11.11,
            userID: 1,
            status: 1
        },
        '0x2a36': {
            flags: 254,
            systolicMmHg: 1.2,
            diastolicMmHg: 2.3,
            arterialPresMmHg: 3.4,
            year: 2015, 
            month: 12, 
            day: 15, 
            hours: 13, 
            minutes: 20, 
            seconds: 10,
            pulseRate: 11.11,
            userID: 1,
            status: 1
        },
        '0x2a37': {
            flags: 31,
            heartRate16: 24,
            energyExpended: 46,
            rrInterval: 68
        },
        '0x2a4b': {
            reportMap: {
                value0: 3,
                value1: 4,
                value2: 5
            }
        },
        '0x2a4d': {
            report: {
                value0: 3,
                value1: 4,
                value2: 5
            }
        },
        '0x2a53': {
            flags: 3,
            speed: 2,
            cadence: 1,
            strideLength: 0,
            totalDist: 1
        },
        '0x2a5b': {
            flags: 7,
            cumulativeWheelRev: 1,
            lastWheelEventTime: 2,
            cumulativeCrankRev: 3,
            lastCrankEventTime: 4
        },
        '0x2a5e': {
            flags: 15, 
            spOs2: 1.2,
            pr: 3.4,
            Year: 1996, 
            Month: 1, 
            Day: 4, 
            Hours: 15, 
            Minutes: 23, 
            Seconds: 59, 
            MeasureStatus: 1, 
            DeviceAndSensorStatus: 3, 
            PulseAmpIndex: 3
        },
        '0x2a5f': {
            Flags: 31,
            normalSpO2: 0.99,
            normalPR: 1.01,
            fastSpO2: 0.998, 
            fastPR: 1.001, 
            slowSpO2: 0.999, 
            slowPR: 1.0001,
            measureStatus: 1, 
            deviceAndSensorStatus: 3, 
            pulseAmpIndex: 2
        },
        '0x2a67': {
            flags: 255,
            instantSpeed: 0, 
            totalDistance: 1, 
            latitude: 2, 
            longitude: 3, 
            elevation: 4, 
            heading: 5, 
            rollingTime: 6,
            year: 1991,
            month: 9,
            day: 17,
            hours: 20,
            minutes: 30,
            seconds: 40
        },
        '0x2a68': {
            flags: 255,
            bearing: 1, 
            heading: 2,
            remainingDist: 3, 
            remainingVertDist: 4,
            year: 1991,
            month: 9,
            day: 17,
            hours: 20,
            minutes: 30,
            seconds: 40
        },
        '0x2a69': {
            flags: 255,
            beaconsInSolution: 0,
            beaconsInView: 1,
            timeToFirstFix: 2,
            ehpe: 3,
            evpe: 4,
            hdop: 5,
            vdop: 6
        },
        '0x2a9c': {
            flags: 4094,
            bodyFatPercent: 15,
            year: 1991,
            month: 9,
            day: 17,
            hours: 20,
            minutes: 30,
            seconds: 40,
            userID: 4,
            basalMetabolism: 1,
            musclePercent: 2,
            muscleMassKg: 3,
            fatFreeMassKg: 4,
            softLeanMassKg: 5,
            bodyWaterMassKg: 6,
            impedance: 7,
            weightKg: 8,
            heightMeters: 9
        },
        '0x2a9d': {
            flags: 15,
            weightImperial: 60,
            year: 1991,
            month: 9,
            day: 17,
            hours: 20,
            minutes: 30,
            seconds: 40,
            userID: 4,
            bmi: 15,
            heightImperial: 170
        }
    };

describe('Builder Testing', function () {

    _.forEach(hciCharMeta, function (meta, uuid) {
        if (!uuidObj[uuid]) {
            var charObj = {},
                params = meta.params,
                types = meta.types;

            for(var i = 0; i < params.length; i += 1) {
                charObj[params[i]] = randomArg(types[i]);
            }

            it(uuid + ' framer check', function () {
                var argObj = hciCharBuilder(uuid).transToValObj(charObj).getHciCharBuf(),
                    discrim = hciCharDiscrim(uuid);
                return discrim.getCharValPacket(argObj).then(function (result) {
                    return charObj.should.be.deepEqual(result);
                });
            });
        }
    });

    _.forEach(furtherProcessArr, function (val) {
        it(val + ' framer check', function () {
            var argObj = hciCharBuilder(val).transToValObj(uuidObj[val]).getHciCharBuf(),
                discrim = hciCharDiscrim(val);
            return discrim.getCharValPacket(argObj).then(function (result) {
                return uuidObj[val].should.be.deepEqual(result);
            });
        });
    });
});

function randomArg(type) {
    var k,
        testBuf,
        bufLen;

    switch (type) {
        case 'uint8':
            return chance.integer({min: 0, max: 255});
        case 'uint16':
            return chance.integer({min: 0, max: 65535});
        case 'uint24':
            return chance.integer({min: 0, max: 16777215});
        case 'uint32':
            return chance.integer({min: 0, max: 4294967295});
        case 'uint64':
            return chance.integer({min: 0, max: 18446744073709551615});
        case 'int8' :
            return chance.integer({min: -128, max: 127});
        case 'int16' :
            return chance.integer({min: -32768, max: 32767});
        case 'int24' :
            return chance.integer({min: -8388608, max: 8388607});
        case 'int32' :
            return chance.integer({min: -2147483648, max: 2147483647});
        case 'uuid':
            return '0x2a00';
        case 'addr3':
            return '0x112233';
        case 'addr5':
            return '0x1234567890';
        case 'addr6':
            return '0x123456789011';
        case 'boolean':
            return chance.bool();
        case 'nibble':
            return chance.integer({min: 0, max: 15});
        case 'sfloat':
            return chance.floating();
        case 'float':
            return chance.floating();
        case 'string':
            return chance.string();
        default:
            break;
    }
}
