var Q = require('q');
var mysql = require('mysql');

var MySQL = function () {
    return this;
};

MySQL.prototype = null;

MySQL.Config = {
    database: "wanwei_sports",
    host: 'localhost',
    port: 3306,
    user: "root",
    password: "123456"//,
    //debug: true
};

// 连接数据库
MySQL.connect = function () {
    MySQL.connection = mysql.createConnection(MySQL.Config);

    function _handleError(err) {
        if (err) {
            // 如果是连接断开，自动重新连接
            if (err.code == 'PROTOCOL_CONNECTION_LOST') {
                MySQL.connect();
            } else {
                console.log(err.stack || err);
            }
        }
    }

    MySQL.connection.connect(_handleError);
    MySQL.connection.on('error', _handleError);
};
MySQL.connect();

MySQL.query = function (conditions) {
    var deferred = Q.defer();

    MySQL.connection.query(conditions, function (err, rows) {
        if (err) {
            return deferred.reject({
                status: 500,
                message: err || '系统异常'
            });
        }

        if (rows.length == 0) {
            return deferred.reject({
                status: 500,
                message: '用户名密码错误'
            });
        }

        deferred.resolve({
            status: 200,
            message: "OK",
            data: rows
        });

        //MySQL.connection.end();
    });

    return deferred.promise;
};

module.exports = MySQL;
