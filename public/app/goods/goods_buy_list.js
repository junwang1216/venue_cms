(function ($) {
    var Goods_Buy_List = {
        opts: {
            data: {}
        },
        calCartCount: function () {
            var goods = this.opts.data, id;
            var count = 0;

            for (id in goods) {
                count += goods[id].goodsnumber;
            }

            return count;
        },
        init: function () {
            this.initEvents();
        },
        initEvents: function () {
            var content = this;
            var $uiGoodsList = $(".goods-buy-list");
            var $btnCart = $(".good-cart-count");

            $.getJSON('/goods/QueryGoodsCart', function (res) {
                content.opts.data = res.data.carts;

                $btnCart.find(".badge").html(parseInt(content.calCartCount()));
            });

            $uiGoodsList.on("click", ".good-cart-add", function (e) {
                e.preventDefault();

                var $this = $(this);
                var goodId = $this.attr("data-id");

                if (!content.opts.data[goodId]) {
                    content.opts.data[goodId] = {
                        goodsid: goodId,
                        name: $this.parents(".goods-list-item").find(".good-name").html().trim(),
                        price: $this.parents(".goods-list-item").find(".good-price").html().trim(),
                        url: $this.parents(".goods-list-item").find(".good-image").attr("src"),
                        goodsnumber: 0
                    };
                }
                content.opts.data[goodId].goodsnumber++;

                $btnCart.find(".badge").html(content.calCartCount());
            });

            $btnCart.on("click", function (e) {
                e.preventDefault();

                $.post('/goods/SaveGoodsCart', {carts: JSON.stringify(content.opts.data)}, function (res) {
                    if (res.status == 200) {
                        location.assign("/goods/Cart");
                    }
                }).fail(function (err) {
                    console.log(err);
                });
            });
        }
    };

    Goods_Buy_List.init();
})(jQuery);
