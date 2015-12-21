var charDiscrim = require('./HciCharDiscriminator'),
	charBuilder = require('./HciCharBuilder');

var charObj = {
	   //0x2a1c instance object
	    Flags: 2, 
	    TempC: 21.5, 
	    Year: 2015, 
	    Month: 12, 
	    Day: 25, 
	    Hours: 21, 
	    Minutes: 36, 
	    Seconds: 12, 
	};

var a = charBuilder('0x2a1c').transToValObj(charObj).getHciCharBuf();

console.log(a);

var b = charDiscrim('0x2a1c');

b.getCharValPacket(a, function (err, result) {
	if (err) console.log(err);
	else console.log(result);
});