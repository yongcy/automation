/**
 * Take and attach screenshot to report when scenario fail.
 */

var { After, Status } = require("cucumber");

After(function(testCase) {
    var me = this;

    if (testCase.result.status === Status.FAILED) {
        return browser.takeScreenshot().then(function(screenshot) {
            return me.attach(screenshot, "image/png");
        });
    }
});
