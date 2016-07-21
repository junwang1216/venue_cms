var Utilities = require("../../util");
var Log = require("../../model/Log");

var Dashboard_Controller = function () {};

Dashboard_Controller.prototype = {};

Dashboard_Controller.navName = Utilities.NavNames.Dashboard;

// 首页面板页面
Dashboard_Controller.renderDashboardIndex = function (req, res) {
    //res.redirect("/venue");

    var user = req.cookies[Utilities.Cookies.UserAccount];
    var date = new Date();
    var hours = date.getHours();

    var welcome = "";

    if (hours > 6 && hours < 12) {
        welcome = ", 上午好";
    }
    if (hours > 12 && hours < 18) {
        welcome = ", 下午好";
    }
    if (hours > 18 && hours < 24) {
        welcome = ", 晚上好";
    }

    res.render('dashboard/dashboard_index', {
        navName: Dashboard_Controller.navName,
        navNames: Utilities.NavNames,
        TopNavigators: [{
            title: "首页"
        }],
        data: {
            user: JSON.parse(user),
            welcome: welcome
        }
    });
};

// 帮助建议
Dashboard_Controller.renderDashboardHelps = function (req, res) {
    res.render('dashboard/dashboard_helps', {
        navName: Dashboard_Controller.navName,
        navNames: Utilities.NavNames,
        TopNavigators: [{
            title: "首页"
        }, {
            title: "帮助建议"
        }]
    });
};

// 预订帮助建议
Dashboard_Controller.renderVenueHelps = function (req, res) {
    res.render('venue/venue_helps', {
        navName: Dashboard_Controller.navName,
        navNames: Utilities.NavNames,
        TopNavigators: [{
            title: "首页"
        }, {
            url: "/dashboard/Helps",
            title: "帮助建议"
        }, {
            title: "场馆预订"
        }]
    });
};

// 会员建议
Dashboard_Controller.renderUsersHelps = function (req, res) {
    res.render('users/users_helps', {
        navName: Dashboard_Controller.navName,
        navNames: Utilities.NavNames,
        TopNavigators: [{
            title: "首页"
        }, {
            url: "/dashboard/Helps",
            title: "帮助建议"
        }, {
            title: "会员档案"
        }]
    });
};

// 商品建议
Dashboard_Controller.renderGoodsHelps = function (req, res) {
    res.render('goods/goods_helps', {
        navName: Dashboard_Controller.navName,
        navNames: Utilities.NavNames,
        TopNavigators: [{
            title: "首页"
        }, {
            url: "/dashboard/Helps",
            title: "帮助建议"
        }, {
            title: "商品管理"
        }]
    });
};

// 统计建议
Dashboard_Controller.renderReportsHelps = function (req, res) {
    res.render('reports/reports_helps', {
        navName: Dashboard_Controller.navName,
        navNames: Utilities.NavNames,
        TopNavigators: [{
            title: "首页"
        }, {
            url: "/dashboard/Helps",
            title: "帮助建议"
        }, {
            title: "数据统计"
        }]
    });
};

// 系统设置
Dashboard_Controller.renderDashboardSettings = function (req, res) {
    res.render('dashboard/dashboard_settings', {
        navName: Dashboard_Controller.navName,
        navNames: Utilities.NavNames,
        TopNavigators: [{
            title: "首页"
        }, {
            title: "系统设置"
        }]
    });
};

// 系统打印
Dashboard_Controller.renderDashboardPrint = function (req, res) {
    res.render('dashboard/dashboard_print', {
        navName: Dashboard_Controller.navName,
        navNames: Utilities.NavNames,
        TopNavigators: [{
            title: "首页"
        }, {
            title: "打印预览"
        }]
    });
};

module.exports = Dashboard_Controller;
