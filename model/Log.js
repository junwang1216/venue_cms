/**
 * 日志信息打印和输出
 * @returns {Log}
 * @constructor
 */
var Log = function() {
    return this;
};

Log.debug = false;

Log.prototype = {};

Log.ERRORS = {
    Exception : "网络请求发生异常,请稍后再试!!",
    Interface : "接口(#INTERFACE#)出现异常,请核查!!",
    LossAuth :  "登录缓存过期,请重新登录!!"
};

function _getDateNow() {
    var date = new Date();

    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
            date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
}

/**
 * 命令command输出log信息
 * @param message 消息内容
 * @param options 可配置的选项
 * -- interface 接口错误, 此字段是接口的名称
 * -- level 消息级别, 默认是ERROR
 */
Log.console = function (message, options) {
    options = options || {};
    options.level = options.level || "ERROR";

    if (options.interface) {
        console.log('[ERROR][' + _getDateNow() + '] -- ' +
            Log.ERRORS.Interface.replace(/#INTERFACE#/g, options.interface));
    }

    console.log('[' + options.level + '][' + _getDateNow() + '] -- ' + message);
};

module.exports = Log;
