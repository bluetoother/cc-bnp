var expect = require('chai').expect,
    _ = require('lodash'),
    ccbnp = require('../index.js'); 

var hciCmdMeta = require('../lib/hci/hciCmdMeta'),
    BHCI = require('../lib/defs/blehcidefs');

describe('hciCmeApi Signature check', function (done) {
    _.forEach(BHCI.SubGroupCmd, function (cmds, subGroup) {
        var bleSubGroup = subGroup.slice(0, 1).toLowerCase() + subGroup.slice(1);
        _.forEach(cmds._enumMap, function (value, cmd) {
            var bleCmd = _.camelCase(cmd),
                cmdName = subGroup + cmd,
                args = [],
                cmdApi;

            it(cmdName + ' check', function () {
                for (var i = 0; i < hciCmdMeta[cmdName].params.length; i++) {
                    args.push(null);
                }

                args.push(function (err, result) {
                    if (err) done();
                });

                cmdApi = ccbnp[bleSubGroup][bleCmd].apply(ccbnp, args);
            });

        });
    });
});
