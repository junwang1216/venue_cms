var fs = require("fs");
var path = require("path");
var exec = require('child_process').exec;
var multiparty = require('multiparty');
var qiniu = require("qiniu");
var conf = require('../conf')();

var STATIC = {
    UploadDir: path.resolve(__dirname, '../public/images/files')
};

function _init() {
    fs.stat(STATIC.UploadDir, function (err) {
        if (err) {
            fs.mkdirSync(STATIC.UploadDir);
        }
    });
}

_init();

var Upload = function() {};

Upload.prototype = {};

Upload.STATIC = conf.upload_7N;

// 上传文件到服务器
Upload.uploadFile = function(req, uploadFieldName, callback) {
    var form = new multiparty.Form({uploadDir: STATIC.UploadDir});
    var data = {};

    form.parse(req, function(err, fields, files) {
        if (err) {
            console.log(err);
            return callback(err);
        }

        var file = files[uploadFieldName][0];

        data[uploadFieldName] = {};
        data[uploadFieldName].fileName = file.originalFilename;
        data[uploadFieldName].fileSize = file.size;
        data[uploadFieldName].fileId = path.basename(file.path);
        data[uploadFieldName].showURI = '/public/images/files/' + data[uploadFieldName].fileId;

        callback(data);
    });
};

// 上传文件到7N
Upload.uploadFile7N = function(req, callback) {
    var form = new multiparty.Form({uploadDir: STATIC.UploadDir});
    var data = {};

    qiniu.conf.ACCESS_KEY = Upload.STATIC.ACCESS_KEY;
    qiniu.conf.SECRET_KEY = Upload.STATIC.SECRET_KEY;

    // 构建上传策略函数
    function __uptoken(bucket, key) {
        var putPolicy = new qiniu.rs.PutPolicy(bucket + ":" + key);
        return putPolicy.token();
    }

    // 上传
    function __uploadFile(uptoken, key, localFile, cb) {
        var extra = new qiniu.io.PutExtra();
        qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
            if (!err) {
                // 上传成功， 处理返回值
                cb(null, ret.hash, ret.key);
            } else {
                // 上传失败， 处理返回代码
                cb(err);
            }
        });
    }

    form.parse(req, function(err, fields, files) {
        if (err) {
            console.log(err);
            return callback(err);
        }

        var file = files["imageurl"][0];
        var key = path.basename(file.path);
        var token = __uptoken(Upload.STATIC.BUCKET, key);

        data["imageurl"] = {};
        __uploadFile(token, key, file.path, function (err, hash, key) {
            var policy = new qiniu.rs.GetPolicy();
            var downloadUrl = policy.makeRequest(Upload.STATIC.DOMAIN + '/' + key);

            data["imageurl"].fileName = file.originalFilename;
            data["imageurl"].fileSize = file.size;
            data["imageurl"].fileId = path.basename(file.path);
            data["imageurl"].showURI = '/public/images/files/' + data["imageurl"].fileId;
            data["imageurl"].show7NURI = downloadUrl;

            console.log(data);

            callback(data);
        });
    });
};

// 清除上传文件
Upload.clearFiles = function () {
    exec('rm -rf ' + STATIC.UploadDir + '/*',function(err,out) {
        console.log(out);
        err && console.log(err);
    });
};

module.exports = Upload;
