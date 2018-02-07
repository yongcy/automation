var fse = require("fs-extra");

exports.create = function(reportDir) {
    fse.mkdirsSync(reportDir + "/cucumber");
};
