var Q = require('q');
var _ = require('underscore');

var base = require('../connection/base');
var Utilities = require("../util");

var Venue = function() {
    return this;
};

Venue.prototype = {};

// 可预订的运动项目
// status: 1可预订 2未来可预订,显示 3不可预订,不显示
Venue.Sports = {
    Shuttlecock: {text: "羽毛球", value: "0", icon: "shuttlecock", status: 1},
    Basketball:  {text: "蓝球",   value: "1", icon: "basketball",  status: 2},
    PingPong:    {text: "乒乓球", value: "2", icon: "pingpong",    status: 3},
    Football:    {text: "足球",   value: "3", icon: "football",    status: 3},
    Swimming:    {text: "游泳",   value: "4", icon: "swimming",    status: 3},
    Tennis:      {text: "网球",   value: "5", icon: "tennis",      status: 3},
    Bowling:     {text: "保龄球", value: "6", icon: "bowling",     status: 3}
};

// 可预订的每天的时间
Venue.SportsTime = [
    {text: "00:00", value: "0",  status: 1, start: "00:00", end: "01:00", amount: "60"},
    {text: "01:00", value: "1",  status: 1, start: "01:00", end: "02:00", amount: "60"},
    {text: "02:00", value: "2",  status: 1, start: "02:00", end: "03:00", amount: "60"},
    {text: "03:00", value: "3",  status: 1, start: "03:00", end: "04:00", amount: "60"},
    {text: "04:00", value: "4",  status: 1, start: "04:00", end: "05:00", amount: "60"},
    {text: "05:00", value: "5",  status: 1, start: "05:00", end: "06:00", amount: "60"},
    {text: "06:00", value: "6",  status: 1, start: "06:00", end: "07:00", amount: "60"},
    {text: "07:00", value: "7",  status: 1, start: "07:00", end: "08:00", amount: "60"},
    {text: "08:00", value: "8",  status: 0, start: "08:00", end: "09:00", amount: "60"},
    {text: "09:00", value: "9",  status: 0, start: "09:00", end: "10:00", amount: "60"},
    {text: "10:00", value: "10", status: 0, start: "10:00", end: "11:00", amount: "60"},
    {text: "11:00", value: "11", status: 0, start: "11:00", end: "12:00", amount: "60"},
    {text: "12:00", value: "12", status: 0, start: "12:00", end: "13:00", amount: "60"},
    {text: "13:00", value: "13", status: 0, start: "13:00", end: "14:00", amount: "60"},
    {text: "14:00", value: "14", status: 0, start: "14:00", end: "15:00", amount: "60"},
    {text: "15:00", value: "15", status: 0, start: "15:00", end: "16:00", amount: "60"},
    {text: "16:00", value: "16", status: 0, start: "16:00", end: "17:00", amount: "60"},
    {text: "17:00", value: "17", status: 0, start: "17:00", end: "18:00", amount: "60"},
    {text: "18:00", value: "18", status: 0, start: "18:00", end: "19:00", amount: "60"},
    {text: "19:00", value: "19", status: 0, start: "19:00", end: "20:00", amount: "60"},
    {text: "20:00", value: "20", status: 0, start: "20:00", end: "21:00", amount: "60"},
    {text: "21:00", value: "21", status: 1, start: "21:00", end: "22:00", amount: "60"},
    {text: "22:00", value: "22", status: 1, start: "22:00", end: "23:00", amount: "60"},
    {text: "23:00", value: "23", status: 1, start: "23:00", end: "00:00", amount: "60"}
];

// 周几可预订的时间段
// 周日 0 ... 6
Venue.WeekdayBookingsTime = [
    ["8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"],  // 周日
    ["18", "19", "20"],  // 周一
    ["18", "19", "20"],  // 周二
    ["18", "19", "20"],  // 周三
    ["18", "19", "20"],  // 周四
    ["18", "19", "20"],  // 周五
    ["8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"]  // 周六

];

// 运动场地的状态
Venue.States = {
    Enable:   {class: "enable",   text: "空场次",   value: "6"},
    Selected: {class: "selected", text: "已选择",   value: "5"},
    Unpaid:   {class: "unpaid",   text: "未付款",   value: "0"}, // 未付款预订
    Ordered:  {class: "ordered",  text: "已付款",   value: "1"}, // 已付款预订
    Locked:   {class: "locked",   text: "已锁定",   value: "4"},
    Doing:    {class: "doing",    text: "已开场",   value: "2"},
    Warning:  {class: "warning",  text: "开场报警", value: "3"},
    Disable:  {class: "disable",  text: "不可预订", value: "8"}
};

// 场馆预订渠道
Venue.Channels = {
    HTML5: {text: "微信公证号", value: 0},
    PC:    {text: "PC现场", value: 1}
};

// 场馆地点
Venue.SportsAddress = [{text: "171运动俱乐部"}];

// 提前预订的天数
Venue.BookingAheadDays = 14;

// 场馆预订付款类型
Venue.PaymentsTime = {
    OpenTime: {text: "开场时付款", value: "0"},
    BookTime: {text: "预定时付款", value: "1"}
};

Venue.getToday = function () {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = month >= 10 ? month : "0" + month;
    var day = date.getDate();
    day = day >= 10 ? day : "0" + day;

    return {
        date: year + "-" + month + "-" + day,
        hours: date.getHours()
    };
};

// 计算提前预订的时间 默认是14天
Venue.makeAheadDate = function (days) {
    days = parseInt(days) || Venue.BookingAheadDays;

    var date = new Date();
    var startTime = date.getTime();

    var Weeks = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    var dateArray = [];

    for (var i = 0; i < days; i++) {
        date.setTime(startTime + (i * 24 * 60 * 60 * 1000));

        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = month >= 10 ? month : "0" + month;
        var day = date.getDate();
        day = day >= 10 ? day : "0" + day;
        var week = date.getDay();

        dateArray.push({
            dateShow: month + "月" + day + "日",
            weekShow: i != 0 ? (i != 1 ? Weeks[week] : "明天") : "今天",
            day: day,
            value: year + "-" + month + "-" + day
        });
    }

    return dateArray;
};

// 查询场地预订情况
Venue.querySitesReservations = function (conditions) {
    return base.post('siteReservationInfoQuery', Utilities.formatRequest(conditions));
};

// 查询场地列表
Venue.querySites = function (conditions) {
    return base.post('siteInfoQuery', Utilities.formatRequest(conditions));
};

// 场地预订
Venue.siteReservation = function (conditions) {
    return base.post('siteReservation', Utilities.formatRequest(conditions));
};

// 场地预订支付
Venue.individualPayment = function (conditions) {
    return base.post('individualPayment', Utilities.formatRequest(conditions));
};

// 场地手动开场
Venue.manualOpen = function (conditions) {
    return base.post('manualOpen', Utilities.formatRequest(conditions));
};

// 预订场地锁场
Venue.lockField = function (conditions) {
    return base.post('lockField', Utilities.formatRequest(conditions));
};

// 没预定场地锁场
Venue.lockFieldNoReservation = function (conditions) {
    return base.post('lockFieldNoReservation', Utilities.formatRequest(conditions));
};

// 场地解锁
Venue.unlockField = function (conditions) {
    return base.post('unlockField', Utilities.formatRequest(conditions));
};

// 场地换场
Venue.changeField = function (conditions) {
    return base.post('changeField', Utilities.formatRequest(conditions));
};

// 场地取消
Venue.reservationSiteCancel = function (conditions) {
    return base.post('reservationSiteCancel', Utilities.formatRequest(conditions));
};

// 场地加场
Venue.siteReservationField = function (conditions) {
    return base.post('siteReservationField', Utilities.formatRequest(conditions));
};

// 取消场地加场
Venue.siteReservationFieldDelete = function (conditions) {
    return base.post('siteReservationFieldDelete', Utilities.formatRequest(conditions));
};

// 场地加场提交预订
Venue.siteReservationBatch = function (conditions) {
    return base.post('siteReservationBatch', Utilities.formatRequest(conditions));
};

module.exports = Venue;
