'use strict';

var Q = require('q'),
    _ = require('lodash'),
    Enum = require('enum'),
    DChunks = require('dissolve-chunks'),
    ru = DChunks().Rule(),
    util = require('util'),
    EventEmitter = require('events').EventEmitter;

var charMeta = require('./HciCharMeta');

// var hciCharDiscriminator = {
// };

// (function () {
//     _.forEach(charMeta, function (meta, uuid) {
//         hciCharDiscriminator[uuid] = function () {
//             return ValObj.factory(uuid, arguments);
//         };
//     });
// })();

function hciCharDiscriminator (uuid) {
    return ValObj.factory(uuid);
}

function ValObj() {
}

util.inherits(ValObj, EventEmitter);

ValObj.factory = function (uuid) {
    var charValsMeta = charMeta[uuid];
    
    if (!charValsMeta) {
        ValObj[uuid] = function () {
            this.uuid = uuid;
        };
    } else {
        ValObj[uuid] = function () {
            this.uuid = uuid;
            ValObj[uuid].charVals = ValObj[uuid].charVals || charValsMeta;
        };
    }

    if (!_.isFunction(ValObj[uuid].prototype.getCharVals)) {
        ValObj[uuid].prototype = new ValObj();
    }

    return new ValObj[uuid]();
};

ValObj.prototype.getCharVals = function () {
    return this.constructor[this.uuid].charVals;
};

ValObj.prototype.getCharValPacket = function (bBuf, callback) {
    var self = this,
        deferred = Q.defer(),
    	charVals = this.getCharVals(),
        chunkRules = [],
        extChunkRules = [],
        parser,
        nibbleBuf = [];

    if (!charVals) {
        deferred.resolve(bBuf);
    } else {
        _.forEach(charVals.params, function (param, idx) {
            var valType = charVals.types[idx];

            if ( valType === 'string') {
                chunkRules.push(ru.string(param, bBuf.length));
            } else if (_.startsWith(valType, 'addr')) {
                chunkRules.push(ru.addr(param, _.parseInt(valType.slice(4))));
            } else if ( valType === 'nibble') {
                nibbleBuf.push(param);
                if (nibbleBuf.length === 2) {
                    chunkRules.push(ru[valType](nibbleBuf[0], nibbleBuf[1]));
                }
            } else {
                chunkRules.push(ru[valType](param));
            }
        });

        if (charVals.extra) extChunkRules = buildExtraCharValsRules(this);

        parser = DChunks().join(chunkRules).join(extChunkRules).compile();
        parser.on('parsed', function (result) {
            parser = undefined;
            self.emit('parsed', result);
            deferred.resolve(result);
        });
        parser.write(bBuf);
    }
    return deferred.promise.nodeify(callback);
};

/*************************************************************************************************/
/*** Specific Chunk Rules                                                                      ***/
/*************************************************************************************************/
ru.clause('bit8', function (name) {
	this.uint8(name);
});

ru.clause('bit16', function (name) {
    this.uint16(name);
});

ru.clause('bit24', function (name) {
    this.uint8('lsb').tap(function () {
        this.uint16('msb').tap(function () {
            var value;
            value = (this.vars.msb * 256)+ this.vars.lsb;
            this.vars[name] = value;
            delete this.vars.lsb;
            delete this.vars.msb;
        });
    });
});

ru.clause('bit32', function (name) {
    this.uint32(name);
});

ru.clause('boolean', function (name) {
    this.uint8(name);
});

ru.clause('uint24', function (name) {
    this.uint8('lsb').tap(function () {
        this.uint16('msb').tap(function () {
            var value;
            value = (this.vars.msb * 256)+ this.vars.lsb;
            this.vars[name] = value;
            delete this.vars.lsb;
            delete this.vars.msb;
        });
    });  
});     

ru.clause('addr', function (name, valLen) {

    this.buffer(name, valLen).tap(function () {
        var addr,
            tmpBuf = (new Buffer(valLen)).fill(0),
            origBuf = this.vars[name];

        for (var i = 0; i < valLen; i++) {
            tmpBuf.writeUInt8(origBuf.readUInt8(i), ((valLen-1)-i));
        }
        addr = buf2Addr(tmpBuf, valLen);
        this.vars[name] = addr;
    });
});

ru.clause('sfloat', function (valName) {
    this.uint16('sfloat').tap(function () {
        this.vars[valName] = uint2sfloat(this.vars.sfloat);
        delete this.vars.sfloat;
    });
});

ru.clause('float', function (valName) {
    this.uint32('float').tap(function () {
        this.vars[valName] = uint2float(this.vars.float);
        delete this.vars.float;
    });
});

ru.clause('nibble', function (valLsbName, valMsbName) {
    this.uint8('temp').tap(function () {
        this.vars[valLsbName] = this.vars.temp & 0x0F;
        this.vars[valMsbName] = (this.vars.temp & 0xF0)/16;
        delete this.vars.temp;
    });
});

ru.clause('0x290A', function (extParams, extTypes) {
    this.tap(function () {
        if ((this.vars.Condition > 0) && (this.vars.Condition <= 3)) {
            this[extTypes[0]](extParams[0]);
        } else if (this.vars.Condition === 4) {
            this[extTypes[1]](extParams[1]);
        } else if ((this.vars.Condition > 4) && (this.vars.Condition <= 6)) {
            this[extTypes[2]](extParams[2]);
        }
    });
});

ru.clause('0x290E', function (extParams, extTypes) {
    this.tap(function () {
        if (this.vars.Condition === 0) {
            this[extTypes[0]](extParams[0]);
        } else if ((this.vars.Condition > 0) && (this.vars.Condition <= 2)) {
            ru[extTypes[1]](extParams[1])(this);
        } else if (this.vars.Condition === 3) {
            this[extTypes[2]](extParams[2]);
        }
    });
});

var uintRules = [
  'int8', 'sint8', 'uint8',
  'int16', 'int16le', 'int16be', 'sint16', 'sint16le', 'sint16be', 'uint16', 'uint16le', 'uint16be',
  'int32', 'int32le', 'int32be', 'sint32', 'sint32le', 'sint32be', 'uint32', 'uint32le', 'uint32be',
  'int64', 'int64le', 'int64be', 'sint64', 'sint64le', 'sint64be', 'uint64', 'uint64le', 'uint64be',
  'floatbe', 'floatle', 'doublebe', 'doublele'
];

ru.clause('valsRules', function (extParams, extTypes, extFlags, extResult, extValLen) {
    this.tap(function () {
        for (var i = 0; i < extValLen; i++) {
            if ((this.vars.Flags & extFlags[i]) === extResult[i]) {
                if(_.indexOf(uintRules, extTypes[i]) > 0) {
                    this[extTypes[i]](extParams[i]);
                } else if (extTypes[i] === 'nibble') {
                    ru.nibble(extParams[i], extParams[i + 1])(this);
                    i += 1; 
                }else {
                    ru[extTypes[i]](extParams[i])(this);
                }
            }   
        }
    });
});

/*************************************************************************************************/
/*** Private Functions                                                                         ***/
/*************************************************************************************************/
function buildExtraCharValsRules (valObj) {
    var extraRules = [],
        charUuid = valObj.uuid,
        charVals = valObj.getCharVals().extra,
        extParams = charVals.params,
        extTypes = charVals.types,
        extFlags = charVals.flags,
        extResult = charVals.result,
        extValLen = charVals.params.length;

    switch (charUuid) {
        case '0x290A':
            extraRules.push(ru['0x290A'](extParams, extTypes));
            break;
        case '0x290E':
            extraRules.push(ru['0x290E'](extParams, extTypes));
            break;
        case '0x290B':
        case '0x290C':
        case '0x290D':
            //TODO Environmental Sensing Service Section
        case '0x2a55':
            //TODO variable
        case '0x2a63':
            //TODO Optional
        case '0x2a64':
            //TODO Optional
        case '0x2a66':
            //TODO variable
        case '0x2a67':
            //TODO Optional
        case '0x2a68':
            //TODO Optional
        case '0x2a69':
            //TODO Optional
        case '0x2a6b':
            //TODO Optional
        case '0x2a7d':
            //TODO Environmental Sensing Service
        case '0x2a9f':
            //TODO User Data Service Section
        case '0x2aa4':
            //TODO variable
        case '0x2aa7':
            //TODO variable
        case '0x2aa9':
            //TODO E2E-CRC
        case '0x2aaa':
            //TODO E2E-CRC
        case '0x2aab':
            //TODO E2E-CRC
        case '0x2aac':
            //TODO E2E-CRC
        case '0x2abc':
            //TODO no spec
            break;
        default:
            extraRules.push(ru['valsRules'](extParams, extTypes, extFlags, extResult, extValLen));
            break;
    }

    return extraRules;
}


function buf2Addr (buf, valLen) {
    var addrChunk = '0x';

    for (var i = 0; i < valLen; i += 1) {
        if (buf[i] <= 15) {
            addrChunk += '0' + buf[i].toString(16);
        } else {
            addrChunk += buf[i].toString(16);
        }
    }

    return addrChunk;
}

function uint2sfloat(ieee11073) {
    var reservedValues = new  Enum({
    0x07FE: 'PositiveInfinity',
    0x07FF: 'NaN',
    0x0800: 'NaN',
    0x0801: 'NaN',
    0x0802: 'NegativeInfinity'
    }),
        mantissa = ieee11073 & 0x0FFF;

    if (reservedValues[mantissa]) return reservedValues[mantissa].value;

    if (mantissa >= 0x0800) mantissa = -(0x1000 - mantissa);

    var exponent = ieee11073 >> 12;

    if (exponent >= 0x08) exponent = -(0x10 - exponent);

    var magnitude = Math.pow(10, exponent);
    return (mantissa * magnitude);  
}

function uint2float(ieee11073) {
    var reservedValues = new  Enum({
    0x007FFFFE: 'PositiveInfinity',
    0x007FFFFF: 'NaN',
    0x00800000: 'NaN',
    0x00800001: 'NaN',
    0x00800002: 'NegativeInfinity'
    }),
        mantissa = ieee11073 & 0x00FFFFFF;

    if (reservedValues[mantissa]) return reservedValues[mantissa].value;
    
    if (mantissa >= 0x800000) mantissa = -(0x1000000 - mantissa);
    
    var exponent = ieee11073 >> 24;

    if (exponent >= 0x10) exponent = -(0x100 - exponent);

    var magnitude = Math.pow(10, exponent);
    return (mantissa * magnitude);  
}

module.exports = hciCharDiscriminator;
