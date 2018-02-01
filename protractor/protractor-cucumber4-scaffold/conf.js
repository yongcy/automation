var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

exports.config = {
    seleniumAddress: "http://localhost:4444/wd/hub",

    // directConnect: true,

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

        format: ["json:reports/report/cucumber/cucumber-report.json", "node_modules/cucumber-pretty"],

        tags: ""
    },

    onPrepare: function() {
        global.expect = chai.expect;

        browser.ignoreSynchronization = true;
    },

    plugins: [
        {
            path: "supports/create-report-folder.js",
            options: {
                reportDir: "reports/report/cucumber"
            }
        },

        // plugin to generate cucumber html report
        {
            path: "supports/cucumber-html-reporter.js",
            options: {
                jsonFile: "reports/report/cucumber/cucumber-report.json",
                htmlFile: "reports/report/cucumber/cucumber-report.html"
            }
        }
    ]
};
