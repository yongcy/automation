var { Given, Then, When } = require("cucumber");

Given(/^open cucumberjs github page$/, function() {
    browser.get("https://github.com/cucumber/cucumber-js");
    return expect(browser.getTitle()).to.eventually.equal("cucumber/cucumber-js: Cucumber for JavaScript");
});
