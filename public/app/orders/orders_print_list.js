(function ($) {
    var Venue_Orders_Print = {
        init: function () {
            this.initEvents();
        },
        initEvents: function () {
            var $uiOrdersList = $(".sc-print-orders");

            // 打印
            $uiOrdersList.on("click", ".order-print", function (e) {
                e.preventDefault();

                var $this = $(this);

                $.getJSON('/orders/GetPrintDetail/' + $this.attr("data-no"), function (res1) {
                    // 改状态
                    $.post('/orders/MarkPrintState/' + $this.attr("data-no"), {}, function (res2) {
                        location.reload();
                    }).fail(function (err2) {
                        console.log(err2);
                    });

                    // 打印
                    $.Web_Print.printBookingSheet(res1.data);
                }).fail(function (err1) {
                    console.log(err1);
                });
            });

            // 重新打印
            $uiOrdersList.on("click", ".order-reprint", function (e) {
                e.preventDefault();

                $.getJSON('/orders/GetPrintDetail/' + $this.attr("data-no"), function (res) {
                    // 打印
                    $.Web_Print.printBookingSheet(res.data);
                }).fail(function (err) {
                    console.log(err);
                });
            });
        }
    };

    Venue_Orders_Print.init();
})(jQuery);
