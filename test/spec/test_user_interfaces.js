var assert = require("assert");
var async = require("async");
var _ = require("underscore");

var User = require('../../model/Users');
var Passport = require('../../model/Passport');
var specData = require("../fix/test_user_interfaces_data");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// 没有测试注销会员和挂失会员卡

// 共享数据
var _data = {
    token: "786d9d0b-1ec1-46af-b310-bf33a26dfea8"
};

module.exports = function () {
    describe('-- 会员操作 --', function () {

        describe('-- 添加会员接口 -- ', function () {
            it('添加会员接口: 会员号生成', function (done) {
                async.series({
                    action: function (cb) {
                        User.makeUsersNo(_data).then(function (result) {
                            assert.equal(result.status, 200, "预期结果:" + result.message);
                            assert.ok(result.data.memberid, "预期结果:" + result.message);
                            _data.memberid = result.data.memberid;
                            cb(null);
                        }, function (err) {
                            cb(new Error("接口异常:" + err));
                        });
                    }
                }, function (err) {
                    done(err);
                });
            });
            it('添加会员接口: 销售员查询', function (done) {
                async.series({
                    action: function (cb) {
                        Passport.queryUsersList(_data).then(function (result) {
                            assert.equal(result.status, 200, "预期结果:" + result.message);
                            assert.ok(result.data[0], "预期结果:" + result.message);
                            _data.salesmannumber = result.data[0].username;
                            cb(null);
                        }, function (err) {
                            cb(new Error("接口异常:" + err));
                        });
                    }
                }, function (err) {
                    done(err);
                });
            });
            it('添加会员接口: 正确录入', function (done) {
                async.series({
                    action: function (cb) {
                        var testData = _.extend(specData.user[0].data, _data);

                        User.addUsersInfo(testData).then(function (result) {
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

        describe('-- 查询会员 --', function () {
            it('查询会员: 会员信息列表', function (done) {
                async.series({
                    action: function (cb) {
                        User.getUsersList({token: _data.token, pageSize: "10", currentPage: "1"}).then(function (result) {
                            assert.equal(result.status, 200, "预期结果:" + result.message);

                            var index = Math.floor(Math.random() * parseInt(result.totalnumber));
                            _data.selectMemberId = result.data[index].memberid;
                            cb(null);
                        }, function (err) {
                            cb(new Error("接口异常:" + err));
                        });
                    }
                }, function (err) {
                    done(err);
                });
            });
            it('查询会员: 根据会员号', function (done) {
                async.series({
                    action: function (cb) {
                        var testData = _data;

                        User.getUsersDetail(testData).then(function (result) {
                            assert.equal(result.status, 200, "预期结果:" + result.message);
                            assert.equal(result.data.memberid, _data.memberid, "预期结果:" + result.message);
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

        describe('-- 修改会员接口 -- ', function () {
            it('修改会员接口: 正确录入', function (done) {
                async.series({
                    action: function (cb) {
                        var testData = _.extend(specData.user[0].data, _data);

                        testData.membername = testData.membername.replace("修改", "修改1").replace("测试", "修改");
                        testData.memberid = _data.selectMemberId;

                        User.modifyUsersInfo(testData).then(function (result) {
                            assert.equal(result.status, 200, "预期结果:" + result.message);

                            User.getUsersDetail({token:_data.token, memberid:_data.selectMemberId}).then(function (result) {
                                assert.equal(result.status, 200, "预期结果:" + result.message);
                                assert.equal(result.data.membername, testData.membername, "预期结果:" + result.message);
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

    describe('-- 会员卡操作 --', function () {

        describe('-- 绑定会员卡 -- ', function () {
            it('绑定会员卡: 正确录入', function (done) {
                async.series({
                    action: function (cb) {
                        var testData = _.extend({
                            membername: specData.user[0].data.membername,
                            cardnumber: specData.card[0].data.cardnumber
                        }, _data);

                        User.bindCard(testData).then(function (result) {
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

        describe('-- 充值会员卡 -- ', function () {
            it('充值会员卡: 正确录入', function (done) {
                async.series({
                    action: function (cb) {
                        var testData = _.extend(specData.card[0].data, _data);

                        User.rechargeCard(testData).then(function (result) {
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

        describe('-- 绑定会员副卡 -- ', function () {
            it('会员副卡: 正确录入', function (done) {
                async.series({
                    action: function (cb) {
                        var testData = _.extend(specData.card[0].data, _data);

                        User.addViceCard(testData).then(function (result) {
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

            it('会员副卡: 查询副卡列表', function (done) {
                async.series({
                    action: function (cb) {
                        var testData = _.extend(specData.card[0].data, _data);

                        User.viceCardList(testData).then(function (result) {
                            assert.equal(result.status, 200, "预期结果:" + result.message);
                            assert.ok(result.data.vicephone, "预期结果:" + result.message);
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
    });
};
