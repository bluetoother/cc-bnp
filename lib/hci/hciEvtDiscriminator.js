'use strict';

var Q = require('q'),
    _ = require('lodash'),
    DChunks = require('dissolve-chunks'),
    ru = DChunks().Rule(),
    evtMeta = require('./hciEvtMeta');

var hciEvtDiscriminator = {};

// Build Argument Constructors for All Layers APIs
(function () {
    _.forEach(evtMeta, function (meta, cmd) {
        hciEvtDiscriminator[cmd] = function () {
            return ArgObj.factory(cmd, arguments);
        };
    });
})();

/***************************************************************************************************/
/*** ArgObj Class                                                                                ***/
/***************************************************************************************************/
function ArgObj() {}

ArgObj.factory = function (constrName) {
    var evtAttrsMeta = evtMeta[constrName];
    if (!evtAttrsMeta) { throw new Error(ArgObj[constrName] + " doesn't exist"); }

    ArgObj[constrName] = function () {
        this.constr_name = constrName;
        // store event metadata to the specialized constructor only once
        ArgObj[constrName].evtAttrs = ArgObj[constrName].evtAttrs || evtAttrsMeta;
    };

    if (!_.isFunction(ArgObj[constrName].prototype.getEvtAttrs)) {
        ArgObj[constrName].prototype = new ArgObj();
    }

    return new ArgObj[constrName]();
};

ArgObj.prototype.getEvtAttrs = function () {
    return this.constructor[this.constr_name].evtAttrs;
};

ArgObj.prototype.getHciEvtParser = function (bufLen) {
    var evtAttrs = this.getEvtAttrs(),
        chunkRules = [],
        extChunkRules;        

    _.forEach(evtAttrs.params, function (param, idx) {
        var attrType = evtAttrs.types[idx];

        if (_.startsWith(attrType, 'buffer')) {
            chunkRules.push(ru.buffer(param, _.parseInt(attrType.slice(6))));
        } else {
            chunkRules.push(ru[attrType](param));
        }
    });

    if (chunkRules.length === 0) {
        return false;
    }

    extChunkRules = (evtAttrs.paramLens === 'variable') ? buildExtraEvtAttrsRules(this, bufLen) : [];

    return DChunks().join(chunkRules).join(extChunkRules).compile();    // if extChunkRules = [], not affect the result
};

ArgObj.prototype.getHciEvtPacket = function (bufLen, bBuf, callback) {
    var deferred = Q.defer(),
        evtAttrs = this.getEvtAttrs(),
        attrParamLen = evtAttrs.paramLens,
        parser;

    if (_.isNumber(attrParamLen) && (attrParamLen !== bufLen)) {
        deferred.reject(new Error('Parameter length incorrect.'));
    } else {
        parser = this.getHciEvtParser(bufLen);
        if (parser) {
            parser.on('parsed', function (result) {
                parser = undefined;
                deferred.resolve(result);
            });
            parser.write(bBuf);
        } else {
            deferred.resolve({});
        }
    }

    return deferred.promise.nodeify(callback);
};

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

ru.clause('bufWithLen', function (lenName, bufName, lenType) {
    this[lenType](lenName).tap(function () {
        this.buffer(bufName, this.vars[lenName]);
    });
});

ru.clause('attObj', function (buflen, objName, objAttrs) {
    var loopTimes = Math.floor(buflen / objAttrs.objLen);

    this.tap(objName, function () {
        var self = this;

        for (var i = 0; i < loopTimes; i += 1) {
            _.forEach(objAttrs.params, function(param, idx) {
                var type = objAttrs.types[idx];
                self[type](param + i);
            });
        }
    }).tap(function () {
        for (var k in this.vars) {
            delete this.vars[k].__proto__;
        }
    });
});

ru.clause('attObjPreLen', function (bufLen, objName, lenName, lenType, objAttrs) {

    this[lenType](lenName).tap(function () {
        var objLen = this.vars[lenName],
            loopTimes,
            flag = false;

        if (lenType === 'uint8') { bufLen = bufLen - 1; }
        if (lenType === 'uint16le') { bufLen = bufLen - 2; }
        
        loopTimes = Math.floor(bufLen / objLen);

        this.tap(objName, function () {
            var self = this;

            for (var i = 0; i < loopTimes; i += 1) {
                _.forEach(objAttrs.params, function (param, idx) {
                    var type = objAttrs.types[idx];

                    if (type === 'buffer') {
                        self.buffer((param + i), (objLen - objAttrs.objBufPreLen));
                    } else {
                        self[type](param + i);
                    } 
                });
            }
        }).tap(function () {
            var self = this;
            for (var k in this.vars) {
                if (k === 'data') {
                    for (var key in this.vars.data) {
                        if (_.startsWith(key, 'endGrpHandle')) { flag = true; }
                        if (_.startsWith(key, 'attrVal') && flag) { 
                            self.vars.data[key] = buf2Str(self.vars.data[key]); 
                            flag = false;
                        }
                    }
                }       
                delete this.vars[k].__proto__;
            }
        });
    });
});

ru.clause('GapDeviceDiscovery', function () {
    var count = 0;

    this.uint8('numDevs').loop(function (end) {
        var inrCount = 0;

        if (this.vars.numDevs !== 0) {
            this.loop('dev', function (inrEnd) {
                if (inrCount < 2) {
                    this.uint8();
                } else {
                    ru.addr('addr')(this);
                }

                inrCount += 1;
                if (inrCount === 3) { inrEnd(); }
            }).tap(function () {
                if (!this.vars.devs) this.vars.devs = [];
                this.vars.devs.push({evtType: this.vars.dev[0]['undefined'], addrType: this.vars.dev[1]['undefined'], addr: this.vars.dev[2].addr});
                delete this.vars.dev;
            });
        } else {
            end();
        }

        count += 1;
        if (count === this.vars.numDevs) { end(); }
    });
});

ru.clause('AttFindInfoRsp', function (bufLen, format, objName) {
    var loopTimes,
        buflen;

    this.uint8(format).tap(function () {

        if (this.vars[format] === 1) {
            loopTimes = (bufLen - 1) / 4;
            buflen = 2;
        }

        if (this.vars[format] === 2) {
            loopTimes = (bufLen - 1) / 18;
            buflen = 16;
        }

        this.tap(objName, function () {
            for (var i = 0; i < loopTimes; i += 1) {
                this.uint16le('handle' + i).buffer(('uuid' + i), buflen);
            }
        }).tap(function () {
            var self = this;

            for (var k in this.vars) {
                if (k === 'info') {
                    _.forEach(this.vars.info, function (val, key) {
                        if (_.startsWith(key, 'uuid')) { self.vars.info[key] = buf2Str(val); }
                    });
                }                
                delete this.vars[k].__proto__;
            }
        });
    });
});

/*************************************************************************************************/
/*** Private Functions                                                                         ***/
/*************************************************************************************************/
function buildExtraEvtAttrsRules (argObj, bufLen) {
    var extraRules = [],
        constrName = argObj.constr_name,
        extAttrs = argObj.getEvtAttrs().extra,
        extParams = extAttrs.params,
        extTypes = extAttrs.types;

    if (_.startsWith(constrName, 'Att')) {
        bufLen = bufLen - extAttrs.precedingLen;
        if (bufLen === 0) { return extraRules; }   
        if (bufLen < extAttrs.minLen) { throw new Error('The length of the ' + extParams[0] + ' field of ' + constrName + ' is incorrect.'); }
    }

    switch (constrName) {
        case 'HciPer':
            if (bufLen === extAttrs.paramLens) {  // [QUES] why this if? Only when the command parameter is HCI_EXT_PER_READ will have extra event arguments
                _.forEach(extParams, function (param, idx) {
                    var type = extTypes[idx];
                    extraRules.push(ru[type](param));
                });
            }
            break;

        case 'GapDeviceDiscovery':
            extraRules.push(ru.GapDeviceDiscovery());
            break;

        case 'GapDeviceInfo':
        case 'GapCmdStatus':
            extraRules.push(ru.bufWithLen(extParams[0], extParams[1], extTypes[0]));
            break;

        case 'AttFindByTypeValueReq':
        case 'AttReadRsp':
        case 'AttReadBlobRsp':
        case 'AttReadMultiRsp':
        case 'AttWriteReq':
        case 'AttPrepareWriteReq':
        case 'AttPrepareWriteRsp':
        case 'AttHandleValueNoti':
        case 'AttHandleValueInd':
            extraRules.push(ru.buffer(extParams[0], bufLen));
            break;

        case 'AttReadByTypeReq':
        case 'AttReadByGrpTypeReq':
            if (bufLen !== 2 && bufLen !== 16) {
                throw new Error('The length of the ' + extParams[0] + ' field of ' + constrName + ' must be 2 or 16 bytes.');
            }
            extraRules.push(ru.uuid(extParams[0], bufLen));
            break;

        case 'AttFindInfoRsp':
            extraRules.push(ru.AttFindInfoRsp(bufLen, extParams[0], extParams[1]));
            break;

        case 'AttFindByTypeValueRsp':
        case 'AttReadMultiReq':
            extraRules.push(ru.attObj(bufLen, extParams[0], extAttrs.objAttrs));
            break;

        case 'AttReadByTypeRsp':
        case 'AttReadByGrpTypeRsp':
            extraRules.push(ru.attObjPreLen(bufLen, extParams[1], extParams[0], extTypes[0], extAttrs.objAttrs));
            break;

        default:
            throw new Error(argObj.constr_name + ' event packet error!');
    }
    return extraRules;
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

module.exports = hciEvtDiscriminator;
