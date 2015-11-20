'use strict';

var Q = require('q'),
    _ = require('lodash'),
    Concentrate = require('concentrate'),
    hciCharMeta = require('./HciCharMeta');

// var hciCharBuilder = {};

// (function () {
//     _.forEach(hciCharMeta, function (meta, cmd) {
//         hciCharBuilder[cmd] = function () {
//             return ValObj.factory(cmd, arguments);
//         };
//     });
// })();

function hciCharBuilder (uuid) {
    return ValObj.factory(uuid);
}

/***************************************************************************************************/
/*** ValObj Class                                                                                ***/
/***************************************************************************************************/
function ValObj() {}

ValObj.factory = function (uuid) {
    var charValsMeta = hciCharMeta[uuid];

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

    return new ValObj[uuid](); // new_ValObj
};

ValObj.prototype.getCharVals = function () {
    return this.constructor[this.uuid].charVals;
};

ValObj.prototype.transToValObj = function (argInst) {
    var self = this,
        charVals = this.getCharVals();

    if (!charVals) {
        if (!Buffer.isBuffer(argInst)) { 
            throw new Error('The uuid are not registered and value are not Buffer.'); 
        } else {
            self.value = argInst;
        }
    } else {
        if (argInst instanceof ValObj[self.uuid]) { return argInst; }

        _.forEach(charVals.params, function (param) {
            //if (!argInst.hasOwnProperty(param)) { throw new Error('The argument object has incorrect properties.'); }
            self[param] = argInst[param];
        });

        if (charVals.extra) {
            var cmdExtraParams = self.getCharVals().extra.params;
            for (var i = 0; i < cmdExtraParams.length; i++) {
                if ((argInst.Flags & charVals.extra.flags[i]) === charVals.extra.result[i]) {
                    if (argInst[cmdExtraParams[i]]) self[cmdExtraParams[i]] = argInst[cmdExtraParams[i]];
                    else throw new Error('The argument object has incorrect properties.');
                }   
            }
        }
    }

    return this;
};

ValObj.prototype.getHciCharBuf = function (callback) {
    var self = this,
        deferred = Q.defer(),
        dataBuf = Concentrate(),
        charVals = this.getCharVals(),
        nibbleBuf = [];

    if (!charVals) {
        return this.value;
    } else {
        _.forEach(charVals.params, function (param, idx) {
            var paramVal = self[param],
                paramType = charVals.types[idx];

            // checkType(paramVal, paramType, param);
            builder(dataBuf, paramVal, paramType);
        });

        if (charVals.extra) {
            for (var i = 0; i < charVals.extra.params.length; i++) {
                if ((self.Flags & charVals.extra.flags[i]) === charVals.extra.result[i]) {
                    builder(dataBuf, self[charVals.extra.params[i]], charVals.extra.types[i]);
                }   
            }
        }

        return dataBuf.result();
    }
};

function builder(dataBuf, paramVal, paramType) {

    switch (paramType) {
        case 'bit8' :
            dataBuf = dataBuf['uint8'](paramVal);
            break;
        case 'bit16' :
            dataBuf = dataBuf['uint16'](paramVal);
            break;
        case 'bit24':
            var tmpBuf = paramVal & 0xFF; 
            dataBuf = dataBuf['uint16'](tmpBuf);
            tmpBuf = paramVal >> 16;
            dataBuf = dataBuf['uint8'](tmpBuf);
            break;
        case 'bit32' :
            dataBuf = dataBuf['uint32'](paramVal);
            break;
        case 'int8' :
        case 'int16' :
        case 'int32' :
        case 'uint8':
        case 'uint16':
        case 'uint32':
            dataBuf = dataBuf[paramType](paramVal);
            break;
        case 'uint24':
            var tmpBuf = paramVal & 0xFF; 
            dataBuf = dataBuf['uint16'](tmpBuf);
            tmpBuf = paramVal >> 16;
            dataBuf = dataBuf['uint8'](tmpBuf);
            break;
        case 'string':
            dataBuf = dataBuf.string(paramVal, "utf8");
            break;
        case 'uuid' :
        case 'addr3':
        case 'addr5':
        case 'addr6':
            paramVal = str2Buf(paramVal);
            dataBuf = dataBuf.buffer(paramVal);
            break;
        case 'boolean':
            dataBuf = dataBuf['uint8'](paramVal);
            break;
        case 'nibble': 
            nibbleBuf.push(paramVal);
            if (nibbleBuf.length === 2) {
                dataBuf = dataBuf['uint8'](nibbleBuf[0] + (nibbleBuf[1] << 4));
            }
            break;
        case 'sfloat':
            var result = 0x07FF,
                sgn = paramVal > 0 ? +1 : -1,
                mantissa = Math.abs(paramVal),
                exponent = 0;

            if (isNaN(paramVal)) {
                dataBuf = dataBuf['uint16'](result);
                break;
            } else if (paramVal > 20450000000.0) {
                result = 0x07FE;
                dataBuf = dataBuf['uint16'](result);
                break;
            } else if (paramVal < -20450000000.0) {
                result = 0x0802;
                dataBuf = dataBuf['uint16'](result);
                break;
            } else if (paramVal >= -1e-8 && paramVal <= 1e-8) {
                result = 0;
                dataBuf = dataBuf['uint16'](result);
                break;
            }

            // scale up if number is too big
            while (mantissa > 0x07FD) {
                mantissa /= 10.0;
                ++exponent;
                if (exponent > 7) {
                    // argh, should not happen
                    if (sgn > 0) {
                        result = 0x07FE;
                    } else {
                        result = 0x0802;
                    }
                    dataBuf = dataBuf['uint16'](result);
                    break;
                }
            }

            // scale down if number is too small
            while (mantissa < 1) {
                mantissa *= 10;
                --exponent;
                if (exponent < -8) {
                    // argh, should not happen
                    result = 0;
                    dataBuf = dataBuf['uint16'](result);
                    break;
                }
            }

            var smantissa = Math.round(mantissa * 10000),
                rmantissa = Math.round(mantissa) * 10000,
                mdiff = Math.abs(smantissa - rmantissa);

            while (mdiff > 0.5 && exponent > -8 && (mantissa * 10) <= 0x07FD) {
                mantissa *= 10;
                --exponent;
                smantissa = Math.round(mantissa * 10000);
                rmantissa = Math.round(mantissa) * 10000;
                mdiff = Math.abs(smantissa - rmantissa);
            }
            var int_mantissa = parseInt(Math.round(sgn * mantissa));
            result = ((exponent & 0xF) << 12) | (int_mantissa & 0xFFF);
            dataBuf = dataBuf['uint16'](result);
            break;
        case 'float':
            var result = 0x007FFFFF,
                sgn = paramVal > 0 ? +1 : -1,
                mantissa = Math.abs(paramVal),
                exponent = 0;

            if (isNaN(paramVal)) {
                dataBuf = dataBuf['uint32'](result);
                break;
            } else if (paramVal > 8.388604999999999e+133) {
                result = 0x007FFFFE;
                dataBuf = dataBuf['uint32'](result);
                break;
            } else if (paramVal < -(8.388604999999999e+133)) {
                result = 0x00800002;
                dataBuf = dataBuf['uint32'](result);
                break;
            } else if (paramVal >= -(1e-128) && paramVal <= 1e-128) {
                result = 0;
                dataBuf = dataBuf['uint32'](result);
                break;
            }

            // scale up if number is too big
            while (mantissa > 0x007FFFFD) {
                mantissa /= 10.0;
                ++exponent;
                if (exponent > 127) {
                    // argh, should not happen
                    if (sgn > 0) {
                        result = 0x007FFFFE;
                    } else {
                        result = 0x00800002;
                    }
                    dataBuf = dataBuf['uint32'](result);
                    break;
                }
            }

            // scale down if number is too small
            while (mantissa < 1) {
                mantissa *= 10;
                --exponent;
                if (exponent < -128) {
                    // argh, should not happen
                    result = 0;
                    dataBuf = dataBuf['uint32'](result);
                    break;
                }
            }

            // scale down if number needs more precision
            var smantissa = Math.round(mantissa * 10000000),
                rmantissa = Math.round(mantissa) * 10000000,
                mdiff = Math.abs(smantissa - rmantissa);
            while (mdiff > 0.5 && exponent > -128 && (mantissa * 10) <= 0x007FFFFD) {
                mantissa *= 10;
                --exponent;
                smantissa = Math.round(mantissa * 10000000);
                rmantissa = Math.round(mantissa) * 10000000;
                mdiff = Math.abs(smantissa - rmantissa);
            }

            var int_mantissa = parseInt(Math.round(sgn * mantissa));
            result = ((exponent & 0xFF) << 24) | (int_mantissa & 0xFFFFFF);
            dataBuf = dataBuf['int32'](result);
            break;
        default:
            throw new Error("Unknown Data Type");
    }

    return dataBuf;
}
/*************************************************************************************************/
/*** Private Functions                                                                         ***/
/*************************************************************************************************/
function checkType(data, type, param) {
    var typeObj = {
        uint8: 255,
        uint16be: 65535,
        uint16le: 65535,
        uint32le: 4294967295,
        buffer: 255,
        buffer8: 8,
        buffer16: 16
    };

    switch (type) {
        case 'uint8':
        case 'uint16':
        case 'uint32':
            if (!(_.isNumber(data)) || (data < 0) || (data > typeObj[type])) { 
                throw new Error(param + ' must be an integer from 0 to ' + typeObj[type] + '.'); 
            }
            break;

        case 'addr':
        case 'string':
            if (!_.isString(data)) {
                throw new Error(param + ' must be a string.');
            }
            break;

        default:
            throw new Error("Unknown Data Type");
    }
}

function str2Buf (str) {
    var bufLen,
        val,
        chunk,
        tmpBuf;

    if (_.startsWith(str, '0x')) { str = str.slice(2); }
    bufLen = str.length / 2;
    tmpBuf = (new Buffer(bufLen)).fill(0);
    for (var i = 0; i < bufLen; i += 1) {
        chunk = str.substring(0, 2);
        val = _.parseInt(chunk, 16);
        str = str.slice(2);
        tmpBuf.writeUInt8(val, (bufLen-i-1));
    }

    return tmpBuf;
}

module.exports = hciCharBuilder;
