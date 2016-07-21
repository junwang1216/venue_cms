var Q = require('q');
var _ = require('underscore');

var base = require('../connection/base');
var Utilities = require("../util");

var Reports = function() {
    return this;
};

Reports.prototype = {};

// 营业收入列表的headers
Reports.RevenueHeaders = {
    number: "编号",
    commoditycategory: "商品类别",
    smountmoney: "金额",
    discount: "预订渠道",
    smallchange: "抹零",
    actualamount: "实际金额"
};

// 获取今天的日期
Reports._getToday = function () {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = month >= 10 ? month : "0" + month;
    var day = date.getDate();
    day = day >= 10 ? day : "0" + day;

    return year + "-" + month + "-" + day;
};

// 获取最近几天的日期
Reports._getPreviousDays = function (days) {
    var date = new Date();
    var startTime = date.getTime();

    date.setTime(startTime - ((days - 1) * 24 * 60 * 60 * 1000));

    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = month >= 10 ? month : "0" + month;
    var day = date.getDate();
    day = day >= 10 ? day : "0" + day;


    return year + "-" + month + "-" + day;
};

// 格式化营业收入条件
Reports.formatReportsConditions = function (conditions) {
    var conds = {};

    if (conditions.selectdate == "today") {
        conds.startdate = Reports._getToday();
        conds.startdate = conds.startdate + " 00:00:00";

        conds.enddate = Reports._getToday();
        conds.enddate = conds.enddate + " 23:59:59";
    } else if (conditions.selectdate == "week") {
        conds.startdate = Reports._getPreviousDays(7);
        conds.startdate = conds.startdate + " 00:00:00";

        conds.enddate = Reports._getToday();
        conds.enddate = conds.enddate + " 23:59:59";
    } else if (conditions.selectdate == "month") {
        conds.startdate = Reports._getPreviousDays(30);
        conds.startdate = conds.startdate + " 00:00:00";

        conds.enddate = Reports._getToday();
        conds.enddate = conds.enddate + " 23:59:59";
    } else {
        conds.startdate = conditions.startdate || Reports._getToday();
        conds.startdate = conds.startdate + " 00:00:00";

        conds.enddate = conditions.enddate || Reports._getToday();
        conds.enddate = conds.enddate + " 23:59:59";
    }

    return conds;
};

// 格式化营业收入数据
Reports.formatRevenueData = function (data) {
    var list = [];

    list = list.concat(data.List);

    var item1 = {};
    item1.commoditycategory = "合计";
    item1.smountmoney = data.amounttotal;
    item1.discount = data.discounttotal;
    item1.smallchange = data.smallchangetotal;
    item1.actualamount = data.actualamounttotal;
    list.push(item1);

    var item2 = {};
    item2.commoditycategory = "";
    item2.smountmoney = "";
    item2.discount = "";
    item2.smallchange = "";
    item2.actualamount = "";
    list.push(item2);

    var item3 = {};
    item3.commoditycategory = "营业款总额";
    item3.smountmoney = data.salesamounttotal;
    item3.discount = "";
    item3.smallchange = "";
    item3.actualamount = "";
    list.push(item3);

    var item4 = {};
    item4.commoditycategory = "现金";
    item4.smountmoney = data.cash;
    item4.discount = "";
    item4.smallchange = "";
    item4.actualamount = "";
    list.push(item4);

    var item5 = {};
    item5.commoditycategory = "银行卡";
    item5.smountmoney = data.bankcard;
    item5.discount = "";
    item5.smallchange = "";
    item5.actualamount = "";
    list.push(item5);

    var item6 = {};
    item6.commoditycategory = "支票";
    item6.smountmoney = data.check;
    item6.discount = "";
    item6.smallchange = "";
    item6.actualamount = "";
    list.push(item6);

    var item7 = {};
    item7.commoditycategory = "微信支付";
    item7.smountmoney = data.wechatpayment;
    item7.discount = "";
    item7.smallchange = "";
    item7.actualamount = "";
    list.push(item7);

    var item8 = {};
    item8.commoditycategory = "支付宝";
    item8.smountmoney = data.alipay;
    item8.discount = "";
    item8.smallchange = "";
    item8.actualamount = "";
    list.push(item8);

    return list;
};

// 营业收入统计
Reports.revenueAccount = function (conditions) {
    return base.post('revenueAccount', Utilities.formatRequest(conditions));
};

// 会员消费充值统计
Reports.memberStatistics = function (conditions) {
    return base.post('memberStatistics', Utilities.formatRequest(conditions));
};

module.exports = Reports;
