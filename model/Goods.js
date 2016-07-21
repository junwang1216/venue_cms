var Q = require('q');
var _ = require('underscore');

var base = require('../connection/base');
var Utilities = require("../util");

var Goods = function() {
    return this;
};

Goods.prototype = {};

// 商品列表的headers
Goods.Headers = {
    photourl: "商品图片",
    goodsid: "商品编号",
    name: "商品标题",
    price: "商品价格",
    describe: "商品描述"
};

// 计算价格
Goods.calCarts = function (data) {
    var amount = 0;

    for (var k in data) {
        amount += data[k].price * data[k].goodsnumber;
    }

    return amount.toFixed(2);
};

// 格式化
Goods.formatCarts = function (data) {
    var carts = [];

    for (var k in data) {
        data[k].goodsnumber += "";
        carts.push(data[k]);
    }

    return carts;
};

// 添加商品
Goods.goodsAdd = function (conditions) {
    return base.post('goodsAdd', Utilities.formatRequest(conditions));
};

// 删除商品
Goods.goodsDelete = function (conditions) {
    return base.post('goodsDelete', Utilities.formatRequest(conditions));
};

// 修改商品
Goods.goodsUpdate = function (conditions) {
    return base.post('goodsUpdate', Utilities.formatRequest(conditions));
};

// 查询商品
Goods.goodsListQuery = function (conditions) {
    return base.post('goodsListQuery', Utilities.formatRequest(conditions));
};

// 购买商品
Goods.goodsDuy = function (conditions) {
    return base.post('goodsDuy', Utilities.formatRequest(conditions));
};

// 确认付款
Goods.goodsConfirmPayment = function (conditions) {
    return base.post('goodsConfirmPayment', Utilities.formatRequest(conditions));
};

module.exports = Goods;
