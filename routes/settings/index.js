var Utilities = require("../../util");
var Log = require("../../model/Log");

var Settings_Controller = function () {};

Settings_Controller.prototype = {};

Settings_Controller.navName = Utilities.NavNames.Settings;

//
Settings_Controller.renderDemo = function (req, res) {
    res.render('settings/demo', {
        navName: Settings_Controller.navName,
        navNames: Utilities.NavNames,
        TopNavigators: [{
            title: ""
        }, {
            title: ""
        }]
    });
};

module.exports = Settings_Controller;
