var util = require('util'),
    EventEmitter = require('events').EventEmitter,
    SerialPort = require('serialport').SerialPort,
    Dissolve = require('dissolve'),
    Concentrate = require('concentrate'),
    BHCI = require('../defs/blehcidefs');

var FP = function () {
    var concentrate = Concentrate();

    this.sp = null; 
    this.parser = Dissolve().loop(function (end) { 
        this.uint8('pktType').uint8('evtCode').uint8('paramLens').uint16le('opcode').tap(function () {
            this.buffer('data', this.vars.paramLens - 2);
        }).tap(function () {
            this.push(this.vars);
            this.vars = {};
        });
    });

    this.pipeToSp = function () {
        if (!this.sp) { throw new Error('serialport must be registered first') }

        concentrate.pipe(this.sp);
    };

    this.flushData = function (bBuffer) {
        if (!Buffer.isBuffer(bBuffer)) { throw new TypeError('bBuffer must be a buffer') }
            
        concentrate.buffer(bBuffer).flush();
    };
};

util.inherits(FP, EventEmitter);
var fp = new FP();


FP.prototype.registerSp = function(sp) {
    if (!sp instanceof SerialPort) { 
        throw new TypeError('serialport object must be an instance of the SerialPort'); 
    }

    this.sp = sp;
    this.sp.pipe(this.parser);
    this.pipeToSp();
};

/*************************************************************************************************/
/*** Event Listener                                                                            ***/
/*************************************************************************************************/
fp.on('HCI:CMD', fpHciCmdHandler);

fp.parser.on('data', spDataHandler);

/*************************************************************************************************/
/*** Event Handler                                                                             ***/
/*************************************************************************************************/
function fpHciCmdHandler (msg) {
	var opcode, 
        cmdPacket;

	opcode = ( msg.group ) << 10 | 
			 ( msg.subGroup ) << 7 | 
			 ( msg.cmdId );
             
	cmdPacket = Concentrate().uint8(BHCI.PacketType.CMD).uint16le(opcode).uint8(msg.len).buffer(msg.data).result();
	fp.flushData(cmdPacket);
}

function spDataHandler (bpacket) {
    var opcode = bpacket.opcode,
        evtMsg = {
            evtCode: bpacket.evtCode,
            group: null,
            subGroup: null,
            evtID: null,
            len: bpacket.paramLens,
            data: bpacket.data
        };

    evtMsg.group = ( opcode & BHCI.EvtOpcodeMask.EOGF.value ) >> 10;
    evtMsg.subGroup = ( opcode & BHCI.EvtOpcodeMask.ESG.value ) >> 7;
    evtMsg.evtID = ( opcode & BHCI.EvtOpcodeMask.Evt.value );

    fp.emit('HCI:EVT', evtMsg);
}

module.exports = fp;