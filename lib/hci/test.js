var charDiscrim = require('./HciCharDiscriminator'),
	charBuilder = require('./HciCharBuilder');

var charObj = {
    Flags: 15,   //bit0 = 1, bit1 = 1, bit2 = 1, bit3 = 1
    SequenceNumber: 1, 
    Year: 2015, 
    Month: 12, 
    Day: 22, 
    Hours: 18, 
    Minutes: 37, 
    Seconds: 41,
    TimeOffset: 0,
    GlucoseMol: 0.0068,
    Type: 1,
    SampleLocation: 1, 
    SensorStatus: 0
    };

var a = charBuilder('0x2a18').transToValObj(charObj).getHciCharBuf();

console.log(a);

var b = charDiscrim('0x2a18');

b.getCharValPacket(a, function (err, result) {
	if (err) console.log(err);
	else console.log(result);
});