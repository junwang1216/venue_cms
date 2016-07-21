var Q = require('q');

var Utilities = require("../../util");
var Log = require("../../model/Log");

var Venue = require("../../model/Venue");

var Venue_Controller = function () {};

Venue_Controller.prototype = {};

Venue_Controller.navName = Utilities.NavNames.Venue;

// 场馆场地选择页面,默认是羽毛球,当天日期
Venue_Controller.renderVenueList = function (req, res, next) {
    var conditions = req.query;
    var aheadDates = Venue.makeAheadDate();

    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];
    conditions.siteclass = conditions.sport || Venue.Sports.Shuttlecock.value;
    conditions.date = conditions.date || aheadDates[0].value;

    Venue.querySites(conditions).then(function (result) {
        var sites = result.data;
        var data = {};

        // 当前的运动项目
        data.currentSport = conditions.sport || Venue.Sports.Shuttlecock.value;
        // 当前的日期
        data.currentDate = conditions.date || aheadDates[0].value;
        // 当前可预订的时间
        data.currentBookingsTime = Venue.WeekdayBookingsTime[(new Date(conditions.date)).getDay()];
        // 预订的场地
        data.sportsArea = sites;

        res.cookie(Utilities.Cookies.VenueSportSites, JSON.stringify(sites), {
            path: "/",
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });

        res.render('venue/venue_sequence_booking', {
            navName: Venue_Controller.navName,
            navNames: Utilities.NavNames,
            TopNavigators: [{
                title: "场地预订"
            }, {
                title: "场地时序图"
            }],
            // 可提前预订的日期
            AheadDates: aheadDates,
            // 可预订的运动项目
            Sports: Venue.Sports,
            // 可预订的运动项目的时间
            SportsTime: Venue.SportsTime,
            // 预订状态
            States: Venue.States,
            // 今天日期
            Today: Venue.getToday(),
            data: data
        });
    }, function (err) {
        Log.console(err.message, {"interface": "querySites"});
        next(err);
    });
};

// 根据运动项目和日期查询场地情况
Venue_Controller.queryVenueList = function (req, res) {
    var conditions = req.query;
    var aheadDates = Venue.makeAheadDate();

    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];
    conditions.siteclass = conditions.sport || Venue.Sports.Shuttlecock.value;
    conditions.date = conditions.date || aheadDates[0].value;

    Venue.querySitesReservations(conditions).then(function (result) {
        res.json(result);
    }, function (err) {
        Log.console(err.message, {"interface": "querySitesReservations"});
        res.json(err);
    });
};

// 包场预订页面
Venue_Controller.renderVenueBookingBlock = function (req, res) {
    var conditions = {};
    var aheadDates = Venue.makeAheadDate();

    conditions.page = conditions.page || 1;

    res.render('venue/venue_block_booking', {
        navName: Venue_Controller.navName,
        navNames: Utilities.NavNames,
        TopNavigators: [{
            title: "场地管理"
        }, {
            url: "/venue",
            title: "场地时序图"
        }, {
            title: "场地预订"
        }],
        // 可提前预订的日期
        AheadDates: aheadDates,
        // 可预订的运动项目
        Sports: Venue.Sports,
        // 可预订的运动项目的时间
        SportsTime: Venue.SportsTime,
        // 预订时的付款时机
        PaymentsTime: Venue.PaymentsTime,
        // 预订的时间
        WeekdayBookingsTime: Venue.WeekdayBookingsTime,
        data: {
            pagination: {
                current: conditions.page,
                total: 12,
                pages: Utilities.formatPageIndexes(conditions.page, 12),
                url: Utilities.formatPageUrl(req.originalUrl)
            }
        }
    });
};

// 查询场地
Venue_Controller.getVenueSportsArea = function (req, res) {
    var conditions = req.query;

    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];
    conditions.siteclass = conditions.sport || Venue.Sports.Shuttlecock.value;

    Venue.querySites(conditions).then(function (result) {
        res.json(result);
    }, function (err) {
        Log.console(err.message, {"interface": "querySites"});
        res.json(err);
    });
};

// 场地预订
Venue_Controller.submitVenueBookings = function (req, res) {
    var conditions = req.body;
    var account = JSON.parse(req.cookies[Utilities.Cookies.UserAccount]);

    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];
    conditions.list = JSON.parse(conditions.list);
    conditions.salesmannumber = account.salesmannumber;

    Venue.siteReservation(conditions).then(function (result) {
        result.data.paidamount = (conditions.list.length) * Venue.Sports.Shuttlecock.amount;

        res.json(result);
    }, function (err) {
        Log.console(err.message, {"interface": "siteReservation"});
        res.json(err);
    });
};

// 场地支付
Venue_Controller.submitVenuePayment = function (req, res) {
    var conditions = req.body;
    var account = JSON.parse(req.cookies[Utilities.Cookies.UserAccount]);

    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];

    Venue.individualPayment(conditions).then(function (result) {
        res.json({
            status: "200",
            message: "成功",
            data: {
                datetime: Utilities.formatDate("yyyy-MM-dd hh:mm:ss"),
                personname: account.username,
                orderno: conditions.orderno,
                orders: JSON.parse(conditions.list)
            }
        });
        //res.json(result);
    }, function (err) {
        Log.console(err.message, {"interface": "individualPayment"});
        res.json(err);
    });
};

// 场地锁定
Venue_Controller.submitVenueBookingsLock = function (req, res) {
    var conditions = req.body;

    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];
    conditions.siteclass = conditions.siteclass || Venue.Sports.Shuttlecock.value;

    if (!!conditions.reservenumber) {
        Venue.lockField(conditions).then(function (result) {
            res.json(result);
        }, function (err) {
            Log.console(err.message, {"interface": "lockField"});
            res.json(err);
        });
    } else {
        conditions.list = JSON.parse(conditions.list);
        Venue.lockFieldNoReservation(conditions).then(function (result) {
            res.json(result);
        }, function (err) {
            Log.console(err.message, {"interface": "lockFieldNoReservation"});
            res.json(err);
        });
    }
};

// 场地解锁
Venue_Controller.submitVenueBookingsUnLock = function (req, res) {
    var conditions = req.body;

    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];

    Venue.unlockField(conditions).then(function (result) {
        res.json(result);
    }, function (err) {
        Log.console(err.message, {"interface": "unlockField"});
        res.json(err);
    });
};

// 场地切换
Venue_Controller.submitVenueBookingsSwitch = function (req, res) {
    var conditions = req.body;

    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];

    Venue.changeField(conditions).then(function (result) {
        res.json(result);
    }, function (err) {
        Log.console(err.message, {"interface": "changeField"});
        res.json(err);
    });
};

// 场地开场
Venue_Controller.submitVenueBookingsOpen = function (req, res) {
    var conditions = req.body;

    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];

    Venue.manualOpen(conditions).then(function (result) {
        res.json(result);
    }, function (err) {
        Log.console(err.message, {"interface": "manualOpen"});
        res.json(err);
    });
};

// 场地取消
Venue_Controller.SubmitVenueBookingsCancel = function (req, res) {
    var conditions = req.body;

    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];

    Venue.reservationSiteCancel(conditions).then(function (result) {
        res.json(result);
    }, function (err) {
        Log.console(err.message, {"interface": "manualOpen"});
        res.json(err);
    });
};

// 场地加场
Venue_Controller.submitVenueBookingsAdd = function (req, res) {
    var conditions = req.body;

    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];

    Venue.siteReservationField(conditions).then(function (result) {
        res.json(result);
    }, function (err) {
        Log.console(err.message, {"interface": "siteReservationField"});
        res.json(err);
    });
};

// 场地加场取消
Venue_Controller.submitVenueBookingsAddCancel = function (req, res) {
    var conditions = req.body;

    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];

    Venue.siteReservationFieldDelete(conditions).then(function (result) {
        res.json(result);
    }, function (err) {
        Log.console(err.message, {"interface": "siteReservationFieldDelete"});
        res.json(err);
    });
};

// 场地确定
Venue_Controller.SubmitVenueBookingsBlock = function (req, res) {
    var conditions = req.body;
    var account = JSON.parse(req.cookies[Utilities.Cookies.UserAccount]);

    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];
    conditions.salesmannumber = account.salesmannumber;

    Venue.siteReservationBatch(conditions).then(function (result) {
        res.json(result);
    }, function (err) {
        Log.console(err.message, {"interface": "siteReservationBatch"});
        res.json(err);
    });
};

module.exports = Venue_Controller;
