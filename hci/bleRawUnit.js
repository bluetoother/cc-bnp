'use strict';

var Q = require('q'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter,
    SerialPort = require('serialport').SerialPort,
    Dissolve = require('dissolve'),
    Concentrate = require('concentrate'),
    BHCI = require('../defs/blehcidefs');

// [TODO] Lack of serial port open/close functionalities
var BleRawUint = function () {
    var spinLock = false,
        closed = true;

    this.sp = null; 
    // parser only deals with Vendor-Specific Events:
    //  [ pktType(1), evtCode(1), paramLens(1), evtOpcode(2) ]
    this.parser = Dissolve().loop(function (end) { 
        this.uint8('pktType').uint8('evtCode').uint8('paramLens').uint16le('opcode').tap(function () {
            this.buffer('data', this.vars.paramLens - 2);
        }).tap(function () {
            this.push(this.vars);
            this.vars = {};
        });
    });

    this.lockSpin = function () {
        spinLock = true;
    };

    this.unlockSpin = function () {
        spinLock = false;
    };

    this.isSpining = function () {  
        return spinLock;
    };

    this.isClosed = function () {
        return closed;
    };

    this.setSpState = function (state) {
        if (state === 'CLOSED') {
            closed = true;
        } else if (state === 'OPENED') {
            closed = false;
        }
    };
};

util.inherits(BleRawUint, EventEmitter);
var bleRawUint = new BleRawUint();

BleRawUint.prototype.registerSp = function (sp) {
    if (!sp instanceof SerialPort) { throw new TypeError('serialport object must be an instance of the SerialPort'); }
    this.sp = sp;
    this.sp.pipe(this.parser);
};

BleRawUint.prototype.sendCmd = function (msg, callback) {
    var self = this,
        deferred = Q.defer(),
        tmOut,
        opcode = (msg.group) | (msg.subGroup) | (msg.cmdId),
        cmdPacket = Concentrate();

    if (this.isSpining()) { 
        deferred.resolve('busy'); 
    } else if (!this.sp) {
        deferred.reject(new Error('serialport must be registered first'));
    } else {
        this.lockSpin();

        cmdPacket = cmdPacket.uint8(BHCI.PacketType.CMD).uint16le(opcode).uint8(msg.len).buffer(msg.data).result();

        this.sp.write(cmdPacket, function () {
            // if sp is not unlocked after written in 2 seconds, giveup this transmission and release it
            tmOut = setTimeout(function() {
                self.unlockSpin();
                deferred.resolve('success');
            }, 2000);

            self.sp.drain(function () {
                clearTimeout(tmOut);
                self.unlockSpin();  //-- end of critical section
                deferred.resolve('success');
            });
        });
    }
    return deferred.promise.nodeify(callback);
};

BleRawUint.prototype.openSp = function (callback) {
    var self = this,
        deferred = Q.defer();

    this.sp.once('open', function () {
        console.log('The serialport ' + self.sp.path + ' is opened.');
        console.log('>> Bluetooth Server is starting...');
        console.log(' ');
    });

    this.sp.open(function (err) {
        if (err) { console.log('Failed to open: ' + err); }

        self.setSpState('OPENED');

        self.sp.on('error', function () {
            if (!self.isClosed()) {
                self.close();
            }
        });

        // Event Listener
        self.parser.on('data', spDataHandler);

        deferred.resolve();
    });

    return deferred.promise.nodeify(callback);
};

BleRawUint.prototype.closeSp = function (callback) {
    var self = this,
        deferred = Q.defer();

    if (!this.isClosed()) {
        this.sp.close();
    } else {
        deferred.resolve();
    }

    this.sp.on('close', function () {
        self.setSpState('CLOSED');
        self.sp.flush(function () {    
            console.log('The serialport ' + self.sp.path + ' is closed.');
        });
        deferred.resolve();
    });

    return deferred.promise.nodeify(callback);
};
// bleRawUint.parser.on('data', spDataHandler); //TODO
/*************************************************************************************************/
/*** Event Handler                                                                             ***/
/*************************************************************************************************/
function spDataHandler (pkt) {
    var opcode = pkt.opcode,
        evtMsg = {
            evtCode: pkt.evtCode,
            group: opcode & BHCI.EvtOpcodeMask.EOGF.value,
            subGroup: opcode & BHCI.EvtOpcodeMask.ESG.value,
            evtId: opcode & BHCI.EvtOpcodeMask.Evt.value,
            len: pkt.paramLens,
            data: pkt.data
        };

    if (evtMsg.evtCode === BHCI.EvtCode.VENDOR_SPECIFIC.value) {
        bleRawUint.emit('HCI:EVT', evtMsg);
    }
}

module.exports = bleRawUint;
