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
        console.log(' ');
        if (result[1].GapDeviceInfo0) {
            ccBnp.gap.estLinkReq(0, 0, 0, result[1].GapDeviceInfo0.addr, function (err, result) {
                if (err) throw err;
                ccBnp.gap.deviceDiscReq(3, 1, 0).then(function (result) {
                    console.log(result);
                });
            });
        }
    });
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
