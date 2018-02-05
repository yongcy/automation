var { JsonFormatter } = require("cucumber");
var fse = require("fs-extra");
var path = require("path");

class ExJsonFormatter extends JsonFormatter {
    constructor(options) {
        super(options);

        // overwrite the default log function
        this.log = function(string) {
            var outputDir = "reports/report/cucumber";
            var fileName = "cucumber-report.json";
            var targetJson = path.resolve(outputDir, fileName);

            fse.outputFileSync(targetJson, string);
        };
    }
}

module.exports = ExJsonFormatter;
