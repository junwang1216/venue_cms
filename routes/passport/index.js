var Utilities = require("../../util");
var Log = require("../../model/Log");

var Passport = require("../../model/Passport");

var Passport_Controller = function () {};

Passport_Controller.prototype = {};

Passport_Controller.navName = Utilities.NavNames.Dashboard;

// 判断用户是否已经登录
Passport_Controller.userAuth = function (req, res, next) {
    var token = req.cookies[Utilities.Cookies.UserAccountToken];

    if (!token) {
        return res.redirect('/pp/Login?return=' + req.originalUrl);
    }

    next();
};

// 判断用户是否已经登录
Passport_Controller.userAuthJSON = function (req, res, next) {
    var token = req.cookies[Utilities.Cookies.UserAccountToken];

    if (!token) {
        return res.json({status:500,message:"登录已经过期,请重新登录!!"});
    }

    next();
};

// 用户登录页面
Passport_Controller.renderUserLogin = function (req, res) {
    res.render('passport/passport_login');
};

// 用户登录提交
Passport_Controller.submitUserLogin = function (req, res) {
    var conditions = req.body;

    Passport.userLogin(conditions).then(function (result) {
        if (result.status == 200) {
            res.cookie(Utilities.Cookies.UserAccountToken, result.data.token, {
                path: "/",
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
            });
            result.data.userid = conditions.userid;
            res.cookie(Utilities.Cookies.UserAccount, JSON.stringify(result.data), {
                path: "/",
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
            });
        }

        res.json(result);
    }, function (err) {
        Log.console(err.message, {"interface": "UserLogin"});
        res.json(err);
    });
};

// 用户忘记密码页面
Passport_Controller.renderUserForgetPassword = function (req, res) {
    res.render('passport/passport_password_forget', {
        code: Passport.generateVerifyCode()
    });
};

// 用户忘记密码提交
Passport_Controller.submitUserForgetPassword = function (req, res) {
    var conditions = req.body;

    Passport.setUserForgetPassword(conditions).then(function (result) {
        res.json(result);
    }, function (err) {
        Log.console(err.message, {"interface": "setUserForgetPassword"});
        res.json(err);
    });
};

// 用户完善信息页面
Passport_Controller.renderUserCompleteAccount = function (req, res, next) {
    var user = JSON.parse(req.cookies[Utilities.Cookies.UserAccount]);
    var conditions = {};

    conditions.userid = user.userid;
    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];

    Passport.queryUserInfo(conditions).then(function (result) {
        res.render('passport/passport_modify', {
            navName: Passport_Controller.navName,
            navNames: Utilities.NavNames,
            TopNavigators: [{
                title: "首页"
            }, {
                title: "完善信息"
            }],
            data: result.data
        });
    }, function (err) {
        Log.console(err.message, {"interface": "queryUserInfo"});
        next(err);
    });
};

// 用户完善信息提交
Passport_Controller.submitUserCompleteAccount = function (req, res) {
    var conditions = req.body;

    Passport.setUserCompleteAccount(conditions).then(function (result) {
        res.json(result);
    }, function (err) {
        Log.console(err.message, {"interface": "setUserCompleteAccount"});
        res.json(err);
    });
};

// 用户修改密码页面
Passport_Controller.renderUserModifyPassword = function (req, res) {
    var user = req.cookies[Utilities.Cookies.UserAccount];

    res.render('passport/passport_password_modify', {
        navName: Passport_Controller.navName,
        navNames: Utilities.NavNames,
        TopNavigators: [{
            title: "首页"
        }, {
            title: "修改密码"
        }],
        data: {
            user: JSON.parse(user)
        }
    });
};

// 用户修改密码提交
Passport_Controller.submitUserModifyPassword = function (req, res) {
    var conditions = req.body;

    Passport.setUserModifyPassword(conditions).then(function (result) {
        res.json(result);
    }, function (err) {
        Log.console(err.message, {"interface": "setUserModifyPassword"});
        res.json(err);
    });
};

// 用户退出
Passport_Controller.submitUserLogout = function (req, res) {
    res.clearCookie(Utilities.Cookies.UserAccountToken, {path: "/"});
    res.clearCookie(Utilities.Cookies.UserAccount, {path: "/"});

    res.json({status: 200});
};

module.exports = Passport_Controller;
