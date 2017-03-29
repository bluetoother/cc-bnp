var _ = require('busyman'),
    ccBnp = require('../index.js');

var cfg = {
    path: '/dev/ttyACM0',
    options: {
        baudRate: 115200
    }   
};

ccBnp.on('ready', function(result) {
    ccBnp.gap.deviceDiscReq(3, 1, 0).then(function (result) {
        if (result.collector.GapDeviceInfo) 
            return ccBnp.gap.estLinkReq(1, 0, 0, result.collector.GapDeviceInfo[0].addr);
    }).then(function (result) {
        if (result)
            return ccBnp.gatt.readCharValue(result.collector.GapLinkEstablished[0].connHandle, 0x0003, '0x2a00');
    }).then(function (result) {
        if (result)
            console.log('Device Name: ' + result.collector.AttReadRsp[0].value.name);
    }).fail(function (err) {
        console.log(err);
    });
});

ccBnp.on('ind', function(msg){
    switch (msg.type) {
        case 'linkEstablished':
            console.log(' ');
            console.log('----Event: linkEstablished----');
            console.log(msg);
            console.log(' ');
            break;
        case 'linkTerminated':
            console.log(' ');
            console.log('----Event: linkTerminated----');
            console.log(msg);
            console.log(' ');
            break;
        case 'linkParamUpdate':
            console.log(' ');
            console.log('----Event: linkParamUpdate----');
            console.log(msg);
            console.log(' ');
            break;
        case 'attNoti':
            console.log(' ');
            console.log('----Event: attNoti----');
            console.log(msg);
            console.log(' ');
            break;
        case 'attInd':
            console.log(' ');
            console.log('----Event: attInd----');
            console.log(msg);
            console.log(' ');
            break;
        default:
            break;
    }

});

ccBnp.init(cfg, 'central');
