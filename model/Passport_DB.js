var Q = require('q');
var _ = require('underscore');

var Connection = require('../database/connection');
var Utilities = require("../util");

var Passport = function() {
    return this;
};

Passport.prototype = {};

// 生成随机验证码
Passport.generateVerifyCode = function () {
    var seeds = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");
    var size = seeds.length;

    return seeds[Math.floor(Math.random() * size)] + seeds[Math.floor(Math.random() * size)]
        + seeds[Math.floor(Math.random() * size)] + seeds[Math.floor(Math.random() * size)];
};

// 生成随机token
Passport.generateVerifyToken = function () {
    var seeds = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");
    var size = seeds.length;

    return seeds[Math.floor(Math.random() * size)] + seeds[Math.floor(Math.random() * size)]
        + seeds[Math.floor(Math.random() * size)] + seeds[Math.floor(Math.random() * size)];
};

// 用户登录
Passport.userLogin = function (conditions) {
    return Connection.passportLogin(conditions);
};

// 忘记密码
Passport.setUserForgetPassword = function (conditions) {
    return base.post('', Utilities.formatRequest(conditions));
};

// 查询用户信息
Passport.queryUserInfo = function (conditions) {
    return base.post('userInfoQuery', Utilities.formatRequest(conditions));
};

// 用户信息修改
Passport.setUserCompleteAccount = function (conditions) {
    return Connection.passportInfoModify(conditions);
};

// 修改密码
Passport.setUserModifyPassword = function (conditions) {
    return Connection.passportPasswordModify(conditions);
};

// 查询用户列表
Passport.queryUsersList = function (conditions) {
    return base.post('userListQuery', Utilities.formatRequest(conditions));
};

module.exports = Passport;
