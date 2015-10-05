var _ = require('lodash'),
	should = require('should'),
	Chance = require('chance'),
	chance = new Chance(),
    Q = require('q');

var hciCmdConcentrater = require('../hci/HciCmdConcentrater');



var furtherProcessArr = [
	'AttFindInfoRsp', 'AttFindByTypeValueRsp'
];

//define argobj which requires further processing
var attFindInfoRspObj = {
        handle0: 1,
        uuid0: 11,
        handle1: 2,
        uuid1: 22,
        handle2: 3,
        uuid2: 33,
    },
    attFindByTypeValueRspObj = {
        attrHandle0: 0x0102,
        grpEndHandle0: 0x0304,
        attrHandle1: 0x0506,
        grpEndHandle1: 0x0708,
    },
    furtherProcessObj = {
        attFindInfoRsp: hciCmdConcentrater.AttFindInfoRsp(65534, 1, attFindInfoRspObj),
        attFindByTypeValueRsp: hciCmdConcentrater.AttFindByTypeValueRsp(65534, attFindByTypeValueRspObj)
    };

describe('Constructor Testing', function () {
	it('constr_name check', function () {
        for (var key in hciCmdConcentrater) {
            var argObj = hciCmdConcentrater[key]();
            (argObj.constr_name).should.be.equal(key);
            // console.log((argObj.constr_name).should.be.equal(123));
        }
	});

    //test normal format framer
    _.forEach(hciCmdConcentrater, function (val, key) {
        var argObj = hciCmdConcentrater[key](),
            cmdAttrs = argObj.getCmdAttrs(),
            params = cmdAttrs.params,
            types = cmdAttrs.types,
            argObjBuf;

        if (!_.includes(furtherProcessArr, argObj.constr_name)) {
            for(var i = 0; i < params.length; i += 1) {
                argObj[params[i]] = randomArg(types[i]);
            }

            argObjBuf = argObj.getHciCmdBuf();

            if (argObjBuf.length !== 0) {
                it(argObj.constr_name + ' framer check', function () {
                    return argObj.parseCmdFrame(argObjBuf).then(function (result) {
                        delete argObj.constr_name;
                        return argObj.should.be.deepEqual(result);
                    });
                });
            }
        }
    });

    //test specific format framer
    _.forEach(furtherProcessArr, function (val) {
        it(val + ' framer check', function () {
            var argObj = furtherProcessObj[_.camelCase(val)];

            return compareArgObjAndParsedObj(argObj).then(function (result) {
                return argObj.should.be.deepEqual(result);
            });
        });
    });
});

function randomArg(type) {
    var k,
        testBuf,
        bufLen;

    switch (type) {
        case 'uint8':
        	return chance.integer({min: 0, max: 255});
        	break;
        case 'uint16be':
        case 'uint16le':
        	return chance.integer({min: 0, max: 65535});
        	break;
        case 'uint32le':
        	return chance.integer({min: 0, max: 4294967295});
        	break;
        case 'uint64':
            return chance.integer({min: 0, max: 18446744073709551615});
        	break;
        case 'buffer':
        case 'buffer8':
        case 'buffer16':
        case 'addr':
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
        	break;
        case 'string':
        	return chance.string();
        	break;

        default:
        break;
    }

    return;
}

function compareArgObjAndParsedObj (argObj, callback) {
	var deferred = Q.defer(),
        buf = argObj.getHciCmdBuf(),
		constrName;

	argObj.parseCmdFrame(buf).then(function (parsedObj) {
    	constrName = argObj.constr_name;
    	delete argObj.constr_name;
        deferred.resolve(parsedObj);
    });
    return deferred.promise.nodeify(callback);
}