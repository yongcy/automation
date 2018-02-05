# Background

Since [Cucumber 3.0.0](https://github.com/cucumber/cucumber-js/compare/v2.3.1...v3.0.0)

* `pretty` formatter has been removed. The `progress` formatter is now the default.
* Remove `registerHandler` and `registerListener`.

# Change Impact

* Can't config `pretty` formater in `cucumberOpts` in protractor conf
```javascript
    cucumberOpts: {
        format: ['pretty']
    }
```
* Can't use `registerListener` and `JsonFormatter` together to generate Cucumber JSON Result as below snippet:

```javascript
var JsonFormatter = new Cucumber.JsonFormatter();

JsonFormatter.log = function(string) {
    var outputDir = "reports";
    var fileName = "cucumber-report.json";
    var targetJson = path.resolve(outputDir, fileName);

    fse.outputFileSync(targetJson, string);
};

registerListener(JsonFormatter);
```

# Solution to get Pretty formater back

* install package `cucumber-pretty`
* add it in `cucumberOpts`

```javascript
cucumberOpts: {
    format: ["node_modules/cucumber-pretty"];
}
```

# Solution to generate Cucumer JSON/HTML report

**Option 1 - use protractor plugin**

* use Cucumber build-in JSON formater to generate JSON report
```javascript
//protractor conf file
    cucumberOpts: {
        strict: true,
        format: [
            "json:reports/cucumber-report.json", "node_modules/cucumber-pretty"
        ],
```
* use Protractor plugin's interface `setup` to create report parent folder

  * because build-in json formater will create a write stream
when Cucumber init it before any scenario running
  * but it
won't create parent folder if not exist, otherwise it will fail. so we need to create report parent folder before Cucumber framework load
```javascript
// protractor plugin and implement setup interface
module.exports = {
    setup: function() {
        var reportDir = this.config.options.reportDir;
        if (fse.existsSync(reportDir)) {
            fse.moveSync(reportDir, reportDir + "_" + moment().format("YYYYMMDD_HHmmss"), {
                overwrite: true
            });
        }

        fse.mkdirsSync(reportDir);
// This interface called after the WebDriver
// session has been started, but before the test framework has been set up
```

* use Protractor plugin's interface `postResults` to generate Cucumber HTML report
  * Cucumber build-in json formater use async api to write Cucumber Json report to file
  * If you use `AfterAll` hook to generate Cucumber HTML report, the Cucumber JSON report not compelte create yet, so generate HTML report will fail.
```javascript
// protractor plugin and implement postResults interface
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
// This interface called after the test results have been finalized and any jobs have been updated (if applicable).

```

**Option 2 - not use protractor plugin**
* define a new class and extends build-in `JsonFormater` and overwrite the `log` function to generate Json report sync.
```javascript
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
```

* create report parent folder in `onPrepare`
```javascript
// protractor conf file
    onPrepare: function() {
        // perpare report folder
        require("./supports/create-report-folder.js");

// supports/create-report-folder.js
var fse = require("fs-extra");
var moment = require("moment");
var reportDir = "reports/report";

if (fse.existsSync(reportDir)) {
    fse.moveSync(reportDir, reportDir + "_" + moment().format("YYYYMMDD_HHmmss"), {
        overwrite: true
    });
}

fse.mkdirsSync(reportDir);
```

* generate Cucumber HTML report in `onComplete`
```javascript
// protractor conf file
    onComplete: function() {
        // generate cucumber html report
        require("./supports/cucumber-html-reporter.js");
    }
// supports/cucumber-html-reporter.js
var reporter = require("cucumber-html-reporter");

var options = {
    theme: "bootstrap",
    jsonFile: "reports/report/cucumber/cucumber-report.json",
    output: "reports/report/cucumber/cucumber-report.html",
    reportSuiteAsScenarios: true
};

reporter.generate(options);
```

# Finally

* `conf-unuse-plugin.js` is protractor conf file of Option 2
* `conf-use-plugin.js` is protractor conf file of Option 1