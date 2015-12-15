var charDiscrim = require('./HciCharDiscriminator'),
	charBuilder = require('./HciCharBuilder');

var charObj = {
        Elevation: -12358,
	};

var a = charBuilder('0x2a6c').transToValObj(charObj).getHciCharBuf();

console.log(a);

var b = charDiscrim('0x2a6c');

b.getCharValPacket(a, function (err, result) {
	if (err) console.log(err);
	else console.log(result);
});