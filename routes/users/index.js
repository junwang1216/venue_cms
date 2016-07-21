var Q = require('q');
var Utilities = require("../../util");
var Log = require("../../model/Log");

var Passport = require("../../model/Passport");
var Users = require("../../model/Users");
var Exports = require("../../model/Exports");

var Users_Controller = function () {};

Users_Controller.prototype = {};

Users_Controller.navName = Utilities.NavNames.Users;

// 会员管理的会员列表页面
Users_Controller.renderUsersList = function (req, res, next) {
    var conditions = req.query;

    conditions.currentPage = conditions.page || "1";
    conditions.pageSize = conditions.pageSize || "10";
    conditions.state = conditions.state || Users.States.Normal.value;
    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];
    conditions.memberlevel = conditions.memberlevel || Users.CardLevels.General.value;

    Users.getUsersList(conditions).then(function (result) {
        var total = Math.ceil(parseInt(result.totalnumber) / parseInt(conditions.pageSize)) || 0;

         res.render('users/users_list', {
             navName: Users_Controller.navName,
             navNames: Utilities.NavNames,
             TopNavigators: [{
                 title: "会员管理"
             }, {
                 title: "会员列表"
             }],
             CardLevels: Users.CardLevels,
             PaymentWay: Users.PaymentWay,
             UserStates: Users.States,
             conditions: conditions,
             data: {
                 users: result.data || [],
                 pagination: {
                     current: parseInt(conditions.currentPage),
                     total: total,
                     pages: Utilities.formatPageIndexes(parseInt(conditions.currentPage), total),
                     url: Utilities.formatPageUrl(req.originalUrl)
                 }
             }
         });
    }, function (err) {
        Log.console(err.message, {"interface": "getUsersList"});
        next(err);
    });
};

// 会员导出
Users_Controller.renderUsersListExports = function (req, res) {
    var conditions = req.query;

    conditions.currentPage = conditions.page || "1";
    conditions.pageSize = conditions.pageSize || "10000";
    conditions.state = conditions.state || Users.States.Normal.value;
    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];
    conditions.memberlevel = conditions.memberlevel || Users.CardLevels.General.value;

    Users.getUsersList(conditions).then(function (result) {
        var exports = {};

        exports.title = "会员档案";
        exports.headers = Users.Headers;
        exports.data = result.data;

        var reports = Exports.exportsExcel([exports], "会员档案");

        res.attachment(reports.name);
        res.send(reports.report);
    }, function (err) {
        Log.console(err.message, {"interface": "getUsersList"});
        next(err);
    });
};

// 会员管理的会员详情页面
Users_Controller.renderUsersView = function (req, res, next) {
    var conditions = {memberid: req.params.id};

    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];

    Users.getUsersDetail(conditions).then(function (result) {
        res.render('users/users_detail', {
            navName: Users_Controller.navName,
            navNames: Utilities.NavNames,
            TopNavigators: [{
                title: "会员管理"
            }, {
                url: "/users",
                title: "会员列表"
            }, {
                title: "会员详情"
            }],
            CardLevels: Users.CardLevels,
            PaymentTypes: Users.PaymentTypes,
            data: {
                memberid: conditions.memberid,
                users: result.data
            }
        });
    }, function (err) {
        Log.console(err.message, {"interface": "getUsersDetail"});
        next(err);
    });
};

// 会员删除
Users_Controller.submitUsersDelete = function (req, res) {
    var conditions = {memberid: req.params.id};

    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];

     Users.deleteUsers(conditions).then(function (result) {
        res.json(result);
     }, function (err) {
         Log.console(err.message, {"interface": "deleteUsers"});
        res.json(err);
     });
};

// 会员管理的会员添加页面
Users_Controller.renderUsersAdd = function (req, res, next) {
    var conditions = {
        token: req.cookies[Utilities.Cookies.UserAccountToken]
    };

    Q.all([
        Passport.queryUsersList({}),
        Users.makeUsersNo(conditions)
    ]).then(function (results) {
        var users = results[1];
        var sales = results[0];

        res.render('users/users_add', {
            navName: Users_Controller.navName,
            navNames: Utilities.NavNames,
            TopNavigators: [{
                title: "会员管理"
            }, {
                url: "/users",
                title: "会员列表"
            }, {
                title: "会员添加"
            }],
            CardLevels: Users.CardLevels,
            PaymentTypes: Users.PaymentTypes,
            data: {
                sales: sales.data,
                memberid: users.data.memberid
            }
        });
    }, function (err) {
        Log.console(err.message, {"interface": "makeUsersNo"});
        next(err);
    });
};

// 添加会员
Users_Controller.submitUsersAdd = function (req, res) {
    var conditions = req.body;
    var account = JSON.parse(req.cookies[Utilities.Cookies.UserAccount]);

    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];
    conditions.salesmannumber = account.salesmannumber;

    Users.addUsersInfo(conditions).then(function (result) {
        res.json(result);
    }, function (err) {
        Log.console(err.message, {"interface": "addUsersInfo"});
        res.json(err);
    });
};

// 会员管理的会员编辑页面
Users_Controller.renderUsersEdit = function (req, res, next) {
    var userId = req.params.id;
    var conditions = {};

    conditions.memberid = userId;
    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];

    Q.all([
        Passport.queryUsersList({}),
        Users.getUsersDetail(conditions)
    ]).then(function (results) {
        var users = results[1];
        var sales = results[0];

        res.render('users/users_add', {
            navName: Users_Controller.navName,
            navNames: Utilities.NavNames,
            TopNavigators: [{
                title: "会员管理"
            }, {
                url: "/users",
                title: "会员列表"
            }, {
                title: "会员编辑"
            }],
            CardLevels: Users.CardLevels,
            PaymentTypes: Users.PaymentTypes,
            data: {
                isEdit: "1",
                memberid: conditions.memberid,
                sales: sales.data,
                users: users.data
            }
        });
    }, function (err) {
        Log.console(err.message, {"interface": "getUsersDetail"});
        next(err);
    });
};

// 编辑会员保存
Users_Controller.submitUsersEdit = function (req, res) {
    var conditions = req.body;
    var account = JSON.parse(req.cookies[Utilities.Cookies.UserAccount]);

    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];
    conditions.salesmannumber = account.salesmannumber;

     Users.modifyUsersInfo(conditions).then(function (result) {
        res.json(result);
     }, function (err) {
         Log.console(err.message, {"interface": "modifyUsersInfo"});
         res.json(err);
     });
};

// 会员绑卡
Users_Controller.submitUsersCardBind = function (req, res) {
    var conditions = req.body;

    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];

     Users.bindCard(conditions).then(function (result) {
        res.json(result);
     }, function (err) {
         Log.console(err.message, {"interface": "bindCard"});
         res.json(err);
     });
};

// 会员挂失
Users_Controller.submitUsersCardLose = function (req, res) {
    var conditions = req.body;

    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];

    Users.loseCard(conditions).then(function (result) {
        res.json(result);
    }, function (err) {
        Log.console(err.message, {"interface": "loseCard"});
        res.json(err);
    });
};

// 会员管理的会员副卡绑定页
Users_Controller.renderUsersViceCards = function (req, res, next) {
    var userId = req.params.id;
    var cardNo = req.query.card;
    var conditions = {};

    conditions.memberid = userId;
    conditions.cardnumber = cardNo;
    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];

    Q.all([
        Users.getUsersDetail(conditions),
        Users.viceCardList(conditions)
    ]).then(function (results) {
        var user = results[0];
        var list = results[1];

        var vicePhones = [];
        if (list.data && list.data.vicephone) {
            vicePhones = list.data.vicephone.split(",");
        }

        res.render('users/users_vice_cards', {
            navName: Users_Controller.navName,
            navNames: Utilities.NavNames,
            TopNavigators: [{
                title: "会员管理"
            }, {
                url: "/users",
                title: "会员列表"
            }, {
                title: "会员副卡"
            }],
            data: {
                users: user.data,
                list: vicePhones
            }
        });
    }, function (err) {
        Log.console(err.message, {"interface": "getUsersDetail和viceCardList"});
        next(err);
    });
};

// 副卡添加
Users_Controller.submitUsersViceCardAdd = function (req, res) {
    var conditions = req.body;

    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];

    Users.addViceCard(conditions).then(function (result) {
        res.json(result);
    }, function (err) {
        Log.console(err.message, {"interface": "addViceCard"});
        res.json(err);
    });
};

// 保存用户的角色
Users_Controller.submitUsersRolesSave = function (req, res) {
    res.json({
        status: 200
    });
};

// 获取会员详情
Users_Controller.getUsersDetail = function (req, res) {
    var userId = req.params.id;
    var conditions = {};

    conditions.memberid = userId;
    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];

    Users.getUsersDetail(conditions).then(function (result) {
        res.json(result);
    }, function (err) {
        Log.console(err.message, {"interface": "getUsersDetail"});
        res.json(err);
    });
};

// 获取会员详情
Users_Controller.getUsersSearch = function (req, res) {
    var userName = req.query.name;
    var conditions = {};

    conditions.membername = userName;
    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];

    Users.getUsersDetail(conditions).then(function (result) {
        res.json(result);
    }, function (err) {
        Log.console(err.message, {"interface": "getUsersDetail"});
        res.json(err);
    });
};

// 会员充值
Users_Controller.submitUsersCardCharge = function (req, res) {
    var conditions = req.body;

    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];

    Users.rechargeCard(conditions).then(function (result) {
        res.json(result);
    }, function (err) {
        Log.console(err.message, {"interface": "rechargeCard"});
        res.json(err);
    });
};

module.exports = Users_Controller;
