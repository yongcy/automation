var reporter = require("cucumber-html-reporter");

module.exports = {
    postResults: function() {
        var options = {
            theme: "bootstrap",
            jsonFile: this.config.options.jsonFile,
            output: this.config.options.htmlFile,
            reportSuiteAsScenarios: true
        };

        reporter.generate(options);
    }
};
