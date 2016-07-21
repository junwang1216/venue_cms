var Utilities = require("../../util");
var Log = require("../../model/Log");

var Reports = require("../../model/Reports");
var Exports = require("../../model/Exports");

var Reports_Controller = function () {};

Reports_Controller.prototype = {};

Reports_Controller.navName = Utilities.NavNames.Reports;

//
Reports_Controller.renderReportsIndex = function (req, res) {
    res.render('reports/reports_index', {
        navName: Reports_Controller.navName,
        navNames: Utilities.NavNames,
        TopNavigators: [{
            title: "报表统计"
        }, {
            title: "场地使用率统计"
        }]
    });
};

// 营业收入
Reports_Controller.renderReportsRevenue = function (req, res, next) {
    var conditions = req.query;
    var conditions1 = Reports.formatReportsConditions(conditions);
    conditions1.token = req.cookies[Utilities.Cookies.UserAccountToken];

    Reports.revenueAccount(conditions1).then(function (result) {

        res.render('reports/reports_revenue', {
            navName: Reports_Controller.navName,
            navNames: Utilities.NavNames,
            TopNavigators: [{
                title: "报表统计"
            }, {
                title: "营业收入统计"
            }],
            conditions: conditions,
            data: {
                reports: result.data || {}
            }
        });
    }, function (err) {
        Log.console(err.message, {"interface": "revenueAccount"});
        next(err);
    });
};

// 营业收入导出
Reports_Controller.renderReportsRevenueExports = function (req, res, next) {
    var conditions = req.query;
    var conditions1 = Reports.formatReportsConditions(conditions);
    conditions1.token = req.cookies[Utilities.Cookies.UserAccountToken];

    Reports.revenueAccount(conditions1).then(function (result) {
        var exports = {};

        exports.title = "营业收入";
        exports.headers = Reports.RevenueHeaders;
        exports.data = Reports.formatRevenueData(result.data);

        var reports = Exports.exportsExcel([exports], "营业收入");

        res.attachment(reports.name);
        res.send(reports.report);
    }, function (err) {
        Log.console(err.message, {"interface": "revenueAccount"});
        next(err);
    });
};

// 会员消费充值
Reports_Controller.renderReportsUsers = function (req, res, next) {
    var conditions = req.query;
    var conditions1 = Reports.formatReportsConditions(conditions);
    conditions1.token = req.cookies[Utilities.Cookies.UserAccountToken];

    Reports.memberStatistics(conditions1).then(function (result) {

        res.render('reports/reports_users', {
            navName: Reports_Controller.navName,
            navNames: Utilities.NavNames,
            TopNavigators: [{
                title: "报表统计"
            }, {
                title: "营业收入统计"
            }],
            conditions: conditions,
            data: {
                reports: result.data || {}
            }
        });
    }, function (err) {
        Log.console(err.message, {"interface": "memberStatistics"});
        next(err);
    });
};

// 会员消费充值
Reports_Controller.renderReportsUsersExports = function (req, res, next) {
    var conditions = req.query;
    var conditions1 = Reports.formatReportsConditions(conditions);
    conditions1.token = req.cookies[Utilities.Cookies.UserAccountToken];

    Reports.memberStatistics(conditions1).then(function (result) {
        var exports = {};

        exports.title = "会员消费充值";
        exports.headers = Reports.RevenueHeaders;
        exports.data = Reports.formatRevenueData(result.data);

        var reports = Exports.exportsExcel([exports], "会员消费充值");

        res.attachment(reports.name);
        res.send(reports.report);
    }, function (err) {
        Log.console(err.message, {"interface": "memberStatistics"});
        next(err);
    });
};

module.exports = Reports_Controller;
