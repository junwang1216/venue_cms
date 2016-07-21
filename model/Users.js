var Q = require('q');
var _ = require('underscore');

var base = require('../connection/base');
var Utilities = require("../util");

var Users = function() {
    return this;
};

Users.prototype = {};

// 会员状态
Users.States = {
    Normal:  {text: "正常",  value: "0"},
    Cancel:  {text: "注销",  value: "1"}
};

// 会员列表的headers
Users.Headers = {
    memberid: "会员号",
    membername: "会员名",
    phone: "手机号码",
    cardnumber: "会员卡号",
    balance: "余额",
    validityperiod: "有效期至",
    vicecardnum: "副卡"
};

// 会员卡级别
Users.CardLevels = {
    General:  {text: "普通卡",  value: "2"},
    VIP:      {text: "贵宾卡",  value: "0"},
    Ultimate: {text: "钻石卡",  value: "1"},
    Person:   {text: "散客",    value: "3"}
};

// 付款类型
Users.PaymentTypes = {
    Prepaid:  {text: "预付",  value: "0"}
};

// 支付方式
Users.PaymentWay = {
    Money:   {text: "现金",    value: "0"},
    WeChat:  {text: "微信",    value: "1"},
    Alipay:  {text: "支付宝",  value: "2"},
    Check:   {text: "支票",    value: "3"},
    Free:    {text: "经理签单",  value: "4"},
    Card:    {text: "银行卡",  value: "5"}
};

// 会员列表
Users.getUsersList = function (conditions) {
    return base.post('memberListQuery', Utilities.formatRequest(conditions));
};

// 会员详情
Users.getUsersDetail = function (conditions) {
    return base.post('memberDetailsQuery', Utilities.formatRequest(conditions));
};

// 删除会员
Users.deleteUsers = function (conditions) {
    return base.post('memberCancellation', Utilities.formatRequest(conditions));
};

// 生成会员号
Users.makeUsersNo = function (conditions) {
    return base.post('memberGenerate', Utilities.formatRequest(conditions));
};

// 添加会员
Users.addUsersInfo = function (conditions) {
    return base.post('memberAdd', Utilities.formatRequest(conditions));
};

// 编辑会员
Users.modifyUsersInfo = function (conditions) {
    return base.post('memberEditor', Utilities.formatRequest(conditions));
};

// 会员绑卡
Users.bindCard = function (conditions) {
    return base.post('memberCardAdd', Utilities.formatRequest(conditions));
};

// 会员挂失
Users.loseCard = function (conditions) {
    return base.post('memberCardLoss', Utilities.formatRequest(conditions));
};

// 查询会员副卡
Users.viceCardList = function (conditions) {
    return base.post('viceCardList', Utilities.formatRequest(conditions));
};

// 添加副卡
Users.addViceCard = function (conditions) {
    return base.post('viceCardAdd', Utilities.formatRequest(conditions));
};

// 会员卡充值
Users.rechargeCard = function (conditions) {
    return base.post('memberCardRecharge', Utilities.formatRequest(conditions));
};

module.exports = Users;
