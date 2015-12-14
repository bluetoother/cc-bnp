'use strict';

var _ = require('lodash'),
    Concentrate = require('concentrate'),
    hciCmdMeta = require('./HciCmdMeta');

//**** modules used for testing  *********
var Q = require('q'),
    DChunks = require('dissolve-chunks'),
    ru = DChunks().Rule();
//****************************************

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

// for test
ArgObj.prototype.getHciCmdParser = function (bufLen) {
    var self = this,
        cmdAttrs = this.getCmdAttrs(),
        attrParams = cmdAttrs.params,
        attrTypes = cmdAttrs.types,
        attrLen = attrParams.length,
        chunkRule = [],
        bufferLen;

    for (var i = 0; i < attrLen; i += 1) {
        (function () {
            if (_.startsWith(attrTypes[i], 'buffer')) {
                bufferLen = _.parseInt(attrTypes[i].slice(6));
                if(!bufferLen) {
                    bufferLen = bufLen - cmdAttrs.preBufLen;
                }
                chunkRule.push(ru.buffer(attrParams[i], bufferLen));
            } else if (attrTypes[i] === 'obj') {
                chunkRule.push(processAppendCmdAttrs(self, bufLen, attrParams[i]));
            } else {
                chunkRule.push(ru[attrTypes[i]](attrParams[i]));
            }   
        }());
    }
    return DChunks().join(chunkRule).compile();
};

// for test
ArgObj.prototype.parseCmdFrame = function (buf, callback) {
    var deferred = Q.defer(),
        self = this,
        cmdAttrs = this.getCmdAttrs(),
        params = cmdAttrs.params,
        types = cmdAttrs.types,
        cmdParser;

    cmdParser = this.getHciCmdParser(buf.length);
    cmdParser.on('parsed', function (result) {
        deferred.resolve(result);
    });
    cmdParser.write(buf);

    return deferred.promise.nodeify(callback);
};

/*************************************************************************************************/
/*** Private Functions                                                                         ***/
/*************************************************************************************************/
function generateObjBuf(dataBuf, constrName, objVal, objInfo, length) {
    var loopTimes = Math.floor(_.size(objVal) / _.size(objInfo.params));

    // if (constrName === 'AttFindInfoRsp') {
    //     if (length === 1) { objInfo.types[1] = 'uint16le'; }
    //     if (length === 2) { objInfo.types[1] = 'buffer'; }
    // }

    for (var i = 0; i < loopTimes; i += 1) {
        _.forEach(objInfo.params, function (param, idx) {
            if (!_.has(objVal, (param + i))) { throw new Error('value object should have key: ' + param); }
            dataBuf = dataBuf[objInfo.types[idx]](objVal[param + i]);
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

// for test
function processAppendCmdAttrs (argObj, bufLen, objName) {
    var extChunkRule,
        constrName = argObj.constr_name,
        cmdAttrs = argObj.getCmdAttrs(),
        objInfo = cmdAttrs.objInfo,
        bufferLen;

    if (_.startsWith(constrName, 'Att') || constrName === 'GattReadMultiCharValues' || constrName === 'GattReliableWrites') {
        bufferLen = bufLen - objInfo.precedingLen;
        if (bufferLen < objInfo.minLen) {
            throw new Error('The length of the ' + objInfo.params[0] + ' field of ' + constrName + ' is incorrect.');
        }
    }

    switch (constrName) {
        case 'AttFindInfoRsp':
            extChunkRule = ru.AttFindInfoRsp(objName, bufferLen);
            break;

        case 'AttFindByTypeValueRsp':
        case 'AttReadMultiReq':
        case 'GattReadMultiCharValues':
            extChunkRule = ru.attObj(bufferLen, objName, objInfo);
            break;

        case 'AttReadByTypeRsp':
        case 'AttReadByGrpTypeRsp':
            extChunkRule = ru.attObjRead(bufferLen, objName, objInfo);
            break;

        case 'GattReliableWrites':
            extChunkRule = ru.GattReliableWrites(bufferLen, objName, objInfo);
            break;

        default:
            throw new Error(argObj.constr_name + 'event packet error!');
    }
    return extChunkRule;
}

//  for test
function buf2Str(buf) {
    var bufLen = buf.length,
        val,
        strChunk = '0x';

    for (var i = 0; i < bufLen; i += 1) {
        val = buf.readUInt8(bufLen-i-1);
        if (val <= 15) {
            strChunk += '0' + val.toString(16);
        } else {
            strChunk += val.toString(16);
        }
    }

    return strChunk;
}

// for test
/*************************************************************************************************/
/*** Specific Chunk Rules                                                                      ***/
/*************************************************************************************************/
ru.clause('addr', function (name) {
    this.buffer(name, 6).tap(function () {
        var addr,
            origBuf = this.vars[name];

        addr = buf2Str(origBuf);
        this.vars[name] = addr;
    });
});

ru.clause('AttFindInfoRsp', function (objName, bufLen) {
    var loopTimes,
        uuidType;
  
    this.tap(function () {
        if (this.vars.format === 1) {
            loopTimes = bufLen / 4;
            uuidType = 'uint16le';
        } else if (this.vars.format === 2) {
            loopTimes = bufLen / 18;
            uuidType = 'buffer';
        }
    }).tap(objName, function () {
        for (var i = 0; i < loopTimes; i += 1) {
            this.uint16le('handle' + i)[uuidType](('uuid' + i), 16);
        }
    }).tap(function () {
        for (var k in this.vars) {
            delete this.vars[k].__proto__;
        }
    });
});

ru.clause('attObj', function (buflen, objName, objInfo) {
    var loopTimes = Math.floor(buflen / objInfo.objLen);

    this.tap(objName, function () {
        var self = this;

        for (var i = 0; i < loopTimes; i += 1) {
            _.forEach(objInfo.params, function(param, idx) {
                var type = objInfo.types[idx];
                self[type](param + i);
            });
        }
    }).tap(function () {
        for (var k in this.vars) {
            delete this.vars[k].__proto__;
        }
    });
});

ru.clause('attObjRead', function (buflen, objName, objInfo) {
    var loopTimes, 
        eachBufLen;

    this.tap(function () {
        loopTimes = buflen / this.vars.length;
        eachBufLen = this.vars.length - objInfo.preBufLen;
    }).tap(objName, function (end) {
        var self = this;

        for (var i = 0; i < loopTimes; i += 1) {
            _.forEach(objInfo.params, function(param, idx) {
                var type = objInfo.types[idx];
                self[type](param + i, eachBufLen);
            });
        }
    }).tap(function () {
        for (var k in this.vars) {
            delete this.vars[k].__proto__;
        }
    });
});

ru.clause('GattReliableWrites', function (buflen, objName, objInfo) {
    var loopTimes, 
        eachBufLen;

    this.tap(function () {
        loopTimes = this.vars.numberRequests;
        eachBufLen = (buflen / this.vars.numberRequests) - objInfo.preBufLen;
    }).tap(objName, function (end) {
        var self = this;

        for (var i = 0; i < loopTimes; i += 1) {
            _.forEach(objInfo.params, function(param, idx) {
                var type = objInfo.types[idx];
                self[type](param + i, eachBufLen);
            });
        }
    }).tap(function () {
        for (var k in this.vars) {
            delete this.vars[k].__proto__;
        }
    });
});

module.exports = hciCmdBuilder;
