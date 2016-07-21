(function ($) {
    $.getToday = function () {
        var date = new Date();

        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = month <= 9 ? "0" + month : month;
        var day = date.getDate();
        day = day >= 10 ? day : "0" + day;

        return year + "-" + month + "-" + day;
    };

    // 用户退出
    $(".sc-logout").on("click", function (e) {
        e.preventDefault();

        $.post('/pp/LogoutSubmit', null, function (res) {
            if (res.status == 200) {
                location.reload();
            }
        });
    });

    // 快捷充值
    $(".sc-ui-navbar .nav-quick-recharge, .sc-ui-quick-visit .quick-recharge").on("click", function (e) {
        e.preventDefault();

        $.UsersCardDialog.rechargeUsersCard("", true);

        $(".sc-ui-money-card").show(400);
        $(".sc-ui-dialog-overlay").show();
    });

    // 分页跳转
    $(".sc-ui-page-go a").on("click", function (e) {
        e.preventDefault();

        var page = $(".sc-ui-page-go [name='page']").val();
        var total = $(this).parents(".sc-ui-page").attr("data-max");
        var url = $(this).parents(".sc-ui-page").attr("data-url");

        page = parseInt(page) || 1;
        if (page < 1) {
            page = 1;
        }
        if (page > parseInt(total)) {
            page = total;
        }

        location.assign(url + "page=" + page);
    });

    // 快捷操作
    $(".sc-ui-quick-visit .quick-visit").gooeymenu({
        style: "vertical",
        hover: "#208ed3",
        vertical: {
            menuItemPosition: "glue",
            direction: "up"
        }
    });

    function queryPrintMessage() {
        if (location.href.indexOf('/orders/PrintList') > -1) {
            return;
        }

        $.getJSON("/orders/GetPrintList?printstate=0", function (res) {
            var total = res.totalnumber;

            $(".header-navbar-message").find(".badge").html(total);

            if (total > 0) {
                $(".header-tips-message").show().find(".message")
                    .html("您有<i class='num'>" + total + "</i>条订单没有打印小票, 请及时打印.");
            } else {
                $(".header-tips-message").hide();
            }

            $.time_print = setTimeout(function () {
                queryPrintMessage();
            }, 5000);
        }).fail(function (err) {
            console.log(err);
            clearTimeout($.time_print);
        });
    }

    queryPrintMessage();
})(jQuery);
