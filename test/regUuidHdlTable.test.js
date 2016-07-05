var expect = require('chai').expect,
    _ = require('lodash'),
    ccbnp = require('../index.js'); 

var hci = require('../lib/hci/bleHci');

describe('regUuidHdlTable Signature Check', function () {

    it('should be a function', function () {
        expect(ccbnp.regUuidHdlTable).to.be.a('function');
    });

    it('should throw TypeError if connHdl is not a number', function () {
        expect(function () { return ccbnp.regUuidHdlTable(); }).to.throw(TypeError);
        expect(function () { return ccbnp.regUuidHdlTable(undefined, {}); }).to.throw(TypeError);
        expect(function () { return ccbnp.regUuidHdlTable(null, {}); }).to.throw(TypeError);
        expect(function () { return ccbnp.regUuidHdlTable(NaN, {}); }).to.throw(TypeError);
        expect(function () { return ccbnp.regUuidHdlTable('xx', {}); }).to.throw(TypeError);
        expect(function () { return ccbnp.regUuidHdlTable([], {}); }).to.throw(TypeError);
        expect(function () { return ccbnp.regUuidHdlTable({}, {}); }).to.throw(TypeError);
        expect(function () { return ccbnp.regUuidHdlTable(true, {}); }).to.throw(TypeError);
        expect(function () { return ccbnp.regUuidHdlTable(new Date(), {}); }).to.throw(TypeError);
        expect(function () { return ccbnp.regUuidHdlTable(function () {}, {}); }).to.throw(TypeError);
    });

    it('should throw TypeError if uuidHdlTable is not an object', function () {
        expect(function () { return ccbnp.regUuidHdlTable(0); }).to.throw(TypeError);
        expect(function () { return ccbnp.regUuidHdlTable(0, undefined); }).to.throw(TypeError);
        expect(function () { return ccbnp.regUuidHdlTable(0, null); }).to.throw(TypeError);
        expect(function () { return ccbnp.regUuidHdlTable(0, NaN); }).to.throw(TypeError);
        expect(function () { return ccbnp.regUuidHdlTable(0, 100); }).to.throw(TypeError);
        expect(function () { return ccbnp.regUuidHdlTable(0, 'xx'); }).to.throw(TypeError);
        expect(function () { return ccbnp.regUuidHdlTable(0, []); }).to.throw(TypeError);
        expect(function () { return ccbnp.regUuidHdlTable(0, true); }).to.throw(TypeError);
        expect(function () { return ccbnp.regUuidHdlTable(0, new Date()); }).to.throw(TypeError);
        expect(function () { return ccbnp.regUuidHdlTable(0, function () {}); }).to.throw(TypeError);
    });

    it('should not throw TypeError', function () {
        expect(function () { return ccbnp.regUuidHdlTable(0, {}); }).not.to.throw(TypeError);
    });


});

describe('regUuidHdlTable Functional Check', function () {
    it('regUuidHdlTable()', function (done) {
        var table = {
                3: '0x2a00',
                5: '0x2a01'
            };

        ccbnp.regUuidHdlTable(0, table);

        if (_.isEqual(hci.uuidHdlTable[0], table))
            done();
    });
});
