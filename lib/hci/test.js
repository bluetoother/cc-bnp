var charDiscrim = require('./HciCharDiscriminator'),
	charBuilder = require('./HciCharBuilder');

var charObj = {ManufacturerIdentifier: '0x0405060708' ,OrganizationallyUniqueIdentifier: '0x010203'};

var a = charBuilder('0x2a23').transToValObj(charObj).getHciCharBuf();

console.log(a);

var b = charDiscrim('0x2a23');

b.getCharValPacket(a, function (err, result) {
	if (err) console.log(err);
	else console.log(result);
});