var Q = require('q');
var conf = require('../conf')();
var _ = require('underscore');
var request = require('request');
var url = require('url');

function Connection (opts) {
    var __default = {
        dataSource: conf.remote_api,
        path: '',
        dataType: 'JSON',
        form: opts.form
    };

    this.options = _.extend(__default, opts);

    return this;
}

Connection.prototype.get = function (conditions) {
    var deferred = Q.defer();
    var requestUrl = url.resolve(this.options.dataSource, this.options.path);
    var result = '';

    if (conf.debug) {
        console.log("-----------请求数据条件-----------");
        console.log(JSON.stringify(conditions));
    }

    request({method: 'GET', url: requestUrl, qs: conditions})
        .on('error', function (err) {
            console.error(err.code);
            deferred.reject(err.code);
        })
        .on('data', function (data) {
            result += data;
        })
        .on('end', function() {
            if (conf.debug) {
                console.log("-----------返回数据结果-----------");
                console.log(JSON.stringify(result));
            }

            deferred.resolve(result);
        });

    return deferred.promise;
};

Connection.prototype.post = function (conditions) {
    var deferred = Q.defer();
    var requestUrl = url.resolve(this.options.dataSource, this.options.path);
    var result = '';
    var json = this.options.form ? false : true;

    if (conf.debug) {
        console.log("-----------请求数据条件-----------" + requestUrl);
        console.log(JSON.stringify(conditions));
    }

    if (!json) {
        request({
            method: 'POST',
            url: requestUrl,
            form: conditions,
            json: false
        }).on('error', function (err) {
            console.error(err.code);
            deferred.reject(err.code);
        }).on('data', function (data) {
            result += data;
        }).on('end', function() {
            if (conf.debug) {
                console.log("-----------返回数据结果-----------");
                console.log(JSON.stringify(result));
            }

            deferred.resolve(result);
        });
    } else {
        request({method: 'POST', url: requestUrl, json: json, body: conditions})
            .on('error', function (err) {
                console.error(err.code);
                deferred.reject(err.code);
            }).on('data', function (data) {
                result += data;
            })
            .on('end', function() {
                if (conf.debug) {
                    console.log("-----------返回数据结果-----------");
                    console.log(JSON.stringify(result));
                }

                deferred.resolve(result);
            });
    }

    return deferred.promise;
};

module.exports = Connection;
