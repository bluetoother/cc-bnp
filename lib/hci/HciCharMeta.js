'use strict';

var _ = require('lodash');

var hciCharMeta = {

    '0x2800' : {
        params : ['PrimaryService'],
        types : ['uuid']
    },
    '0x2801' : {
        params : ['SecondaryService '],
        types : ['uuid']
    },
    '0x2802' : {
        params : ['ServiceHandle', 'EndGroupHandle', 'UUID'],
        types : ['uint16', 'uint16', 'uuid']
    },
    '0x2803' : {
        params : ['Properties', 'Handle', 'UUID'],
        types : ['uint8', 'uint16', 'uuid']
    },
    '0x2900' : {
        params : ['Properties'],
        types : ['uint16']
    },
    '0x2901' : {
        params : ['UserDescription'],
        types : ['string']
    },
    '0x2902' : {
        params : ['Properties'],
        types : ['uint16']
    },
    '0x2903' : {
        params : ['Properties'],
        types : ['uint16']
    },
    '0x2904' : {
        params : ['Format', 'Exponent', 'Unit', 'Namespace', 'Description'],
        types : ['uint8', 'int8', 'uint16', 'uint8', 'uint16']
    },
    '0x2905' : {
        params : ['ListOfHandles'],
        types : ['uint16']
    },
    // TODO the same format as the characteristic
    // '0x2906' : {
    //     params : [''],
    //     types : ['']
    // },
    '0x2907' : {
        params : ['ExternalReportReference'],
        types : ['uuid']
    },
    '0x2908' : {
        params : ['ReportID', 'ReportType'],
        types : ['uint8', 'uint8']
    },
    '0x2909' : {
        params : ['NoOfDigitals'],
        types : ['uint8']
    },
    '0x290a' : {
        params : ['Condition'],
        types : ['uint8'],
        extra: {
            params : ['ValueAnalog', 'ValueBitMask', 'ValueAnalogInterval'],
            types : ['uint16', 'uint8', 'uint32'],
            result: [3, 4, 6]
        }
    },
    //TODO Environmental Sensing Service Section
    // '0x290b' : {
    //     params : [''],
    //     types : ['']
    // },
    //TODO Environmental Sensing Service Section
    // '0x290c' : {
    //     params : [''],
    //     types : ['']
    // },
    //TODO Environmental Sensing Service Section
    // '0x290d' : {
    //     params : [''],
    //     types : ['']
    // },
    '0x290e' : {
        params : ['Condition'],
        types : ['uint8'],
        extra: {
            params : ['ValueNone', 'ValueTimeInterval', 'ValueCount'],
            types : ['uint8', 'uint24', 'uint16'],
            result: [0, 2, 3]
        }
    },
    '0x2a00' : {
        params : ['DeviceName'],
        types : ['string']
    },
    '0x2a01' : {
        params : ['Appearance'],
        types : ['uint16']
    },
    '0x2a02' : {
        params : ['PeripheralPrivacyFlag'],
        types : ['boolean']
    },
    '0x2a03' : {
        params : ['ReconnAddr'],
        types : ['addr6']
    },
    '0x2a04' : {
        params : ['MinConnInterval', 'MaxConnInterval', 'Latency', 'Timeout'],
        types : ['uint16', 'uint16', 'uint16', 'uint16']
    },
    '0x2a05' : {
        params : ['StartHandle', 'EndHandle'],
        types : ['uint16', 'uint16']
    },
    '0x2a06' : {
        params : ['AlertLevel'],
        types : ['uint8']
    },
    '0x2a07' : {
        params : ['TxPowerLevel'],
        types : ['int8']
    },
    '0x2a08' : {
        params : ['Year', 'Month', 'Day', 'Hours', 'Minutes', 'Seconds'],
        types : ['uint16', 'uint8', 'uint8', 'uint8', 'uint8', 'uint8']
    },
    '0x2a09' : {
        params : ['DayofWeek'],
        types : ['uint8']
    },
    '0x2a0a' : {
        params : ['Year', 'Month', 'Day', 'Hours', 'Minutes', 'Seconds', 'DayofWeek'],
        types : ['uint16', 'uint8', 'uint8', 'uint8', 'uint8', 'uint8', 'uint8']
    },
    '0x2a0c' : {
        params : ['Year', 'Month', 'Day', 'Hours', 'Minutes', 'Seconds', 'DayofWeek', 'Fractions256'],
        types : ['uint16', 'uint8', 'uint8', 'uint8', 'uint8', 'uint8', 'uint8', 'uint8']
    },
    '0x2a0d' : {
        params : ['DSTOffset'],
        types : ['uint8']
    },
    '0x2a0e' : {
        params : ['TimeZone'],
        types : ['int8']
    },
    '0x2a0f' : {
        params : ['TimeZone', 'DSTOffset'],
        types : ['int8', 'uint8']
    },
    '0x2a11' : {
        params : ['Year', 'Month', 'Day', 'Hours', 'Minutes', 'Seconds', 'DSTOffset'],
        types : ['uint16', 'uint8', 'uint8', 'uint8', 'uint8', 'uint8', 'uint8']
    },
    '0x2a12' : {
        params : ['TimeAccuracy'],
        types : ['uint8']
    },
    '0x2a13' : {
        params : ['TimeSource'],
        types : ['uint8']
    },
    '0x2a14' : {
        params : ['TimeSource', 'TimeAccuracy', 'DaySinceUpdate', 'HourSinceUpdate'],
        types : ['uint8', 'uint8', 'uint8', 'uint8']
    },
    '0x2a16' : {
        params : ['TimeUpdateControlPoint'],
        types : ['uint8']
    },
    '0x2a17' : {
        params : ['CurrentState', 'Result'],
        types : ['uint8', 'uint8']
    },
    '0x2a18' : {
        params : ['Flags', 'SequenceNumber', 'Year', 'Month', 'Day', 'Hours', 'Minutes', 'Seconds'],
        types : ['uint8', 'uint16', 'uint16', 'uint8', 'uint8', 'uint8', 'uint8', 'uint8'],
        extra: {
            params : ['TimeOffset', 'GlucoseKg', 'GlucoseMol','Type', 'SampleLocation', 'SensorStatus'],
            types : ['int16', 'sfloat', 'sfloat', 'nibble', 'nibble', 'uint16'],
            flags: [0x01, 0x02 + 0x04, 0x02 + 0x04, 0x02, 0x02, 0x08],
            result: [0x01, 0x02, 0x02 + 0x04, 0x02, 0x02, 0x08]
        }
    },
    '0x2a19' : {
        params : ['BatteryLevel'],
        types : ['uint8']
    },
    '0x2a1c' : {
        params : ['Flags'],
        types : ['uint8'],
        extra: {
            params : ['TempC', 'TempF', 'Year', 'Month', 'Day', 'Hours', 'Minutes', 'Seconds', 'TempType'],
            types : ['float', 'float', 'uint16', 'uint8', 'uint8', 'uint8', 'uint8', 'uint8', 'uint8'],
            flags: [0x01, 0x01, 0x02, 0x02, 0x02, 0x02, 0x02, 0x02, 0x04],
            result: [0x00, 0x01, 0x02, 0x02, 0x02, 0x02, 0x02, 0x02, 0x04]
        }
    },
    '0x2a1d' : {
        params : ['TemperatureType'],
        types : ['uint8']
    },
    '0x2a1e' : {
        params : ['Flags'],
        types : ['uint8'],
        extra: {
            params : ['TempC', 'TempF', 'Year', 'Month', 'Day', 'Hours', 'Minutes', 'Seconds', 'TempType'],
            types : ['float', 'float', 'uint16', 'uint8', 'uint8', 'uint8', 'uint8', 'uint8', 'uint8'],
            flags: [0x01, 0x01, 0x02, 0x02, 0x02, 0x02, 0x02, 0x02, 0x04],
            result: [0x00, 0x01, 0x02, 0x02, 0x02, 0x02, 0x02, 0x02, 0x04]
        }
    },
    '0x2a21' : {
        params : ['MeasurementInterval'],
        types : ['uint16']
    },
    '0x2a22' : {
        params : ['BootKeyboardInputReport'],
        types : ['uint8']
    },
    '0x2a23' : {
        params : ['ManufacturerIdentifier', 'OrganizationallyUniqueIdentifier'],
        types : ['addr5', 'addr3']
    },
    '0x2a24' : {
        params : ['ModelNumberString'],
        types : ['string']
    },
    '0x2a25' : {
        params : ['SerialNumberString'],
        types : ['string']
    },
    '0x2a26' : {
        params : ['FirmwareRevisionString'],
        types : ['string']
    },
    '0x2a27' : {
        params : ['HardwareRevisionString'],
        types : ['string']
    },
    '0x2a28' : {
        params : ['SoftwareRevisionString'],
        types : ['string']
    },
    '0x2a29' : {
        params : ['ManufacturerNameString'],
        types : ['string']
    },
    // '0x2a2a' : {
    //     params : ['RegulatoryCertificationDataList'],
    //     types : ['reg-cert-data-list']
    // },
    '0x2a2b' : {
        params : ['Year', 'Month', 'Day', 'Hours', 'Minutes', 'Seconds', 'DayofWeek', 'Fractions256', 'AdjustReason'],
        types : ['uint16', 'uint8', 'uint8', 'uint8', 'uint8', 'uint8', 'uint8', 'uint8', 'uint8']
    },
    '0x2a2c' : {
        params : ['MagneticDeclination'],
        types : ['uint16']
    },
    '0x2a31' : {
        params : ['ScanRefresh'],
        types : ['uint8']
    },
    '0x2a32' : {
        params : ['BootKeyboardOutputReport'],
        types : ['uint8']
    },
    '0x2a33' : {
        params : ['BootMouseInputReport'],
        types : ['uint8']
    },
    '0x2a34' : {
        params : ['Flags', 'SequenceNumber'],
        types : ['uint8', 'uint16'],
        extra: {
            params : ['ExtendedFlags', 'CarbohydrateID', 'Carbohydrate', 'Meal', 'Tester', 'Health', 'ExerciseDuration', 'ExerciseIntensity', 'MedicationID', 'MedicationKg', 'MedicationL', 'HbA1c'],
            types : ['uint8', 'uint8', 'sfloat', 'uint8', 'nibble', 'nibble', 'uint16', 'uint8', 'uint8', 'sfloat', 'sfloat', 'sfloat'],
            flags: [0x80, 0x01, 0x01, 0x02, 0x02, 0x04, 0x08, 0x08, 0x10, 0x10 + 0x20, 0x10 + 0x20, 0x04],
            result: [0x80, 0x01, 0x01, 0x02, 0x02, 0x04, 0x08, 0x08, 0x10, 0x10, 0x10 + 0x20, 0x04]
        }
    },
    '0x2a35' : {
        params : ['Flags'],
        types : ['uint8'],
        extra: {
            params : ['SystolicMmHg', 'DiastolicMmHg', 'MeanArterialPressureMmHg', 'SystolicKPa', 'DiastolicKPa', 'MeanArterialPressureKPa', 'Year', 'Month', 'Day', 'Hours', 'Minutes', 'Seconds', 'PulseRate', 'UserID', 'Status'],
            types : ['sfloat', 'sfloat', 'sfloat', 'sfloat', 'sfloat', 'sfloat', 'uint16', 'uint8', 'uint8', 'uint8', 'uint8', 'uint8', 'sfloat', 'uint8', 'uint16'],
            flags: [0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x02, 0x02, 0x02, 0x02, 0x02, 0x02, 0x04, 0x08, 0x10],
            result: [0x00, 0x00, 0x00, 0x01, 0x01, 0x01, 0x02, 0x02, 0x02, 0x02, 0x02, 0x02, 0x04, 0x08, 0x10]
        }
    },
    '0x2a36' : {
        params : ['Flags'],
        types : ['uint8'],
        extra: {
            params : ['SystolicMmHg', 'DiastolicMmHg', 'MeanArterialPressureMmHg', 'SystolicKPa', 'DiastolicKPa', 'MeanArterialPressureKPa', 'Year', 'Month', 'Day', 'Hours', 'Minutes', 'Seconds', 'PulseRate', 'UserID', 'Status'],
            types : ['sfloat', 'sfloat', 'sfloat', 'sfloat', 'sfloat', 'sfloat', 'uint16', 'uint8', 'uint8', 'uint8', 'uint8', 'uint8', 'sfloat', 'uint8', 'uint16'],
            flags: [0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x02, 0x02, 0x02, 0x02, 0x02, 0x02, 0x04, 0x08, 0x10],
            result: [0x00, 0x00, 0x00, 0x01, 0x01, 0x01, 0x02, 0x02, 0x02, 0x02, 0x02, 0x02, 0x04, 0x08, 0x10]
        }
    },
    '0x2a37' : {
        params : ['Flags'],
        types : ['uint8'],
        extra: {
            params : ['HeartRate8', 'HeartRate16', 'EnergyExpended', 'RRInterval'],
            types : ['uint8', 'uint16', 'uint16', 'uint16'],
            flags: [0x01, 0x01, 0x08, 0x10],
            result: [0x00, 0x01, 0x08, 0x10]
        }
    },
    '0x2a38' : {
        params : ['BodySensorLocation'],
        types : ['uint8']
    },
    '0x2a39' : {
        params : ['HeartRateControlPoint'],
        types : ['uint8']
    },
    '0x2a3f' : {
        params : ['AlertStatus'],
        types : ['uint8']
    },
    '0x2a40' : {
        params : ['RingerControlPoint'],
        types : ['uint8']
    },
    '0x2a41' : {
        params : ['RingerSetting'],
        types : ['uint8']
    },
    '0x2a42' : {
        params : ['CategoryIDBitMask0', 'CategoryIDBitMask0'],
        types : ['uint8', 'uint8']
    },
    '0x2a43' : {
        params : ['CategoryID'],
        types : ['uint8']
    },
    '0x2a44' : {
        params : ['CommandID', 'CategoryID'],
        types : ['uint8', 'uint8']
    },
    '0x2a45' : {
        params : ['CategoryID', 'UnreadCount'],
        types : ['uint8', 'uint8']
    },
    '0x2a46' : {
        params : ['CategoryID', 'NumberOfNewAlert', 'TextStringInfo'],
        types : ['uint8', 'uint8', 'string']
    },
    '0x2a47' : {
        params : ['CategoryIDBitMask0', 'CategoryIDBitMask0'],
        types : ['uint8', 'uint8']
    },
    '0x2a48' : {
        params : ['CategoryIDBitMask0', 'CategoryIDBitMask0'],
        types : ['uint8', 'uint8']
    },
    '0x2a49' : {
        params : ['BloodPressureFeature'],
        types : ['uint16']
    },
    '0x2a4a' : {
        params : ['bcdHID', 'bCountryCode', 'Flags'],
        types : ['uint16', 'uint8', 'uint8']
    },
    '0x2a4b' : {
        params : ['ReportMap'],
        types : ['uint8']
    },
    '0x2a4c' : {
        params : ['HIDControlPoint'],
        types : ['uint8']
    },
    '0x2a4d' : {
        params : ['Report'],
        types : ['uint8']
    },
    '0x2a4e' : {
        params : ['ProtocolMode'],
        types : ['uint8']
    },
    '0x2a4f' : {
        params : ['LEScanInterval', 'LEScanWindow'],
        types : ['uint16', 'uint16']
    },
    '0x2a50' : {
        params : ['VendorIDSource', 'VendorID', 'ProductID', 'ProductVersion'],
        types : ['uint8', 'uint16', 'uint16', 'uint16']
    },
    '0x2a51' : {
        params : ['GlucoseFeature'],
        types : ['uint16']
    },
    '0x2a52' : {
        params : ['OpCode', 'Operator', 'Operand'],
        types : ['uint8', 'uint8', 'uint8']
    },
    '0x2a53' : {
        params : ['Flags', 'Speed', 'Cadence'],
        types : ['uint8', 'uint16', 'uint8'],
        extra: {
            params : [ 'StrideLength', 'TotalDistance'],
            types : ['uint16', 'uint32'],
            flags: [0x01, 0x02],
            result: [0x01, 0x02]
        }
    },
    '0x2a54' : {
        params : ['RSCFeature'],
        types : ['uint16']
    },
    //TODO variable
    // '0x2a55' : {
    //     params : ['Flags'],
    //     types : ['uint8'],
    //     extra: {
    //         params : ['Cumulative', 'SensorLocation', 'ReqOpCode', 'Rsp', 'RspParameter'],
    //         types : ['variable', 'uint8', 'uint8', 'uint8', 'variable'],
    //         flags: [0x01, 0x03, 0x10, 0x10, 0x10],
    //         result: [0x01, 0x03, 0x10, 0x10, 0x10]
    //     }
    // },
    '0x2a56' : {
        params : ['Digital'],
        types : ['bit2']
    },
    '0x2a58' : {
        params : ['Analog'],
        types : ['uint16']
    },
    '0x2a5a' : {
        params : ['InputBits', 'AnalogInput'],
        types : ['bit2', 'uint16']
    },
    '0x2a5b' : {
        params : ['Flags'],
        types : ['uint8'],
        extra: {
            params : ['CumulativeWheelRevolutions', 'LastWheelEventTime', 'CumulativeCrankRevolutions', 'LastCrankEventTime'],
            types : ['uint32', 'uint16', 'uint16', 'uint16'],
            flags: [0x01, 0x01, 0x02, 0x02],
            result: [0x01, 0x01, 0x02, 0x02]
        }
    },
    '0x2a5c' : {
        params : ['CSCFeature'],
        types : ['uint16']
    },
    '0x2a5d' : {
        params : ['SensorLocation'],
        types : ['uint8']
    },
    //TODO Optional
    // '0x2a63' : {
    //     params : ['Flags', 'InstantaneousPower'],
    //     types : ['uint8', 'int16'],
    //     extra: {
    //         params : [],
    //         types : [],
    //         flags: [],
    //         result: []
    //     }
    // },
    //TODO Optional
    // '0x2a64' : {
    //     params : ['Flags'],
    //     types : ['uint8'],
    //     extra: {
    //         params : ['CumulativeCrankRevolutions', 'LastCrankEventTime'],
    //         types : ['uint16', 'uint16'],
    //         flags: [0x01, 0x01],
    //         result: [0x01, 0x01]
    //     }
    // },
    '0x2a65' : {
        params : ['CyclingPowerFeature'],
        types : ['uint32']
    },
    //TODO variable
    // '0x2a66' : {
    //     params : ['Flags'],
    //     types : ['uint8'],
    //     extra: {
    //         params : [],
    //         types : [],
    //         flags: [],
    //         result: []
    //     }
    // },
    //TODO Optional
    // '0x2a67' : {
    //     params : ['Flags'],
    //     types : ['uint8'],
    //     extra: {
    //         params : [],
    //         types : [],
    //         flags: [],
    //         result: []
    //     }
    // },
    //TODO Optional
    // '0x2a68' : {
    //     params : ['Flags'],
    //     types : ['uint8'],
    //     extra: {
    //         params : [],
    //         types : [],
    //         flags: [],
    //         result: []
    //     }
    // },
    //TODO Optional
    // '0x2a69' : {
    //     params : ['Flags'],
    //     types : ['uint8'],
    //     extra: {
    //         params : [],
    //         types : [],
    //         flags: [],
    //         result: []
    //     }
    // },
    '0x2a6a' : {
        params : ['LNFeature'],
        types : ['uint32']
    },
    //TODO Optional
    // '0x2a6b' : {
    //     params : ['Flags'],
    //     types : ['uint8'],
    //     extra: {
    //         params : [],
    //         types : [],
    //         flags: [],
    //         result: []
    //     }
    // },
    '0x2a6c' : {
        params : ['Elevation'],
        types : ['int24']
    },
    '0x2a6d' : {
        params : ['Pressure'],
        types : ['uint32']
    },
    '0x2a6e' : {
        params : ['Temperature'],
        types : ['int16']
    },
    '0x2a6f' : {
        params : ['Humidity'],
        types : ['uint16']
    },
    '0x2a70' : {
        params : ['TrueWindSpeed'],
        types : ['uint16']
    },
    '0x2a71' : {
        params : ['TrueWindDirection'],
        types : ['uint16']
    },
    '0x2a72' : {
        params : ['ApparentWindSpeed'],
        types : ['uint16']
    },
    '0x2a73' : {
        params : ['ApparentWindDirection'],
        types : ['uint16']
    },
    '0x2a74' : {
        params : ['GustFactor'],
        types : ['uint8']
    },
    '0x2a75' : {
        params : ['PollenConcentration'],
        types : ['uint24']
    },
    '0x2a76' : {
        params : ['UVIndex'],
        types : ['uint8']
    },
    '0x2a77' : {
        params : ['Irradiance'],
        types : ['uint16']
    },
    '0x2a78' : {
        params : ['Rainfall'],
        types : ['uint16']
    },
    '0x2a79' : {
        params : ['WindChill'],
        types : ['int8']
    },
    '0x2a7a' : {
        params : ['HeatIndex'],
        types : ['int8']
    },
    '0x2a7b' : {
        params : ['DewPoint'],
        types : ['int8']
    },
    //TODO Environmental Sensing Service
    // '0x2a7d' : {
    //     params : [],
    //     types : [],
    //     extra: {
    //         params : [],
    //         types : [],
    //         flags: [],
    //         result: []
    //     }
    // },
    '0x2a7e' : {
        params : ['AerobicHeartRateLowerLimit'],
        types : ['uint8']
    },
    '0x2a7f' : {
        params : ['AerobicThreshold'],
        types : ['uint8']
    },
    '0x2a80' : {
        params : ['Age'],
        types : ['uint8']
    },
    '0x2a81' : {
        params : ['AnaerobicHeartRateLowerLimit'],
        types : ['uint8']
    },
    '0x2a82' : {
        params : ['AnaerobicHeartRateUpperLimit'],
        types : ['uint8']
    },
    '0x2a83' : {
        params : ['AnaerobicThreshold'],
        types : ['uint8']
    },
    '0x2a84' : {
        params : ['AerobicHeartRateUpperLimit'],
        types : ['uint8']
    },
    '0x2a85' : {
        params : ['Year', 'Month', 'Day'],
        types : ['uint16', 'uint8', 'uint8']
    },
    '0x2a86' : {
        params : ['Year', 'Month', 'Day'],
        types : ['uint16', 'uint8', 'uint8']
    },
    '0x2a87' : {
        params : ['EmailAddress'],
        types : ['string']
    },
    '0x2a88' : {
        params : ['FatBurnHeartRateLowerLimit'],
        types : ['uint8']
    },
    '0x2a89' : {
        params : ['FatBurnHeartRateUpperLimit'],
        types : ['uint8']
    },
    '0x2a8a' : {
        params : ['FirstName'],
        types : ['string']
    },
    '0x2a8b' : {
        params : ['VeryLight_Light', 'Light_Moderate', 'Moderate_Hard', 'Hard_Max'],
        types : ['uint8', 'uint8', 'uint8', 'uint8']
    },
    '0x2a8c' : {
        params : ['Gender'],
        types : ['uint8']
    },
    '0x2a8d' : {
        params : ['HeartRateMax'],
        types : ['uint8']
    },
    '0x2a8e' : {
        params : ['Height'],
        types : ['uint16']
    },
    '0x2a8f' : {
        params : ['HipCircumference'],
        types : ['uint16']
    },
    '0x2a90' : {
        params : ['LastName'],
        types : ['string']
    },
    '0x2a91' : {
        params : ['MaxRecommHeartRate'],
        types : ['uint8']
    },
    '0x2a92' : {
        params : ['RestingHeartRate'],
        types : ['uint8']
    },
    '0x2a93' : {
        params : ['SportType'],
        types : ['uint8']
    },
    '0x2a94' : {
        params : ['Light_Moderate', 'Moderate_Hard'],
        types : ['uint8', 'uint8']
    },
    '0x2a95' : {
        params : ['TwoZoneHeartRateLimit'],
        types : ['uint8']
    },
    '0x2a96' : {
        params : ['VO2Max'],
        types : ['uint8']
    },
    '0x2a97' : {
        params : ['WaistCircumference'],
        types : ['uint16']
    },
    '0x2a98' : {
        params : ['Weight'],
        types : ['uint16']
    },
    '0x2a99' : {
        params : ['DatabaseChangeIncrement'],
        types : ['uint32']
    },
    '0x2a9a' : {
        params : ['UserIndex'],
        types : ['uint8']
    },
    '0x2a9b' : {
        params : ['BodyCompositionFeature'],
        types : ['uint32']
    },
    '0x2a9c' : {
        params : ['Flags', 'BodyFatPercentage'],
        types : ['uint16', 'uint16'],
        extra: {
            params : ['Year', 'Month', 'Day', 'Hours', 'Minutes', 'Seconds', 'UserID', 'BasalMetabolism', 'MusclePercentage', 'MuscleMassKg', 'MuscleMassPounds', 'FatFreeMassKg', 'FatFreeMassPounds', 'SoftLeanMassKg', 'SoftLeanMassPounds', 'BodyWaterMassKg', 'BodyWaterMassPounds', 'Impedance', 'WeightKg', 'WeightPounds', 'HeightMeters', 'HeightInches'],
            types : ['uint16', 'uint8', 'uint8', 'uint8', 'uint8', 'uint8', 'uint8', 'uint16', 'uint16', 'uint16', 'uint16', 'uint16', 'uint16', 'uint16', 'uint16', 'uint16', 'uint16', 'uint16', 'uint16', 'uint16', 'uint16', 'uint16'],
            flags: [0x0002, 0x0002, 0x0002, 0x0002, 0x0002, 0x0002, 0x0004, 0x0008, 0x0010, 0x0021, 0x0021, 0x0041, 0x0041, 0x0081, 0x0081, 0x0101, 0x0101, 0x0200, 0x0401, 0x0401, 0x0801, 0x0801],
            result: [0x0002, 0x0002, 0x0002, 0x0002, 0x0002, 0x0002, 0x0004, 0x0008, 0x0010, 0x0020, 0x0021, 0x0040, 0x0041, 0x0080, 0x0081, 0x0100, 0x0101, 0x0200, 0x0400, 0x0401, 0x0800, 0x0801]
        }
    },
    '0x2a9d' : {
        params : ['Flags'],
        types : ['uint8'],
        extra: {
            params : ['WeightSI', 'WeightImperial', 'Year', 'Month', 'Day', 'Hours', 'Minutes', 'Seconds', 'UserID', 'BMI', 'HeightSI', 'HeightImperial'],
            types : ['uint16', 'uint16', 'uint16', 'uint8', 'uint8', 'uint8', 'uint8', 'uint8', 'uint8', 'uint16', 'uint16', 'uint16'],
            flags: [0x01, 0x01, 0x02, 0x02, 0x02, 0x02, 0x02, 0x02, 0x04, 0x08, 0x08 + 0x01, 0x08 + 0x01],
            result: [0x00, 0x01, 0x02, 0x02, 0x02, 0x02, 0x02, 0x02, 0x04, 0x08, 0x08, 0x08 + 0x01]
        }
    },
    '0x2a9e' : {
        params : ['WeightScaleFeature'],
        types : ['uint32']
    },
    //TODO User Data Service Section
    // '0x2a9f' : {
    //     params : ['Flags'],
    //     types : ['uint8'],
    //     extra: {
    //         params : [],
    //         types : [],
    //         flags: [],
    //         result: []
    //     }
    // },
    '0x2aa0' : {
        params : ['XAxis', 'YAxis'],
        types : ['int16', 'int16']
    },
    '0x2aa1' : {
        params : ['XAxis', 'YAxis', 'ZAxis'],
        types : ['int16', 'int16', 'int16']
    },
    '0x2aa2' : {
        params : ['Language'],
        types : ['string']
    },
    '0x2aa3' : {
        params : ['BarometricPressureTrend'],
        types : ['uint8']
    },
    //TODO variable
    // '0x2aa4' : {
    //     params : ['Flags'],
    //     types : ['uint8'],
    //     extra: {
    //         params : [],
    //         types : [],
    //         flags: [],
    //         result: []
    //     }
    // },
    '0x2aa5' : {
        params : ['BondManagementFeature'],
        types : ['uint24']
    },
    '0x2aa6' : {
        params : ['CentralAddr'],
        types : ['uint8']
    },
    //TODO variable
    // '0x2aa7' : {
    //     params : ['Flags'],
    //     types : ['uint8'],
    //     extra: {
    //         params : [],
    //         types : [],
    //         flags: [],
    //         result: []
    //     }
    // },
    '0x2aa8' : {
        params : ['CGMFeature', 'CGMType', 'CGMSampleLocation', 'E2E_CRC'],
        types : ['uint24', 'nibble', 'nibble', 'uint16']
    },
    //TODO E2E-CRC
    // '0x2aa9' : {
    //     params : ['TimeOffset', 'CGMStatus'],
    //     types : ['uint16', 'uint24'],
    //     extra: {
    //         params : ['E2E_CRC'],
    //         types : ['uint16']
    //     }
    // },
    //TODO E2E-CRC
    // '0x2aaa' : {
    //     params : ['Year', 'Month', 'Day', 'Hours', 'Minutes', 'Seconds', 'TimeZone', 'DSTOffset'],
    //     types : ['uint16', 'uint8', 'uint8', 'uint8', 'uint8', 'uint8', 'int8', 'uint8'],
    //     extra: {
    //         params : ['E2E_CRC'],
    //         types : ['uint16']
    //     }
    // },
    //TODO E2E-CRC
    // '0x2aab' : {
    //     params : ['CGMSessionRunTime'],
    //     types : ['uint16'],
    //     extra: {
    //         params : ['E2E_CRC'],
    //         types : ['uint16']
    //     }
    // },
    //TODO E2E-CRC & variable
    // '0x2aac' : {
    //     params : ['OpCode', 'OpCodeRsp', 'Operand'],
    //     types : ['uint8', 'uint8', 'variable'],
    //     extra: {
    //         params : ['E2E_CRC'],
    //         types : ['uint16']
    //     }
    // },
    '0x2aad' : {
        params : ['IndoorPositioningConfig'],
        types : ['uint8']
    },
    '0x2aae' : {
        params : ['Latitude'],
        types : ['int32']
    },
    '0x2aaf' : {
        params : ['Longitude'],
        types : ['int32']
    },
    '0x2ab0' : {
        params : ['LocalNorthCoordinate'],
        types : ['int16']
    },
    '0x2ab1' : {
        params : ['LocalEastCoordinate'],
        types : ['int16']
    },
    '0x2ab2' : {
        params : ['FloorNumber'],
        types : ['uint8']
    },
    '0x2ab3' : {
        params : ['Altitude'],
        types : ['uint16']
    },
    '0x2ab4' : {
        params : ['Uncertainty'],
        types : ['uint8']
    },
    '0x2ab5' : {
        params : ['LocationName'],
        types : ['string']
    },
    '0x2ab6' : {
        params : ['URI'],
        types : ['string']
    },
    '0x2ab7' : {
        params : ['HTTPHeaders'],
        types : ['string']
    },
    '0x2ab8' : {
        params : ['StatusCode', 'DataStatus'],
        types : ['uint16', 'uint8']
    },
    '0x2ab9' : {
        params : ['HTTPEntityBody'],
        types : ['string']
    },
    '0x2aba' : {
        params : ['HTTPEntityBody'],
        types : ['uint8']
    },
    '0x2abb' : {
        params : ['HTTPSSecurity'],
        types : ['boolean']
    }
    // '0x2abc' : {
    //     params : ['Flags'],
    //     types : ['uint8'],
    //     extra: {
    //         params : [],
    //         types : [],
    //         flags: [],
    //         result: []
    //     }
    // }
};

module.exports = hciCharMeta;
