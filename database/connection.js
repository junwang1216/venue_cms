var Q = require('q');
var MySQL = require('./db');

var Connection = function () {
    return this;
};

Connection.prototype = null;

/******************  通行证  **********************/
// 登录用户
Connection.passportLogin = function (conditions) {
    return MySQL.query({
        sql: 'SELECT * FROM `tb_salesman` WHERE `account` = ? and `password` = ?',
        values: [conditions.account, conditions.password]
    });
};

// 账户信息修改
Connection.passportInfoModify = function (conditions) {
    return MySQL.query({
        sql: 'UPDATE `tb_salesman` set realname = ?, idnumber = ?, mobile = ?, email = ? where id = ?',
        values: [conditions.realname, conditions.idnumber, conditions.mobile, conditions.email, conditions.id]
    });
};

// 账户密码修改
Connection.passportPasswordModify = function (conditions) {
    return MySQL.query({
        sql: 'UPDATE `tb_salesman` set password = ? where id = ?',
        values: [conditions.password, conditions.id]
    });
};

/******************  会员  **********************/

/******************  场地预订  **********************/

/******************  商品购买  **********************/

/******************  数据统计  **********************/

module.exports = Connection;
