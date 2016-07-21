(function ($) {
    var Venue_Orders = {
        init: function () {
            this.initEvents();
        },
        initEvents: function () {
            var $uiSearch = $(".sc-form-search");
            var $ordersSearchForm = $("#order_search_form");

            $uiSearch.on("click", ".sc-search", function (e) {
                e.preventDefault();

                var conditions = $ordersSearchForm.serialize();

                location.assign('/orders?' + conditions);
            });

            // 导出
            $uiSearch.on("click", ".sc-export", function (e) {
                e.preventDefault();

                var conditions = $ordersSearchForm.serialize();

                location.assign('/orders/Exports?' + conditions);
            });
        }
    };

    Venue_Orders.init();
})(jQuery);
