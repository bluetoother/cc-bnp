var ccbnp = require('./index');

/*ccbnp.init({
        path: '/dev/ttyACM0',
        options: {
            baudRate: 115200,
            rtscts: true,
            flowControl: true
        }
    }, 'central')

ccbnp.on('ready', function (msg) {
	// console.log(msg)
	ccbnp.gap.estLinkReq(0, 0, 0, '0x9059af0b8159').then(function (result) {
		// console.log(result);
		return ccbnp.att.readMultiReq(0, [0x0025, 0x0029]);
	}).then(function (result) {
		console.log(result.collector.AttReadMultiRsp);
	}).done();
});
*/
var value = {
		3: {name: 'TI BLE Keyfob'},
		5: {category: 16},
		7: {flag: true}
	},
	uuids = ['0x2a00', '0x2a01', '0x2a02']
ccbnp.att.readMultiRsp(0, value, uuids);
