var _ = require('underscore');

var Utilities = require("../util");
var excel = require('node-excel-export');

var Exports = function() {
    return this;
};

Exports.prototype = {};

// 主题
Exports.Themes = {
    "Default": {
        headerBlue: {
            fill: {
                fgColor: {
                    rgb: 'FF0272BD'
                }
            },
            font: {
                color: {
                    rgb: 'FFFFFFFF'
                },
                sz: 14,
                bold: true
            }
        }
    }
};

// 导出excel
// conditions(可以多个Sheets): [{title:sheet标题, theme:主题, headers:{列标题,列标题...}, data:[{数据},{数据}...]}]
// 例如: [{
//          title: "报告1",
//          theme: "Default",
//          headers: {key1: "列标题1", key2: "列标题2"},
//          data: [
//              {key1: "列内容1", key2: "列内容2"},
//              {key1: "列内容1", key2: "列内容2"}
//          ]
//      }...]
Exports.exportsExcel = function (conditions, fileName, options) {
    fileName = fileName || "reports";

    function _genSpecification(headers, theme) {
        theme = theme || "Default";

        var specs = {};

        _.each(headers, function (value, key) {
            specs[key] = {
                displayName: value,
                headerStyle: Exports.Themes[theme].headerBlue
            };
        });

        return specs;
    }

    var exports = [];
    _.each(conditions, function (item, index) {
        exports.push({
            name: item.title || ("Sheet" + index),
            specification: _genSpecification(item.headers, item.theme),
            data: item.data
        });
    });

    return {
        report: excel.buildExport(exports),
        name: fileName + Utilities.formatDate('yyyy-MM-dd') + ".xlsx"
    };
};

module.exports = Exports;
