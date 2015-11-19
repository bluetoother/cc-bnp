var charDiscrim = require('./HciCharDiscriminator'),
	charBuilder = require('./HciCharBuilder');

var charObj = {Properties: 0x01, Handle: 0x0025, UUID: '0x2a03'};

var a = charBuilder('0x2803').transToValObj(charObj).getHciCharBuf();

console.log(a);

var b = charDiscrim('0x2803');

b.getCharValPacket(a, function (err, result) {
	if (err) console.log(err);
	else console.log(result);
});