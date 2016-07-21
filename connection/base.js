var Q = require('q');

var Connection = require('./net');
var Errors = require('./errors');

exports.get = function (path, conditions) {
    var connection = new Connection({
        path: path
    });
    var deferred = Q.defer();

    connection.get(conditions).then(function (result) {
        var ret = null;

        try {
            ret = JSON.parse(result);

            if(ret.status == 200) {
                deferred.resolve(ret);
            } else {
                console.error(ret);
                deferred.reject(ret);
            }
        } catch (e) {
            console.error(result);
            console.error(e);

            deferred.reject({
                status: 500,
                message: Errors.Data_Format
            });
        }
    }, function (err) {
        console.error(err);

        deferred.reject({
            status: 500,
            message: Errors.Net_Request
        });
    });

    return deferred.promise;
};

exports.post = function (path, conditions, options) {
    var connection = new Connection({
        path: path,
        form: options && options.form
    });
    var deferred = Q.defer();

    connection.post(conditions).then(function (result) {
        var ret = null;

        try {
            ret = JSON.parse(result);

            if(ret.status == 200) {
                deferred.resolve(ret);
            } else {
                console.error(ret);
                deferred.reject(ret);
            }
        } catch (e) {
            console.error(result);
            console.error(e);

            deferred.reject({
                status: 500,
                message: Errors.Data_Format
            });
        }
    }, function (err) {
        console.error(err);

        deferred.reject({
            status: 500,
            message: Errors.Net_Request
        });
    });

    return deferred.promise;
};
