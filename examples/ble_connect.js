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
            ccBnp.gap.estLinkReq(0, 0, 0, result[1].GapDeviceInfo0.addr, function (err, result) {
                if (err) console.log(err);
                ccBnp.att.readReq(result[1].GapLinkEstablished.connHandle, 3).then(function (result) {
                    console.log(result[1].AttReadRsp);
                }).fail(function (err) {
                    console.log(err);
                });

                // ccBnp.att.writeReqWithUuid(result[1].GapLinkEstablished.connHandle, 0, 0, 37, {Flags: 2, TempC: 28.75, Year: 1991, Month: 9, Day: 17, Hours: 22, Minutes: 32, Seconds: 11}, '0x2a1c').then(function (result) {
                //     console.log(result);
                //     return ccBnp.att.readReqWithUuid(result[1].AttWriteRsp.connHandle, 37, '0x2a1c');
                // }).then(function (result) {
                //     console.log(result[1].AttReadRsp);
                // }).fail(function (err) {
                //     console.log(err);
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
