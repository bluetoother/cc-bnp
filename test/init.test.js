var expect = require('chai').expect,
    Q = require('q'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter,
    ccbnp = require('../index.js'); 

var rawUnit = require('../lib/hci/bleRawUnit');

describe('init Signature Check', function () {

    it('should be a function', function () {
        expect(ccbnp.init).to.be.a('function');
    });

    it('should throw TypeError if config is not an object', function () {
        expect(function () { return ccbnp.init(); }).to.throw(TypeError);
        expect(function () { return ccbnp.init(undefined, 'peripheral'); }).to.throw(TypeError);
        expect(function () { return ccbnp.init(null, 'peripheral'); }).to.throw(TypeError);
        expect(function () { return ccbnp.init(NaN, 'peripheral'); }).to.throw(TypeError);
        expect(function () { return ccbnp.init(100, 'peripheral'); }).to.throw(TypeError);
        expect(function () { return ccbnp.init('xx', 'peripheral'); }).to.throw(TypeError);
        expect(function () { return ccbnp.init([], 'peripheral'); }).to.throw(TypeError);
        expect(function () { return ccbnp.init(true, 'peripheral'); }).to.throw(TypeError);
        expect(function () { return ccbnp.init(new Date(), 'peripheral'); }).to.throw(TypeError);
        expect(function () { return ccbnp.init(function () {}, 'peripheral'); }).to.throw(TypeError);
    });

    it('should throw TypeError if config.path is not a string', function () {
        expect(function () { return ccbnp.init({}, 'peripheral'); }).to.throw(TypeError);
        expect(function () { return ccbnp.init({ path: undefined }, 'peripheral'); }).to.throw(TypeError);
        expect(function () { return ccbnp.init({ path: null }, 'peripheral'); }).to.throw(TypeError);
        expect(function () { return ccbnp.init({ path: NaN }, 'peripheral'); }).to.throw(TypeError);
        expect(function () { return ccbnp.init({ path: 100 }, 'peripheral'); }).to.throw(TypeError);
        expect(function () { return ccbnp.init({ path: [] }, 'peripheral'); }).to.throw(TypeError);
        expect(function () { return ccbnp.init({ path: {} }, 'peripheral'); }).to.throw(TypeError);
        expect(function () { return ccbnp.init({ path: true }, 'peripheral'); }).to.throw(TypeError);
        expect(function () { return ccbnp.init({ path: new Date() }, 'peripheral'); }).to.throw(TypeError);
        expect(function () { return ccbnp.init({ path: function () {} }, 'peripheral'); }).to.throw(TypeError);
    });

    it('should throw TypeError if config.options is not an object or undefined', function () {
        expect(function () { return ccbnp.init({ path: 'xx', options: null }, 'peripheral'); }).to.throw(TypeError);
        expect(function () { return ccbnp.init({ path: 'xx', options: NaN }, 'peripheral'); }).to.throw(TypeError);
        expect(function () { return ccbnp.init({ path: 'xx', options: 100 }, 'peripheral'); }).to.throw(TypeError);
        expect(function () { return ccbnp.init({ path: 'xx', options: 'yy' }, 'peripheral'); }).to.throw(TypeError);
        expect(function () { return ccbnp.init({ path: 'xx', options: [] }, 'peripheral'); }).to.throw(TypeError);
        expect(function () { return ccbnp.init({ path: 'xx', options: true }, 'peripheral'); }).to.throw(TypeError);
        expect(function () { return ccbnp.init({ path: 'xx', options: new Date() }, 'peripheral'); }).to.throw(TypeError);
        expect(function () { return ccbnp.init({ path: 'xx', options: function () {} }, 'peripheral'); }).to.throw(TypeError);
    });

    it('should not throw TypeError', function () {
        expect(function () { return ccbnp.init({ path: '/dev/ttyUSB0' }, 'peripheral'); }).not.to.throw(TypeError);
        expect(function () { return ccbnp.init({ path: '/dev/ttyUSB0', options: {} }, 'peripheral'); }).not.to.throw(TypeError);
    });
});

describe('init Functional Check', function () {
    it('Functional Check', function (done) {
        function Sp() {
            this.open = function (callback) {
                callback(null);
            };
        }
        util.inherits(Sp, EventEmitter);

        ccbnp.on('ready', function () {
            done();
        });

        rawUnit.registerSp = function () { this.sp = new Sp(); };

        ccbnp.gap.deviceInit = function (a, b, c, d, e, callback) {
            var deferred = Q.defer();
            deferred.resolve( { collector: { GapDeviceInitDone: { 0: 'xx' }}});
            return deferred.promise.nodeify(callback);
        };

        ccbnp.init({ path: '/dev/ttyUSB0' }, 'peripheral', function (err, result) {});
    });
});
