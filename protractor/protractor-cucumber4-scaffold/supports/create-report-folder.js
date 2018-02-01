var fse = require("fs-extra");
var moment = require("moment");

module.exports = {
    setup: function() {
        var reportDir = this.config.options.reportDir;
        if (fse.existsSync(reportDir)) {
            fse.moveSync(reportDir, reportDir + "_" + moment().format("YYYYMMDD_HHmmss"), {
                overwrite: true
            });
        }

        fse.mkdirsSync(reportDir);
    }
};
