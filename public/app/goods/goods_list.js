(function ($) {
    var Goods_List = {
        opts: {
            showSpeed: 400,
            hideSpeed: 200
        },
        init: function () {
            this.initEvents();
        },
        initEvents: function () {
            var $goodsSearchForm = $("#good_search_form");
            var $goodsSearch = $goodsSearchForm.find(".sc-search");
            var $goodsExport = $goodsSearchForm.find(".sc-export");
            var $goodsList = $(".goods-list");

            // 搜索
            $goodsSearch.on("click", function (e) {
                e.preventDefault();

                var conditions = $goodsSearchForm.serialize();

                location.assign('/goods/List?' + conditions);
            });

            // 导出
            $goodsExport.on("click", function (e) {
                e.preventDefault();

                var conditions = $goodsSearchForm.serialize();

                location.assign('/goods/Exports' + conditions);
            });

            // 删除
            $goodsList.on("click", ".goods-remove", function (e) {
                e.preventDefault();

                var $this = $(this);
                var message = '您确定要删除商品[' + $this.attr("data-id") + ']?';

                var $dialog = $.dialog({
                    content: message,
                    title: 'alert',
                    width: 'auto',
                    height: 'auto',
                    lock: true,
                    ok: function () {
                        $.post('/goods/DeleteGoods', {goodsid: $this.attr("data-id")}, function (res) {
                            if (res.status == 200) {
                                location.reload();
                            }
                        }).fail(function (err) {
                            console.log(err);
                        });
                    },
                    cancel: function () {
                        $dialog.close();
                    },
                    okText: '确定',
                    cancelText: '取消'
                });
            });
        }
    };

    Goods_List.init();
})(jQuery);

