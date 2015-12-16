var charDiscrim = require('./HciCharDiscriminator'),
	charBuilder = require('./HciCharBuilder');

var charObj = {
        OpCode: 1,
        Cumulative: 10
	};

var a = charBuilder('0x2a55').transToValObj(charObj).getHciCharBuf();

console.log(a);

var b = charDiscrim('0x2a55');

b.getCharValPacket(a, function (err, result) {
	if (err) console.log(err);
	else console.log(result);
});