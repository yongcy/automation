var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var moment = require("moment");
var reportDir = "reports/report_" + moment().format("YYYYMMDD_HHmmss");
chai.use(chaiAsPromised);

exports.config = {
    // seleniumAddress: "http://localhost:4444/wd/hub",

    directConnect: true,

    capabilities: {
        browserName: "chrome",
        chromeOptions: {
            args: ["--start-maximized", "--disable-gpu"]
        }
    },

    framework: "custom",
    frameworkPath: require.resolve("protractor-cucumber-framework"),
    ignoreUncaughtExceptions: true,

    specs: ["features/**/*feature"],

    cucumberOpts: {
        strict: true,

        require: ["supports/timeout.js", "supports/cucumber-screenshot.js", "steps/**/*step.js"],

        format: ["json:" + reportDir + "/cucumber/cucumber-report.json", "node_modules/cucumber-pretty"],

        tags: ""
    },

    onPrepare: function() {
        global.expect = chai.expect;

        browser.ignoreSynchronization = true;
    },

    plugins: [
        // plugin to backup report of last runing
        // and create report folder for new runing
        {
            path: "plugins/create-report-folder.js",
            options: {
                reportDir: reportDir
            }
        },

        // plugin to generate cucumber html report
        {
            path: "plugins/cucumber-html-reporter.js",
            options: {
                jsonFile: reportDir + "/cucumber/cucumber-report.json",
                htmlFile: reportDir + "/cucumber/cucumber-report.html"
            }
        }
    ]
};
