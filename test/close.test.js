var expect = require('chai').expect,
    util = require('util'),
	EventEmitter = require('events').EventEmitter,
    ccbnp = require('../index.js'); 

var rawUnit = require('../lib/hci/bleRawUnit');

describe('close Signature Check', function () {
    it('should be a function', function () {
        expect(ccbnp.close).to.be.a('function');
    });
});

describe('close Functional Check', function () {
    it('close()', function (done) {
        function Sp() {
            this.close = function () {
                this.emit('close');
            };
        }
        util.inherits(Sp, EventEmitter);

        ccbnp.on('closed', function () {
            done();
        });

        rawUnit.sp = new Sp();

        ccbnp.close({ path: '/dev/ttyUSB0' }, 'peripheral');
    });
});