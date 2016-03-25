'use strict';

var _ = require('lodash'),
    Concentrate = require('concentrate'),
    hciCmdMeta = require('./HciCmdMeta');

var hciCmdBuilder = {};

// Build Argument Constructors for All Layers APIs
(function () {
    _.forEach(hciCmdMeta, function (meta, cmd) {
        hciCmdBuilder[cmd] = function () {
            return ArgObj.factory(cmd, arguments);
        };
    });
})();

/***************************************************************************************************/
/*** ArgObj Class                                                                                ***/
/***************************************************************************************************/
function ArgObj() {}

ArgObj.factory = function (constrName, inArgs) {
    var cmdAttrsMeta = hciCmdMeta[constrName];

    if (!cmdAttrsMeta) { throw new Error(constrName + " doesn't exist"); }

    ArgObj[constrName] = function () {
        this.constr_name = constrName;
        // store command metadata to the specialized constructor only once
        ArgObj[constrName].cmdAttrs = ArgObj[constrName].cmdAttrs || cmdAttrsMeta;
    };

    if (!_.isFunction(ArgObj[constrName].prototype.getCmdAttrs)) {
        ArgObj[constrName].prototype = new ArgObj();
    }

    return (new ArgObj[constrName]()).makeArgObj(inArgs); // new_argobj
};

ArgObj.prototype.getCmdAttrs = function () {
    return this.constructor[this.constr_name].cmdAttrs;
};

ArgObj.prototype.makeArgObj = function (inArgs) {
    var cmdParams = this.getCmdAttrs().params,
        self = this;

    _.forEach(cmdParams, function (param, idx) {
        self[param] = inArgs[idx];
    });

    return this;
};

ArgObj.prototype.transToArgObj = function (argInst) {
    var cmdParams = this.getCmdAttrs().params,
        inArgs = [];

    if (argInst instanceof ArgObj[this.constr_name]) { return argInst; }

    _.forEach(cmdParams, function (param) {
        if (!argInst.hasOwnProperty(param)) { throw new Error('The argument object has incorrect properties.'); }
        inArgs.push(argInst[param]);
    });

    return this.makeArgObj(inArgs);
};

ArgObj.prototype.getHciCmdBuf = function () {
    var self = this,
        dataBuf = Concentrate(),
        cmdAttrs = this.getCmdAttrs();

    _.forEach(cmdAttrs.params, function (param, idx) {
        var paramVal = self[param],
            paramType = cmdAttrs.types[idx];

        checkType(paramVal, paramType, param);

        switch (paramType) {
            case 'uint8':
            case 'uint16be':
            case 'uint16le':
            case 'uint32le':
            case 'buffer':
                dataBuf = dataBuf[paramType](paramVal);
                break;
            case 'string':
            case 'passkey':
                dataBuf = dataBuf.string(paramVal, "utf8");
                break;
            case 'buffer6':
            case 'buffer8':
            case 'buffer16':
                dataBuf = dataBuf.buffer(paramVal);
                break;
            case 'uuid':
            case 'addr':
                var tmpBuf = str2Buf(paramVal);
                dataBuf = dataBuf.buffer(tmpBuf);
                break;
            case 'obj':
                dataBuf = generateObjBuf(dataBuf, self.constr_name, paramVal, cmdAttrs.objInfo, self[cmdAttrs.params[idx-1]]);
                break;
            default:
                throw new Error("Unknown Data Type");
        }
    });

    return dataBuf.result();
};

/*************************************************************************************************/
/*** Private Functions                                                                         ***/
/*************************************************************************************************/
function generateObjBuf(dataBuf, constrName, objVal, objInfo, length) {
    var loopTimes = Math.floor(_.size(objVal) / _.size(objInfo.params));

    for (var i = 0; i < loopTimes; i += 1) {
        _.forEach(objInfo.params, function (param, idx) {
            if (!_.has(objVal, (param + i))) { throw new Error('value object should have key: ' + param); }
            
            if (objInfo.types[idx] === 'uuid') {
                var tmpBuf = str2Buf(objVal[param + i]);
                dataBuf = dataBuf.buffer(tmpBuf);
            } else {
                dataBuf = dataBuf[objInfo.types[idx]](objVal[param + i]);
            }
            
        });
    }

    return dataBuf;
}

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
        case 'uint16be':
        case 'uint16le':
        case 'uint32le':
            if (!(_.isNumber(data)) || (data < 0) || (data > typeObj[type])) { 
                throw new Error(param + ' must be an integer from 0 to ' + typeObj[type] + '.'); 
            }
            break;

        case 'buffer':
        case 'buffer6':
        case 'buffer8':
        case 'buffer16':
            if (!(Buffer.isBuffer(data)) || (data.length < 0) || (data.length > typeObj[type])) {
                throw new Error(param + ' must be a buffer with length less than ' + typeObj[type] + ' bytes. ' + data.length + ' bytes detected.');
            }
            break;

        case 'uuid':
        case 'addr':
        case 'string':
            if (!_.isString(data)) {
                throw new Error(param + ' must be a string.');
            }
            break;

        case 'passkey':
            if (!_.isString(data) || !_.isEqual(_.size(data), 6)) {
                throw new Error(param + ' must be a string with lenth equal to 6.');
            }
            break;

        case 'obj':
            if (!_.isObject(data)) {
                throw new Error(param + ' must be a object.');
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
    bufLen = (str.length) / 2;
    tmpBuf = (new Buffer(bufLen)).fill(0);

    for (var i = 0; i < bufLen; i += 1) {
        chunk = str.substring(0, 2);
        val = _.parseInt(chunk, 16);
        str = str.slice(2);
        tmpBuf.writeUInt8(val, (bufLen-i-1));
    }

    return tmpBuf;
}

module.exports = hciCmdBuilder;
