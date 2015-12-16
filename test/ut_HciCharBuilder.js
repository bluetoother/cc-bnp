'use strict';
var _ = require('lodash'),
	should = require('should'),
	Chance = require('chance'),
	chance = new Chance(),
    Q = require('q');

var hciCharBuilder = require('../lib/hci/HciCharBuilder'),
    hciCharMeta = require('../lib/hci/HciCharMeta'),
    hciCharDiscrim = require('../lib/hci/HciCharDiscriminator');

var furtherProcessArr = [
    '0x290a', '0x290e', '0x2a18', '0x2a1c', '0x2a1e', '0x2a34', '0x2a35', 
    '0x2a36', '0x2a37', '0x2a53', '0x2a5b', '0x2a9c', '0x2a9d'];

var uuidObj = {
        '0x290a': {
            Condition: 1,
            ValueAnalog: 0x0101
    	},
    	'0x290e': {
            Condition: 2,
            ValueTimeInterval: 0x010203
    	},
    	'0x2a18': {
            Flags: 15,
            SequenceNumber: 8,
            Year: 2015, 
            Month: 12, 
            Day: 15, 
            Hours: 13, 
            Minutes: 20, 
            Seconds: 10,
            TimeOffset: 0,
            GlucoseMol: 12.34,
            Type: 2, 
            SampleLocation: 3,
            SensorStatus: 4
    	},
        '0x2a1c': {
            Flags: 7,
            TempF: 96.5,
            Year: 2015, 
            Month: 12, 
            Day: 15, 
            Hours: 13, 
            Minutes: 20, 
            Seconds: 10,
            TempType: 1
        },
        '0x2a1e': {
            Flags: 6,
            TempC: 23.24,
            Year: 2015, 
            Month: 12, 
            Day: 15, 
            Hours: 13, 
            Minutes: 20, 
            Seconds: 10,
            TempType: 1
        },
        '0x2a34': {
            Flags: 255,
            SequenceNumber: 8,
            ExtendedFlags: 1, 
            CarbohydrateID: 12, 
            Carbohydrate: 12.34,
            Meal: 10,
            Tester: 1,
            Health: 2,
            ExerciseDuration: 20,
            ExerciseIntensity: 30,
            MedicationID: 40,
            MedicationL: 56.78,
            HbA1c: 123.456
        },
        '0x2a35': {
            Flags: 255,
            SystolicKPa: 1.2,
            DiastolicKPa: 2.3,
            MeanArterialPressureKPa: 3.4,
            Year: 2015, 
            Month: 12, 
            Day: 15, 
            Hours: 13, 
            Minutes: 20, 
            Seconds: 10,
            PulseRate: 11.11,
            UserID: 1,
            Status: 1
        },
        '0x2a36': {
            Flags: 254,
            SystolicMmHg: 1.2,
            DiastolicMmHg: 2.3,
            MeanArterialPressureMmHg: 3.4,
            Year: 2015, 
            Month: 12, 
            Day: 15, 
            Hours: 13, 
            Minutes: 20, 
            Seconds: 10,
            PulseRate: 11.11,
            UserID: 1,
            Status: 1
        },
        '0x2a37': {
            Flags: 31,
            HeartRate16: 24,
            EnergyExpended: 46,
            RRInterval: 68
        },
        '0x2a53': {
            Flags: 3,
            Speed: 2,
            Cadence: 1,
            StrideLength: 0,
            TotalDistance: 1
        },
        '0x2a5b': {
            Flags: 7,
            CumulativeWheelRevolutions: 1,
            LastWheelEventTime: 2,
            CumulativeCrankRevolutions: 3,
            LastCrankEventTime: 4
        },
        '0x2a9c': {
            Flags: 4094,
            BodyFatPercentage: 15,
            Year: 1991,
            Month: 9,
            Day: 17,
            Hours: 20,
            Minutes: 30,
            Seconds: 40,
            UserID: 4,
            BasalMetabolism: 1,
            MusclePercentage: 2,
            MuscleMassKg: 3,
            FatFreeMassKg: 4,
            SoftLeanMassKg: 5,
            BodyWaterMassKg: 6,
            Impedance: 7,
            WeightKg: 8,
            HeightMeters: 9
        },
        '0x2a9d': {
            Flags: 15,
            WeightImperial: 60,
            Year: 1991,
            Month: 9,
            Day: 17,
            Hours: 20,
            Minutes: 30,
            Seconds: 40,
            UserID: 4,
            BMI: 15,
            HeightImperial: 170
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
            break;
        case 'uint16':
            return chance.integer({min: 0, max: 65535});
            break;
        case 'uint24':
            return chance.integer({min: 0, max: 16777215});
            break;
        case 'uint32':
            return chance.integer({min: 0, max: 4294967295});
            break;
        case 'uint64':
            return chance.integer({min: 0, max: 18446744073709551615});
            break;
        case 'int8' :
            return chance.integer({min: -128, max: 127});
            break;
        case 'int16' :
            return chance.integer({min: -32768, max: 32767});
            break;
        case 'int24' :
            return chance.integer({min: -8388608, max: 8388607});
            break;
        case 'int32' :
            return chance.integer({min: -2147483648, max: 2147483647});
            break;
        case 'uuid':
            return '0x2a00';
            break;
        case 'addr3':
            return '0x112233';
            break;
        case 'addr5':
            return '0x1234567890';
            break;
        case 'addr6':
            return '0x123456789011';
            break;
        case 'boolean':
            return chance.bool();
            break;
        case 'nibble':
            return chance.integer({min: 0, max: 15});
            break;
        case 'sfloat':
            return chance.floating();
            break;
        case 'float':
            return chance.floating();
            break;
        case 'string':
            return chance.string();
            break;

        default:
        break;
    }
}
