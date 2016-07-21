var assert = require("assert");
var async = require("async");
var _ = require("underscore");

var User = require('../../model/Users');
var Passport = require('../../model/Passport');
var Venue = require('../../model/Venue');
var specData = require("../fix/test_venue_interfaces_data");

// 测试预订的时间只能是晚上20:00~21:00且场地1和场地2
// 因此不要占用

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// 共享数据
var _data = {
    token: "786d9d0b-1ec1-46af-b310-bf33a26dfea8",
    siteclass: Venue.Sports.Shuttlecock.value,
    sdate: (Venue.makeAheadDate())[0].value,
    hdate: (Venue.makeAheadDate())[1].value
};

module.exports = function () {
    describe('-- 场地预订 --', function () {

        describe('-- 预订前提条件接口 -- ', function () {
            it('条件: 查询场地', function (done) {
                async.series({
                    action: function (cb) {
                        Venue.querySites(_data).then(function (result) {
                            assert.equal(result.status, 200, "预期结果:" + result.message);
                            assert.ok(result.data.length, "预期结果:" + result.message);
                            cb(null);
                        }, function (err) {
                            cb(new Error("接口异常:" + err));
                        });
                    }
                }, function (err) {
                    done(err);
                });
            });
            it('条件: 查询预订', function (done) {
                async.series({
                    action: function (cb) {
                        Venue.querySitesReservations(_data).then(function (result) {
                            assert.equal(result.status, 200, "预期结果:" + result.message);
                            cb(null);
                        }, function (err) {
                            cb(new Error("接口异常:" + err));
                        });
                    }
                }, function (err) {
                    done(err);
                });
            });
        });

        describe('-- 单个时间预订接口 -- ', function () {
            it('单个时间预订: 散客预订', function (done) {
                async.series({
                    action: function (cb) {
                        var testData = _.extend(specData.venue[0].data, _data);
                        testData.date = _data.sdate;

                        Venue.siteReservation(testData).then(function (result) {
                            assert.equal(result.status, 200, "预期结果:" + result.message);
                            assert.ok(result.data.orderno, "预期结果:" + result.message);
                            cb(null);
                        }, function (err) {
                            cb(new Error("接口异常:" + err));
                        });
                    }
                }, function (err) {
                    done(err);
                });
            });
            it('单个时间预订: 会员预订', function (done) {
                async.series({
                    action: function (cb) {
                        var testData = _.extend({membername: "测试"}, _data);

                        User.getUsersDetail(testData).then(function (result) {
                            assert.equal(result.status, 200, "预期结果:" + result.message);
                            assert.ok(result.data.memberid, "预期结果:" + result.message);

                            var _testData = _.extend(specData.venue[0].data, _data);
                            _testData.date = _data.hdate;
                            _testData.membernumber = result.data.memberid;
                            _testData.fitphone = result.data.phone;
                            _testData.userclass = result.data.memberlevel + "";
                            _testData.remarks = "会员预订";

                            Venue.siteReservation(_testData).then(function (result) {
                                assert.equal(result.status, 200, "预期结果:" + result.message);
                                assert.ok(result.data.orderno, "预期结果:" + result.message);
                                cb(null);
                            }, function (err) {
                                cb(new Error("接口异常:" + err));
                            });
                        }, function (err) {
                            cb(new Error("接口异常:" + err));
                        });
                    }
                }, function (err) {
                    done(err);
                });
            });
        });
    });
};
