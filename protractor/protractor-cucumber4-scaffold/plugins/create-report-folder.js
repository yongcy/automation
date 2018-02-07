var fse = require("fs-extra");

module.exports = {
    setup: function() {
        fse.mkdirsSync(this.config.options.reportDir + "/cucumber");
    }
};
