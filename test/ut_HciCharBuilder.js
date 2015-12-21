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
        '0x2a22': {
            BootKeyboardInputReport: {
                Value0: 3,
                Value1: 4,
                Value2: 5
            }
        },
        '0x2a32': {
            BootKeyboardOutputReport: {
                Value0: 3,
                Value1: 4,
                Value2: 5
            }
        },
        '0x2a33': {
            BootMouseInputReport: {
                Value0: 3,
                Value1: 4,
                Value2: 5
            }
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
        '0x2a4b': {
            ReportMap: {
                Value0: 3,
                Value1: 4,
                Value2: 5
            }
        },
        '0x2a4d': {
            Report: {
                Value0: 3,
                Value1: 4,
                Value2: 5
            }
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
        '0x2a5e': {
            Flags: 15, 
            SpO2: 1.2,
            PR: 3.4,
            Year: 1996, 
            Month: 1, 
            Day: 4, 
            Hours: 15, 
            Minutes: 23, 
            Seconds: 59, 
            MeasurementStatus: 1, 
            DeviceAndSensorStatus: 3, 
            PulseAmplitudeIndex: 3
        },
        '0x2a5f': {
            Flags: 31,
            SpO2: 0.99,
            PR: 1.01,
            FastSpO2: 0.998, 
            FastPR: 1.001, 
            SlowSpO2: 0.999, 
            SlowPR: 1.0001,
            MeasurementStatus: 1, 
            DeviceAndSensorStatus: 3, 
            PulseAmplitudeIndex: 2
        },
        '0x2a67': {
            Flags: 255,
            InstantaneousSpeed: 0, 
            TotalDistance: 1, 
            Latitude: 2, 
            Longitude: 3, 
            Elevation: 4, 
            Heading: 5, 
            RollingTime: 6,
            Year: 1991,
            Month: 9,
            Day: 17,
            Hours: 20,
            Minutes: 30,
            Seconds: 40
        },
        '0x2a68': {
            Flags: 255,
            Bearing: 1, 
            Heading: 2,
            RemainingDistance: 3, 
            RemainingVerticalDistance: 4,
            Year: 1991,
            Month: 9,
            Day: 17,
            Hours: 20,
            Minutes: 30,
            Seconds: 40
        },
        '0x2a69': {
            Flags: 255,
            NumberOfBeaconsInSolution: 0,
            NumberOfBeaconsInView: 1,
            TimeToFirstFix: 2,
            EHPE: 3,
            EVPE: 4,
            HDOP: 5,
            VDOP: 6
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
