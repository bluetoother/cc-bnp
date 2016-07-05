var expect = require('chai').expect,
    _ = require('lodash'),
    ccbnp = require('../index.js'); 

var hci = require('../lib/hci/bleHci');

describe('regTimeoutConfig Signature Check', function () {

    it('should be a function', function () {
        expect(ccbnp.regTimeoutConfig).to.be.a('function');
    });

    it('should throw TypeError if connHdl is not a number', function () {
        expect(function () { return ccbnp.regTimeoutConfig(); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig(undefined, {}); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig(null, {}); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig(NaN, {}); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig('xx', {}); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig([], {}); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig({}, {}); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig(true, {}); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig(new Date(), {}); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig(function () {}, {}); }).to.throw(TypeError);
    });

    it('should throw TypeError if timeoutConfig is not an object', function () {
        expect(function () { return ccbnp.regTimeoutConfig(0); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig(0, undefined); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig(0, null); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig(0, NaN); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig(0, 100); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig(0, 'xx'); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig(0, []); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig(0, true); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig(0, new Date()); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig(0, function () {}); }).to.throw(TypeError);
    });

    it('should throw TypeError if timeoutConfig.level1 is not a number', function () {
        expect(function () { return ccbnp.regTimeoutConfig(0, { level1: null }); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig(0, { level1: NaN }); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig(0, { level1: 'xx' }); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig(0, { level1: [] }); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig(0, { level1: {} }); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig(0, { level1: true }); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig(0, { level1: new Date() }); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig(0, { level1: function () {} }); }).to.throw(TypeError);
    });

    it('should throw TypeError if timeoutConfig.level2 is not a number', function () {
        expect(function () { return ccbnp.regTimeoutConfig(0, { level2: null }); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig(0, { level2: NaN }); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig(0, { level2: 'xx' }); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig(0, { level2: [] }); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig(0, { level2: {} }); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig(0, { level2: true }); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig(0, { level2: new Date() }); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig(0, { level2: function () {} }); }).to.throw(TypeError);
    });

    it('should throw TypeError if timeoutConfig.scan is not a number', function () {
        expect(function () { return ccbnp.regTimeoutConfig(0, { scan: null }); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig(0, { scan: NaN }); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig(0, { scan: 'xx' }); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig(0, { scan: [] }); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig(0, { scan: {} }); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig(0, { scan: true }); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig(0, { scan: new Date() }); }).to.throw(TypeError);
        expect(function () { return ccbnp.regTimeoutConfig(0, { scan: function () {} }); }).to.throw(TypeError);
    });

    it('should not throw TypeError', function () {
        expect(function () { return ccbnp.regTimeoutConfig(0, {}); }).not.to.throw(TypeError); 
        expect(function () { return ccbnp.regTimeoutConfig(0, { level1: 100 }); }).not.to.throw(TypeError); 
        expect(function () { return ccbnp.regTimeoutConfig(0, { level2: 100 }); }).not.to.throw(TypeError); 
        expect(function () { return ccbnp.regTimeoutConfig(0, { scan: 100 }); }).not.to.throw(TypeError); 
    });
});

describe('regTimeoutConfig Functional Check', function () {
    it('regTimeoutConfig()', function (done) {
        var table = {
            level1: 5000,
            level2: 8000,
            scan: 10000
        };

        ccbnp.regTimeoutConfig(0, table);

        if (_.isEqual(hci.timeoutCfgTable[0], table))
            done();     
    });
});
