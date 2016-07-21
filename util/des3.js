var NCrypto = require('n-crypto');
var _ = require('underscore');

var base64 = require('./base64');
var conf = require('../conf')();

function _generateKey(secretKey) {
    var _secretKey = secretKey;
    var _hashMapping = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var _secretKey24 = [];

    if (typeof _secretKey != "string") {
        _secretKey = _secretKey.toString();
    }

    if (_secretKey.length >= 24) {
        _secretKey24 = _secretKey.substring(0, 24);
    } else {
        _secretKey24 = _secretKey + _hashMapping.substring(0, 24 - _secretKey.length);
    }

    return _secretKey24;
}

var nCrypto = new NCrypto({
    des_key: _generateKey(conf.hash_base)
});

var encryptType = 'DES';

exports.encrypt = function (str) {
    str = str + '';
    return base64.encode(nCrypto.encrypt(str, encryptType));
};

exports.decrypt = function (str) {
    return nCrypto.decrypt(base64.decode(str), encryptType);
};