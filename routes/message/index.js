var Utilities = require("../../util");
var Log = require("../../model/Log");

var Message_Controller = function () {};

Message_Controller.prototype = {};

Message_Controller.navName = Utilities.NavNames.Dashboard;

//
Message_Controller.getBookingMessage = function () {
    return {
        message: "啊飒飒是法萨芬撒飞洒发发顺丰撒发顺丰."
    };
};

Message_Controller.renderDashboardMessage = function (req, res) {
    res.render('dashboard/dashboard_message', {
        navName: Message_Controller.navName,
        navNames: Utilities.NavNames,
        TopNavigators: [{
            title: "首页"
        }, {
            title: "我的消息"
        }]
    });
};

module.exports = Message_Controller;
