var Q = require('q');
var _ = require('underscore');

var base = require('../connection/base');
var Utilities = require("../util");

var Venue = require("../model/Venue");
var Users = require("../model/Users");

var Order = function() {
    return this;
};

Order.prototype = {};

// 订单列表的headers
Order.OrderHeaders = {
    orderno: "订单号",
    siteshow: "场地类型",
    date: "预订日期",
    channelshow: "预订渠道",
    usershow: "会员类别",
    phone: "手机号",
    amount: "金额(元)",
    paymentshow: "状态"
};

// 订单状态
Order.PaymentState = {
    Unpaid: {text: "未付款", value: "0"},
    Paid:   {text: "已付款", value: "1"}
};

// 订单打印状态
Order.PrintState = {
    No:  {text: "未打印", value: "0"},
    Yes: {text: "已打印", value: "1"}
};

// 格式化订单列表
Order.formatOrderList = function (data) {
    _.each(data, function (item) {
        item.siteshow = Utilities.getText(Venue.Sports, item.siteclass);
        item.channelshow = Utilities.getText(Venue.Channels, item.schedulchannel);
        item.usershow = Utilities.getText(Users.CardLevels, item.userclass);
        item.paymentshow = Utilities.getText(Order.PaymentState, item.paymentstate);
        item.paymentclass = (item.paymentstate == Order.PaymentState.Paid.value) ? "order-paid" : "order-unpaid";
    });

    return data;
};

// 订单预订场次列表的headers
Order.BookingHeaders = {
    id: "场地预定编号",
    sitenumber: "场地编号",
    date: "预订日期",
    starttime: "开始时间",
    endtime: "结束时间",
    stateshow: "预订状态"
};

// 格式化订单预订场次列表
Order.formatBookingList = function (data) {
    _.each(data, function (item) {
        item.stateshow = Utilities.getText(Venue.States, item.state);
        item.stateclass = (Utilities.getItem(Venue.States, item.state)).class + "-color";
    });

    return data;
};

// 查询订单列表
Order.orderListQuery = function (conditions) {
    return base.post('orderListQuery', Utilities.formatRequest(conditions));
};

// 查询订单详情
Order.orderDetailQuery = function (conditions) {
    return base.post('orderDetailQuery', Utilities.formatRequest(conditions));
};

// 查询微信预订的订单列表
Order.weChatorderListQuery = function (conditions) {
    return base.post('weChatorderListQuery', Utilities.formatRequest(conditions));
};

// 查询微信预订的订单场地详情列表
Order.weChatorderDetailQuery = function (conditions) {
    return base.post('weChatorderDetailQuery', Utilities.formatRequest(conditions));
};

// 已打印订单修改订单打印状态
Order.orderPrintstateUpdate = function (conditions) {
    return base.post('orderPrintstateUpdate', Utilities.formatRequest(conditions));
};

module.exports = Order;
