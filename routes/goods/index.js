var Utilities = require("../../util");
var Log = require("../../model/Log");

var Exports = require("../../model/Exports");
var Goods = require("../../model/Goods");
var Upload = require("../../model/Upload");

var Goods_Controller = function () {};

Goods_Controller.prototype = {};

Goods_Controller.navName = Utilities.NavNames.Goods;

// 商品列表
Goods_Controller.renderGoodsBuyList = function (req, res, next) {
    var conditions = req.query;

    conditions.currentPage = conditions.page || "1";
    conditions.pageSize = conditions.pageSize || "12";
    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];

    Goods.goodsListQuery(conditions).then(function (result) {
        var total = Math.ceil(parseInt(result.totalnumber) / parseInt(conditions.pageSize)) || 0;

        res.render('goods/goods_buy_list', {
            navName: Goods_Controller.navName,
            navNames: Utilities.NavNames,
            TopNavigators: [{
                title: "商品管理"
            }, {
                title: "购买商品"
            }],
            conditions: conditions,
            data: {
                goods: result.data || [],
                carts: Utilities.Global.GoodsCart[conditions.token],
                pagination: {
                    current: parseInt(conditions.currentPage),
                    total: total,
                    pages: Utilities.formatPageIndexes(parseInt(conditions.currentPage), total),
                    url: Utilities.formatPageUrl(req.originalUrl)
                }
            }
        });
    }, function (err) {
        Log.console(err.message, {"interface": "goodsListQuery"});
        next(err);
    });
};

// 保存购物车
Goods_Controller.submitGoodsCartSave = function (req, res) {
    var conditions = req.body;
    var token = req.cookies[Utilities.Cookies.UserAccountToken];

    Utilities.Global.GoodsCart[token] = JSON.parse(conditions.carts);
    res.json({status: 200});
};

// 查询购物车数据
Goods_Controller.queryGoodsCart = function (req, res) {
    var conditions = {};

    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];

    var carts = Utilities.Global.GoodsCart[conditions.token] || {};

    res.json({
        status: 200,
        data: {
            carts: carts,
            cartAmount: Goods.calCarts(carts)
        }
    });
};

// 删除购物车
Goods_Controller.submitGoodsCartDelete = function (req, res) {
    var conditions = req.body;
    var token = req.cookies[Utilities.Cookies.UserAccountToken];

    delete Utilities.Global.GoodsCart[token][conditions.id];

    res.json({status: 200});
};

// 添加购物车数量
Goods_Controller.submitGoodsCartCountPlus = function (req, res) {
    var conditions = req.body;
    var token = req.cookies[Utilities.Cookies.UserAccountToken];
    var count = ++Utilities.Global.GoodsCart[token][conditions.id].goodsnumber;

    res.json({
        status: 200,
        data: {
            count: count
        }
    });
};

// 降低购物车数量
Goods_Controller.submitGoodsCartCountMinus = function (req, res) {
    var conditions = req.body;
    var token = req.cookies[Utilities.Cookies.UserAccountToken];
    var count = Utilities.Global.GoodsCart[token][conditions.id].goodsnumber;

    if (count <= 1) {
        count = 1;
    } else {
        count = --Utilities.Global.GoodsCart[token][conditions.id].goodsnumber;
    }

    res.json({
        status: 200,
        data: {
            count: count
        }
    });
};

// 加载购物车
Goods_Controller.renderGoodsCart = function (req, res) {
    var conditions = {};

    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];

    res.render('goods/goods_cart', {
        navName: Goods_Controller.navName,
        navNames: Utilities.NavNames,
        TopNavigators: [{
            title: "商品管理"
        }, {
            url: "/goods",
            title: "购买商品"
        }, {
            title: "购物车"
        }],
        data: {
            carts: Utilities.Global.GoodsCart[conditions.token]
        }
    });
};

// 提交商品购买
Goods_Controller.submitGoodsBuy = function (req, res) {
    var conditions = req.body;
    var account = JSON.parse(req.cookies[Utilities.Cookies.UserAccount]);

    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];
    conditions.salesmannumber = account.salesmannumber;
    conditions.list = Goods.formatCarts(Utilities.Global.GoodsCart[conditions.token]);

    Goods.goodsDuy(conditions).then(function (result) {
        res.json(result);
    }, function (err) {
        Log.console(err.message, {"interface": "goodsDuy"});
        res.json(err);
    });
};

// 提交商品确认购买
Goods_Controller.submitGoodsConfirmBuy = function (req, res) {
    var conditions = req.body;

    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];

    Goods.goodsConfirmPayment(conditions).then(function (result) {
        res.json(result);
    }, function (err) {
        Log.console(err.message, {"interface": "goodsConfirmPayment"});
        res.json(err);
    });
};

// 商品列表
Goods_Controller.renderGoodsList = function (req, res, next) {
    var conditions = req.query;

    conditions.currentPage = conditions.page || "1";
    conditions.pageSize = conditions.pageSize || "10";
    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];

    Goods.goodsListQuery(conditions).then(function (result) {
        var total = Math.ceil(parseInt(result.totalnumber) / parseInt(conditions.pageSize)) || 0;

        res.render('goods/goods_list', {
            navName: Goods_Controller.navName,
            navNames: Utilities.NavNames,
            TopNavigators: [{
                title: "商品管理"
            }, {
                url: "/goods",
                title: "购买商品"
            }, {
                title: "商品列表"
            }],
            conditions: conditions,
            data: {
                goods: result.data || [],
                pagination: {
                    current: parseInt(conditions.currentPage),
                    total: total,
                    pages: Utilities.formatPageIndexes(parseInt(conditions.currentPage), total),
                    url: Utilities.formatPageUrl(req.originalUrl)
                }
            }
        });
    }, function (err) {
        Log.console(err.message, {"interface": "goodsListQuery"});
        next(err);
    });
};

// 商品导出
Goods_Controller.renderGoodsExports = function (req, res, next) {
    var conditions = req.query;

    conditions.currentPage = conditions.page || "1";
    conditions.pageSize = conditions.pageSize || "10000";
    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];

    Goods.goodsListQuery(conditions).then(function (result) {
        var exports = {};

        exports.title = "商品管理";
        exports.headers = Goods.Headers;
        exports.data = result.data;

        var reports = Exports.exportsExcel([exports], "商品管理");

        res.attachment(reports.name);
        res.send(reports.report);
    }, function (err) {
        Log.console(err.message, {"interface": "goodsListQuery"});
        next(err);
    });
};

// 商品图片上传
Goods_Controller.submitGoodsImageUpload = function (req, res) {
    var uploadFieldName = "imageurl";
    Upload.uploadFile(req, uploadFieldName, function (data) {
        res.status(200).send(JSON.stringify(data));
    });
};

// 商品添加页面
Goods_Controller.renderGoodsAdd = function (req, res) {
    res.render('goods/goods_add', {
        navName: Goods_Controller.navName,
        navNames: Utilities.NavNames,
        TopNavigators: [{
            title: "商品管理"
        }, {
            url: "/goods",
            title: "购买商品"
        }, {
            url: "/goods/List",
            title: "商品列表"
        }, {
            title: "商品添加"
        }]
    });
};

// 提交商品添加
Goods_Controller.submitGoodsAdd = function (req, res) {
    var conditions = req.body;

    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];

    Goods.goodsAdd(conditions).then(function (result) {
        res.json(result);
    }, function (err) {
        Log.console(err.message, {"interface": "goodsAdd"});
        res.json(err);
    });
};

// 提交商品删除
Goods_Controller.submitGoodsDelete = function (req, res) {
    var conditions = req.body;

    conditions.token = req.cookies[Utilities.Cookies.UserAccountToken];

    Goods.goodsDelete(conditions).then(function (result) {
        res.json(result);
    }, function (err) {
        Log.console(err.message, {"interface": "goodsDelete"});
        res.json(err);
    });
};

module.exports = Goods_Controller;
