var Utilities = require("../../util");
var Log = require("../../model/Log");

var Orders = require("../../model/Orders");
var Exports = require("../../model/Exports");

var Orders_Controller = function () {};

Orders_Controller.prototype = {};

Orders_Controller.navName = Utilities.NavNames.Orders;

// 显示订单列表
Orders_Controller.renderOrdersList = function (req, res, next) {
    var conditions = req.query;

    conditions.currentPage = conditions.page || "1";
    conditions.pageSize = conditions.pageSize || "10";
    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];
    conditions.paymentstate = (conditions.paymentstate == "-1") ? "" : conditions.paymentstate;

    Orders.orderListQuery(conditions).then(function (result) {
        var total = Math.ceil(parseInt(result.totalnumber) / parseInt(conditions.pageSize)) || 0;

        res.render('orders/orders_list', {
            navName: Orders_Controller.navName,
            navNames: Utilities.NavNames,
            TopNavigators: [{
                title: "订单管理"
            }, {
                title: "订单列表"
            }],
            // 订单状态
            PaymentState: Orders.PaymentState,
            // 查询条件
            conditions: conditions,
            data: {
                orders: Orders.formatOrderList(result.data || []),
                pagination: {
                    current: parseInt(conditions.currentPage),
                    total: total,
                    pages: Utilities.formatPageIndexes(parseInt(conditions.currentPage), total),
                    url: Utilities.formatPageUrl(req.originalUrl)
                }
            }
        });
    }, function (err) {
        Log.console(err.message, {"interface": "orderListQuery"});
        next(err);
    });
};

// 导出订单列表
Orders_Controller.renderOrdersListExports = function (req, res, next) {
    var conditions = req.query;

    conditions.currentPage = conditions.page || "1";
    conditions.pageSize = conditions.pageSize || "10000";
    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];
    conditions.paymentstate = (conditions.paymentstate == "-1") ? "" : conditions.paymentstate;

    Orders.orderListQuery(conditions).then(function (result) {
        var exports = {};

        exports.title = "订单列表";
        exports.headers = Orders.OrderHeaders;
        exports.data = Orders.formatOrderList(result.data || []);

        var reports = Exports.exportsExcel([exports], "订单列表");

        res.attachment(reports.name);
        res.send(reports.report);
    }, function (err) {
        Log.console(err.message, {"interface": "orderListQuery"});
        next(err);
    });
};

// 显示订单详情
Orders_Controller.renderOrdersView = function (req, res, next) {
    var conditions = req.query;

    conditions.orderno = req.params.id;
    conditions.currentPage = conditions.page || "1";
    conditions.pageSize = conditions.pageSize || "10";
    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];

    Orders.orderDetailQuery(conditions).then(function (result) {
        var total = Math.ceil(parseInt(result.totalnumber) / parseInt(conditions.pageSize)) || 0;

        res.render('orders/orders_detail', {
            navName: Orders_Controller.navName,
            navNames: Utilities.NavNames,
            TopNavigators: [{
                title: "订单管理"
            }, {
                url: "/orders",
                title: "订单列表"
            }, {
                title: "订单详情"
            }],
            // 查询条件
            conditions: conditions,
            data: {
                orders: Orders.formatBookingList(result.data || []),
                pagination: {
                    current: parseInt(conditions.currentPage),
                    total: total,
                    pages: Utilities.formatPageIndexes(parseInt(conditions.currentPage), total),
                    url: Utilities.formatPageUrl(req.originalUrl)
                }
            }
        });
    }, function (err) {
        Log.console(err.message, {"interface": "orderDetailQuery"});
        next(err);
    });
};

// 导出订单详情
Orders_Controller.renderOrdersViewExports = function (req, res, next) {
    var conditions = req.query;

    conditions.orderno = req.params.id;
    conditions.currentPage = conditions.page || "1";
    conditions.pageSize = conditions.pageSize || "10000";
    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];

    Orders.orderDetailQuery(conditions).then(function (result) {
        var exports = {};

        exports.title = "订单详情";
        exports.headers = Orders.BookingHeaders;
        exports.data = Orders.formatBookingList(result.data || []);

        var reports = Exports.exportsExcel([exports], "订单" + conditions.orderno);

        res.attachment(reports.name);
        res.send(reports.report);
    }, function (err) {
        Log.console(err.message, {"interface": "orderDetailQuery"});
        next(err);
    });
};

// 获取打印订单页面
Orders_Controller.renderPrintList = function (req, res, next) {
    var conditions = req.query;

    //conditions.printstate = conditions.printstate || Orders.PrintState.No.value;
    conditions.currentPage = conditions.page || "1";
    conditions.pageSize = conditions.pageSize || "10";
    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];

    Orders.weChatorderListQuery(conditions).then(function (result) {
        var total = Math.ceil(parseInt(result.totalnumber) / parseInt(conditions.pageSize)) || 0;

        res.render('orders/orders_print_list', {
            navName: Orders_Controller.navName,
            navNames: Utilities.NavNames,
            TopNavigators: [{
                title: "我的消息"
            }, {
                title: "打印订单"
            }],
            // 订单打印状态
            PrintState: Orders.PrintState,
            // 查询条件
            conditions: conditions,
            data: {
                orders: Orders.formatOrderList(result.data || []),
                pagination: {
                    current: parseInt(conditions.currentPage),
                    total: total,
                    pages: Utilities.formatPageIndexes(parseInt(conditions.currentPage), total),
                    url: Utilities.formatPageUrl(req.originalUrl)
                }
            }
        });
    }, function (err) {
        Log.console(err.message, {"interface": "weChatorderListQuery"});
        next(err);
    });
};

// 获取打印订单
Orders_Controller.getPrintList = function (req, res) {
    var conditions = req.query;

    conditions.printstate = conditions.printstate || Orders.PrintState.No.value;
    conditions.currentPage = conditions.page || "1";
    conditions.pageSize = conditions.pageSize || "10";
    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];

    Orders.weChatorderListQuery(conditions).then(function (result) {
        res.json(result);
    }, function (err) {
        Log.console(err.message, {"interface": "weChatorderListQuery"});
        res.json(err);
    });
};

// 查询微信预订的订单场地详情列表
Orders_Controller.getPrintOrderDetail = function (req, res) {
    var conditions = {
        orderno: req.params.id
    };
    var account = JSON.parse(req.cookies[Utilities.Cookies.UserAccount]);

    conditions.currentPage = conditions.page || "1";
    conditions.pageSize = conditions.pageSize || "10000";
    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];

    Orders.weChatorderDetailQuery(conditions).then(function (result) {
        res.json({
            status: "200",
            message: "成功",
            data: {
                datetime: Utilities.formatDate("yyyy-MM-dd hh:mm:ss"),
                personname: account.username,
                orderno: conditions.orderno,
                totalnumber: result.totalnumber,
                orders: result.data
            }
        });
    }, function (err) {
        Log.console(err.message, {"interface": "weChatorderDetailQuery"});
        res.json(err);
    });
};

// 标记打印状态改变
Orders_Controller.submitPrintStateMark = function (req, res) {
    var conditions = {
        orderno: req.params.id
    };

    conditions.currentPage = conditions.page || "1";
    conditions.pageSize = conditions.pageSize || "10";
    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];

    Orders.orderPrintstateUpdate(conditions).then(function (result) {
        res.json(result);
    }, function (err) {
        Log.console(err.message, {"interface": "orderPrintstateUpdate"});
        res.json(err);
    });
};

module.exports = Orders_Controller;
