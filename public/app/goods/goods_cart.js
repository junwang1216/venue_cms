(function ($) {
    var Goods_Cart_List = {
        init: function () {
            this.initEvents();

            var $uiGoodsSteps = $(".sc-goods-steps");

            // 初始化支付流程步骤
            $uiGoodsSteps.find(".goods-steps").steps({
                enableFinishButton: false,
                enablePagination: false,
                enableAllSteps: false
            });

            this.bindPayEvents();
        },
        // 支付流程事件绑定
        bindPayEvents: function () {
            var $uiGoodsSteps = $(".sc-goods-steps");
            var $uiOverlay = $(".sc-ui-dialog-overlay");
            var $uiUserForm = $("#venue_goods_pay_form");
            var $uiPayForm = $("#venue_goods_paid_form");
            var $btnBuy = $(".goods-buy-money");
            var clickable = true;

            // 结算
            $btnBuy.on("click", function (e) {
                e.preventDefault();

                $.getJSON('/goods/QueryGoodsCart', function (res) {
                    $uiUserForm.find("#pay_goods_amount").val(res.data.cartAmount);
                });

                $uiGoodsSteps.show();
                $uiOverlay.show();
            });

            $uiGoodsSteps.on("click", ".user-search", function (e) {
                e.preventDefault();

                var $dialog = $.dialog({
                    content: "数据加载...",
                    title: 'load',
                    width: 'auto',
                    height: 'auto',
                    lock: true
                });

                $.getJSON('/users/Search', {
                    name: $("#pay_goods_user_name").val().trim()
                }, function (result) {
                    var data = result.data;

                    if (result.status == 200) {
                        $('#pay_goods_user_class').val(data.memberlevel);
                        $('#pay_goods_member_number').val(data.memberid);
                        $('#pay_goods_member_name').val(data.membername);
                        $('#pay_goods_user_mobile').val(data.phone);
                    } else {
                        alert(result.message);
                    }

                    $dialog.close();
                });
            });

            // 提交购买
            $uiGoodsSteps.on("click", ".goods-pay", function (e) {
                e.preventDefault();

                var conditions = $uiUserForm.serialize();

                $uiUserForm.find(".sc-submit-tips").hide().removeClass("text-success,text-danger");
                if (!clickable || !$uiUserForm.validate().form()) {
                    return;
                }
                clickable = false;

                $.post('/goods/BuyGoods', conditions, function (res) {
                    if (res.status == 200) {
                        $uiUserForm.find(".sc-submit-tips").show().html("提交成功!!").addClass("text-success");
                        $uiGoodsSteps.find(".goods-steps").steps("next", 1);
                        $uiPayForm.find("#pay_goods_order_no").val(res.data.orderno);
                        $uiPayForm.find("#pay_goods_real_money").val(res.data.paidamount);
                    } else {
                        $uiUserForm.find(".sc-submit-tips").show().html(res.message).addClass("text-danger");
                    }
                    clickable = true;
                }).fail(function (err) {
                    console.log(err);
                    $uiUserForm.find(".sc-submit-tips").show().html("网络异常, 提交预订失败!!")
                        .addClass("text-danger");
                    clickable = true;
                });
            });

            // 确定支付
            $uiGoodsSteps.on("click", ".goods-pay-confirm", function (e) {
                e.preventDefault();

                var conditions = $uiPayForm.serialize();

                $uiPayForm.find(".sc-submit-tips").hide().removeClass("text-success,text-danger");
                if (!clickable || !$uiPayForm.validate().form()) {
                    return;
                }
                clickable = false;

                $.post('/goods/submitGoodsConfirmBuy', conditions, function (res) {
                    if (res.status == 200) {
                        $uiPayForm.find(".sc-submit-tips").show().html("提交成功, 3秒后自动关闭!!").addClass("text-success");
                        setTimeout(function () {
                            $uiGoodsSteps.hide();
                            $uiOverlay.hide();
                        }, 3000);
                    } else {
                        $uiUserForm.find(".sc-submit-tips").show().html(res.message).addClass("text-danger");
                    }
                    clickable = true;
                }).fail(function (err) {
                    console.log(err);
                    $uiUserForm.find(".sc-submit-tips").show().html("网络异常, 提交预订失败!!")
                        .addClass("text-danger");
                    clickable = true;
                });
            });

            // 关闭
            $uiGoodsSteps.find(".goods-steps-close").on("click", function (e) {
                e.preventDefault();

                $uiGoodsSteps.hide();
                $uiOverlay.hide();
            });
        },
        initEvents: function () {
            var $uiGoodsList = $(".goods-cart-list");

            // 购物车移除
            $uiGoodsList.on("click", ".goods-remove", function (e) {
                e.preventDefault();

                var $this = $(this);

                $.post("/goods/DeleteGoodsCart", {id: $this.attr("data-id")}, function (res) {
                    $this.parents("tr").remove();
                });
            });

            // 购物车加
            $uiGoodsList.on("click", ".goods-plus", function (e) {
                e.preventDefault();

                var $this = $(this);

                $.post("/goods/PlusGoodsCartCount", {id: $this.attr("data-id")}, function (res) {
                    $this.parents("td").find(".good-count").val(res.data.count);
                });
            });

            // 购物车减
            $uiGoodsList.on("click", ".goods-minus", function (e) {
                e.preventDefault();

                var $this = $(this);

                $.post("/goods/MinusGoodsCartCount", {id: $this.attr("data-id")}, function (res) {
                    $this.parents("td").find(".good-count").val(res.data.count);
                });
            });
        }
    };

    Goods_Cart_List.init();
})(jQuery);
