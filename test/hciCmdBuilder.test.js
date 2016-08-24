var expect = require('chai').expect,
    _ = require('busyman'),
    Chance = require('chance'),
    chance = new Chance(),
    Q = require('q'),
    DChunks = require('dissolve-chunks'),
    ru = DChunks().Rule();

var cmdBuilder = require('../lib/hci/hciCmdBuilder');

var furtherProcessArr = [
    'AttFindInfoRsp', 'AttFindByTypeValueRsp', 'AttReadMultiReq', 'AttReadByTypeRsp',
    'AttReadByGrpTypeRsp', 'GattReadMultiCharValues', 'GattReliableWrites'];

//define argobj which requires further processing
var attFindInfoRspObj = {
        handle0: 1,
        uuid0: '0x2a11',
        handle1: 2,
        uuid1: '0x2a22',
        handle2: 3,
        uuid2: '0x2a33'
    },
    attFindByTypeValueRspObj = {
        attrHandle0: 0x0102,
        grpEndHandle0: 0x0304,
        attrHandle1: 0x0506,
        grpEndHandle1: 0x0708
    },
    attReadMultiReqObj = {
        handle0: 1,
        handle1: 2,
        handle2: 3
    },
    attReadByTypeRspObj = {
        attrHandle0: 0x0102,
        attrVal0: new Buffer([0x01, 0x02]),
        attrHandle1: 0x0506,
        attrVal1: new Buffer([0x01, 0x02])
    },
    attReadByGrpTypeRspObj = {
        attrHandle0: 0x0102, 
        endGroupHandle0: 0x010C, 
        attrVal0: new Buffer([0x01, 0x02]),
        attrHandle1: 0x0300, 
        endGroupHandle1: 0x030A, 
        attrVal1: new Buffer([0x01, 0x02])
    },
    gattReadMultiCharValuesObj = {
        handle0: 4,
        handle1: 5,
        handle2: 6
    },
    gattReliableWritesObj = {
        attrValLen0: 6,
        handle0: 0x0102, 
        offset0: 0x010C,
        value0: new Buffer([0x01, 0x02]),
        attrValLen1: 6, 
        handle1: 0x0300, 
        offset1: 0x030A,
        value1: new Buffer([0x01, 0x02])
    },
    furtherProcessObj = {
        attFindInfoRsp: cmdBuilder.AttFindInfoRsp(65534, 1, attFindInfoRspObj),
        attFindByTypeValueRsp: cmdBuilder.AttFindByTypeValueRsp(65534, attFindByTypeValueRspObj),
        attReadMultiReq: cmdBuilder.AttReadMultiReq(65534, attReadMultiReqObj),
        attReadByTypeRsp: cmdBuilder.AttReadByTypeRsp(65534, 4, attReadByTypeRspObj),
        attReadByGrpTypeRsp: cmdBuilder.AttReadByGrpTypeRsp(65534, 6, attReadByGrpTypeRspObj),
        gattReadMultiCharValues: cmdBuilder.GattReadMultiCharValues(65534, gattReadMultiCharValuesObj),
        gattReliableWrites: cmdBuilder.GattReliableWrites(65534, 2, gattReliableWritesObj)
    };

describe('hciCmdBuilder Functional check', function () {
    it('constr_name check', function () {
        for (var key in cmdBuilder) {
            var argObj = cmdBuilder[key]();
            expect(argObj.constr_name).to.be.eql(key);
        }
    });

    //test normal format framer
    _.forEach(cmdBuilder, function (val, key) {
        var argObj = instWrapper(cmdBuilder[key]()),
            cmdAttrs = argObj.getCmdAttrs(),
            params = cmdAttrs.params,
            types = cmdAttrs.types,
            argObjBuf,
            args = {};

        if (!_.includes(furtherProcessArr, argObj.constr_name)) {
            for(var i = 0; i < params.length; i += 1) {
                args[params[i]] = randomArg(types[i]);
            }

            Object.assign(argObj, args);

            argObjBuf = argObj.getHciCmdBuf();

            if (argObjBuf.length !== 0) {
                it(argObj.constr_name + ' framer check', function () {
                    return argObj.parseCmdFrame(argObjBuf).then(function (result) {
                        return expect(result).to.be.eql(args);
                    });
                });
            }
        }
    });

    // test specific format framer
    _.forEach(furtherProcessArr, function (val) {
        var args = furtherProcessObj[val.slice(0,1).toLowerCase() + val.slice(1)],
            argObj = instWrapper(args),
            simpleArgs = {},
            simpleResult = {},
            notRealArgs = [ 'constr_name', 'getHciCmdParser', 'parseCmdFrame' ],
            argObjBuf;

        _.forOwn(args, function (val, key) {
            if (!_.includes(notRealArgs, key))
                simpleArgs[key] = val;
        });

        argObjBuf = argObj.getHciCmdBuf();

        it(val + ' framer check', function (done) {

            return  argObj.parseCmdFrame(argObjBuf).then(function (result) { 
                if (isEqual(simpleArgs, result)) done();
            });
        });
    });
});

function isEqual (val, other) {
    var isEq = true;

    if (typeof val !== typeof other)
        return false;
    else if (_.isArray(val) && !_.isArray(other))
        return false;
    else if (_.isArray(other) && !_.isArray(val))
        return false;
    else if (_.isBuffer(val) && !_.isBuffer(other))
        return false;
    else if (_.isFunction(val) || _.isFunction(other))
        return false;
    else if (!_.isObjectLike(val))
        return val === other;
    else if (_.isBuffer(val))
        return val.equals(other);

    // object-like comparison
    if (_.size(val) !== _.size(other))
        return false;

    _.forEach(other, function (v, k) {
        isEq = isEqual(val[k], v);
        return isEq;    // false, break immediately
    });

    return isEq;
}

function randomArg(type) {
    var k,
        testBuf,
        bufLen;

    switch (type) {
        case 'uint8':
            return chance.integer({min: 0, max: 255});
        case 'uint16be':
        case 'uint16le':
            return chance.integer({min: 0, max: 65535});
        case 'uint32le':
            return chance.integer({min: 0, max: 4294967295});
        case 'uint64':
            return chance.integer({min: 0, max: 18446744073709551615});
        case 'buffer':
        case 'buffer6':
        case 'buffer8':
        case 'buffer16':
            if (type === 'buffer') {
                bufLen = chance.integer({min: 0, max: 255});
            } else if (type === 'addr') {
                bufLen = 6;
            } else {
                bufLen = _.parseInt(type.slice(6));
            }
            
            testBuf = new Buffer(bufLen);

            for (k = 0; k < bufLen; k += 1) {
                testBuf[k] = chance.integer({min: 0, max: 255});
            }
            return testBuf;
        case 'addr':
            return '0x123456789011';
        case 'uuid':
            return '0x2a00';
        case 'passkey':
            return '012345';
        case 'string':
            return chance.string();
        default:
        break;
    }

    return;
}

function instWrapper (argobj) {
    argobj.getHciCmdParser = function (bufLen) {
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
                } else if (attrTypes[i] === 'passkey') {
                    chunkRule.push(ru.string(attrParams[i], 6));
                } else {
                    chunkRule.push(ru[attrTypes[i]](attrParams[i]));
                }   
            }());
        }
        return DChunks().join(chunkRule).compile();
    };

    argobj.parseCmdFrame = function (buf, callback) {
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

    return argobj;
}

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

ru.clause('uuid', function (name, bufLen) {
    if (!bufLen) { bufLen = 2; }
    this.buffer(name, bufLen).tap(function () {
        var uuid,
            origBuf = this.vars[name];
        uuid = buf2Str(origBuf);
        this.vars[name] = uuid;
    });
});

ru.clause('AttFindInfoRsp', function (objName, bufLen) {
    var loopTimes,
        uuidType;
  
    this.tap(function () {
        if (this.vars.format === 1) {
            loopTimes = bufLen / 4;
            uuidType = 2;
        } else if (this.vars.format === 2) {
            loopTimes = bufLen / 18;
            uuidType = 16;
        }
    }).tap(objName, function () {
        for (var i = 0; i < loopTimes; i += 1) {
            this.uint16le('handle' + i);
            ru['uuid'](('uuid' + i), uuidType)(this);
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
