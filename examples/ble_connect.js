var ccBnp = require('../index.js');

var cfg = {
    path: '/dev/ttyACM0',
    options: {
        baudRate: 115200
    }   
};

ccBnp.on('ready', function(result) {
    //console.log(result);
    
    ccBnp.gap.deviceDiscReq(3, 1, 0, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result[1]);
            if (result[1].GapDeviceInfo0) {
                ccBnp.gap.estLinkReq(0, 0, 0, '0x78c5e5707a06', function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        ccBnp.gatt.readCharValue(result[1].GapLinkEstablished.connHandle, 37, 10780, function (err, result) {
                            if (err) console.log(err);
                            else console.log(result[1]);
                        });
                    }
                });
            }
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
