var expect = require('chai').expect,
    _ = require('lodash'),
    ccbnp = require('../index.js'); 

var blePacket = require('ble-packet');

describe('regChar Signature Check', function () {

    it('should be a function', function () {
        expect(ccbnp.regChar).to.be.a('function');
    });

    it('should throw TypeError if regObj is not an object', function () {
        expect(function () { return ccbnp.regChar(); }).to.throw(TypeError); 
        expect(function () { return ccbnp.regChar(undefined); }).to.throw(TypeError);
        expect(function () { return ccbnp.regChar(null); }).to.throw(TypeError);
        expect(function () { return ccbnp.regChar(NaN); }).to.throw(TypeError);
        expect(function () { return ccbnp.regChar(100); }).to.throw(TypeError);
        expect(function () { return ccbnp.regChar('xx'); }).to.throw(TypeError);
        expect(function () { return ccbnp.regChar([]); }).to.throw(TypeError);
        expect(function () { return ccbnp.regChar(true); }).to.throw(TypeError);
        expect(function () { return ccbnp.regChar(new Date()); }).to.throw(TypeError);
        expect(function () { return ccbnp.regChar(function () {}); }).to.throw(TypeError);
    });

    it('should throw TypeError if regObj.uuid is not a string', function () {
        expect(function () { return ccbnp.regChar({}); }).to.throw(TypeError); 
        expect(function () { return ccbnp.regChar({ uuid: undefined, params: [], types: [] }); }).to.throw(TypeError);
        expect(function () { return ccbnp.regChar({ uuid: null, params: [], types: [] }); }).to.throw(TypeError);
        expect(function () { return ccbnp.regChar({ uuid: NaN, params: [], types: [] }); }).to.throw(TypeError);
        expect(function () { return ccbnp.regChar({ uuid: [], params: [], types: [] }); }).to.throw(TypeError);
        expect(function () { return ccbnp.regChar({ uuid: {}, params: [], types: [] }); }).to.throw(TypeError);
        expect(function () { return ccbnp.regChar({ uuid: true, params: [], types: [] }); }).to.throw(TypeError);
        expect(function () { return ccbnp.regChar({ uuid: new Date(), params: [], types: [] }); }).to.throw(TypeError);
        expect(function () { return ccbnp.regChar({ uuid: function () {}, params: [], types: [] }); }).to.throw(TypeError);
    });

    it('should throw TypeError if regObj.params is not an array', function () {
        expect(function () { return ccbnp.regChar({ uuid: '0x2000' }); }).to.throw(Error); 
        expect(function () { return ccbnp.regChar({ uuid: '0x2000', params: undefined, types: [] }); }).to.throw(Error);
        expect(function () { return ccbnp.regChar({ uuid: '0x2000', params: null, types: [] }); }).to.throw(Error);
        expect(function () { return ccbnp.regChar({ uuid: '0x2000', params: NaN, types: [] }); }).to.throw(Error);
        expect(function () { return ccbnp.regChar({ uuid: '0x2000', params: 100, types: [] }); }).to.throw(Error);
        expect(function () { return ccbnp.regChar({ uuid: '0x2000', params: 'xx', types: [] }); }).to.throw(Error);
        expect(function () { return ccbnp.regChar({ uuid: '0x2000', params: {}, types: [] }); }).to.throw(Error);
        expect(function () { return ccbnp.regChar({ uuid: '0x2000', params: true, types: [] }); }).to.throw(Error);
        expect(function () { return ccbnp.regChar({ uuid: '0x2000', params: new Date(), types: [] }); }).to.throw(Error);
        expect(function () { return ccbnp.regChar({ uuid: '0x2000', params: function () {}, types: [] }); }).to.throw(Error);
    });

    it('should throw TypeError if regObj.types is not an array', function () {
        expect(function () { return ccbnp.regChar({ uuid: '0x2000', params: [] }); }).to.throw(Error); 
        expect(function () { return ccbnp.regChar({ uuid: '0x2000', params: [], types: undefined }); }).to.throw(Error);
        expect(function () { return ccbnp.regChar({ uuid: '0x2000', params: [], types: null }); }).to.throw(Error);
        expect(function () { return ccbnp.regChar({ uuid: '0x2000', params: [], types: NaN }); }).to.throw(Error);
        expect(function () { return ccbnp.regChar({ uuid: '0x2000', params: [], types: 100 }); }).to.throw(Error);
        expect(function () { return ccbnp.regChar({ uuid: '0x2000', params: [], types: 'xx' }); }).to.throw(Error);
        expect(function () { return ccbnp.regChar({ uuid: '0x2000', params: [], types: true }); }).to.throw(Error);
        expect(function () { return ccbnp.regChar({ uuid: '0x2000', params: [], types: new Date() }); }).to.throw(Error);
        expect(function () { return ccbnp.regChar({ uuid: '0x2000', params: [], types: function () {} }); }).to.throw(Error);
    });

    it('should not throw TypeError', function () {
        expect(function () { return ccbnp.regChar({ uuid: '0x2000', params: [], types:[] }); }).not.to.throw(Error); 
    });
});

describe('regChar Functional Check', function () {
    it('regChar()', function (done) {
        var regObj = {
            uuid: '0xfff1',
            params: [ 'foo', 'bar' ],
            types: [ 'uint8', 'uint16' ]
        };

        ccbnp.regChar(regObj);

        blePacket.parse('0xfff1', new Buffer([0x01, 0x00, 0x02]), function (err, result) {
            if (_.isEqual(result, { foo: 1, bar: 512}))
                done();
        });
    });
});
