var charDiscrim = require('../lib/hci/HciCharDiscriminator'),
	charBuilder = require('../lib/hci/HciCharBuilder');

var charObj = {ManufacturerIdentifier: '0x0405060708' ,OrganizationallyUniqueIdentifier: '0x010203'};

var a = charBuilder('0x2a23').transToValObj(charObj).getHciCharBuf();

console.log(a);

var b = charDiscrim('0x2a23');

b.getCharValPacket(a).then(function (result) {
	console.log(result);
});

var evtChar = charDiscrim('0x2a23').getCharValPacket(a).then(function (result) {
                    console.log(result);      
            });