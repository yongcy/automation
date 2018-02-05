var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

exports.config = {
    // seleniumAddress: "http://localhost:4444/wd/hub",

    directConnect: true,

    capabilities: {
        browserName: "chrome",
        enableVNC: true,
        chromeOptions: {
            args: ["--start-maximized", "--disable-gpu"]
        }
    },

    framework: "custom",
    frameworkPath: require.resolve("protractor-cucumber-framework"),
    ignoreUncaughtExceptions: true,

    specs: ["features/**/*feature"],

    cucumberOpts: {
        format: ["supports/cucumber-json-reporter.js:tmp", "node_modules/cucumber-pretty"],

        strict: true,

        require: ["supports/timeout.js", "supports/cucumber-screenshot.js", "steps/**/*step.js"],

        tags: ""
    },

    onPrepare: function() {
        // perpare report folder
        require("./supports/create-report-folder.js");

        global.expect = chai.expect;

        browser.ignoreSynchronization = true;
    },

    onComplete: function() {
        // generate cucumber html report
        require("./supports/cucumber-html-reporter.js");
    }
};
