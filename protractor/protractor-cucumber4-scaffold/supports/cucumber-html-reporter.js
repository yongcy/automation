var reporter = require("cucumber-html-reporter");

exports.generate = function(reportDir) {
    var options = {
        theme: "bootstrap",
        jsonFile: reportDir + "/cucumber/cucumber-report.json",
        output: reportDir + "/cucumber/cucumber-report.html",
        reportSuiteAsScenarios: true
    };

    reporter.generate(options);
};
