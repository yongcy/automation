var fse = require("fs-extra");
var moment = require("moment");
var reportDir = "reports/report";

if (fse.existsSync(reportDir)) {
    fse.moveSync(reportDir, reportDir + "_" + moment().format("YYYYMMDD_HHmmss"), {
        overwrite: true
    });
}

fse.mkdirsSync(reportDir);
