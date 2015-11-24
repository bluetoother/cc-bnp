var ccBnp = require('../index.js');

var cfg = {
    path: '/dev/ttyACM0',
    options: {
        baudRate: 115200
    }   
};

ccBnp.on('ready', function(result) {
    console.log(result);
    ccBnp.gap.deviceDiscReq(3, 1, 0, function(err, result) {
        console.log(result);
        if (result[1].GapDeviceInfo0) {
            ccBnp.gap.estLinkReq(0, 0, 0, '0x9059af0b8159', function (err, result) {    //'0x9059af0b8159'  '0x78c5e5707a06'
                if (err) console.log(err);
                // ccBnp.gatt.writeCharValue(result[1].GapLinkEstablished.connHandle, 0xaa01, {Flags: 2, TempC: 25.6, Year: 2015, Month: 12, Day: 10, Hours: 18, Minutes: 37, Seconds: 41}).then(function (result) {
                //     console.log(result[1]);
                // }).fail(function (err) {
                //     console.log(err);
                // });

                // ccBnp.att.findByTypeValueReq(0, 11, '0x2902').then(function (result) {
                //     console.log(result);
                // }).fail(function (err) {
                //     console.log(err);
                // });

                ccBnp.att.writeReq(0, 0, 0, 38, new Buffer([0x01, 0x00])).then(function (result) {
                    console.log(result);
                    return ccBnp.att.writeReq(0, 0, 0, 41, new Buffer([0x01]));
                }).then(function (result) {
                    console.log(result);
                }).fail(function (err) {
                    console.log(err);
                });

                // ccBnp.gatt.readCharValue(0, 18, '0x2a23', function (err, result) {
                //     console.log(result);
                //     ccBnp.gatt.readCharValue(0, 18, '0x2a23', function (err, result) {
                //         console.log(result);
                //     });
                // });
            });
        }
    });

    // ccBnp.gap.linkTerminated(0xFFFE, 0x05).then(function (result) {
    //     console.log(result);
    // });
});

ccBnp.on('ind', function(msg){
    switch (msg.type) {
        case 'linkEstablished':
            console.log(msg);
            console.log(' ');
            break;
        case 'linkTerminated':
            console.log(msg);
            console.log(' ');
            break;
        case 'linkParamUpdate':
            console.log(msg);
            console.log(' ');
            break;
        case 'attNoti':
            console.log(msg);
            console.log(' ');
            break;
        case 'attInd':
            console.log(msg);
            console.log(' ');
            break;
        default:
            break;
    }

});

ccBnp.init(cfg, 'central');
