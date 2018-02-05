var reporter = require("cucumber-html-reporter");

var options = {
    theme: "bootstrap",
    jsonFile: "reports/report/cucumber/cucumber-report.json",
    output: "reports/report/cucumber/cucumber-report.html",
    reportSuiteAsScenarios: true
};

reporter.generate(options);
