(function ($) {
    $.Web_Print = {
        /*opts: {
            BookingTemplate: function (data) {
                var style = '<style type="text/css">' +
                    '.sc-print-content {width: 220px; font-size: 14px;}' +
                    '.sc-print-content .print-content-header,.sc-print-content .print-content-footer {font-size: 24px;font-weight: bold;}' +
                    '.sc-print-content .print-content-w2 {width: 40px;display: inline-block;}' +
                    '.sc-print-content .print-content-w4 {width: 70px;display: inline-block;}' +
                    '.sc-print-content .print-content-w6 {width: 100px;display: inline-block;}' +
                    '.sc-print-content .print-content-items p {margin-left: 16px;}' +
                    '.sc-print-content .print-content-items .print-content-item {margin-left: 4px;}' +
                    '</style>';
                var html = '<div class="sc-print-content">' +
                    '<p class="print-content-header">场地预订结账单</p>' +
                    '<p><span class="print-content-w4">打印时间:</span>2016-06-13 12:11:00</p>' +
                    '<p><span class="print-content-w4">收银员:</span>王晓红</p>' +
                    '<p><span class="print-content-w4">订单号:</span>214325543242234</p>' +
                    '<hr>' +
                    '<div class="print-content-items">' +
                    '<p class="print-content-item">1号场地</p>' +
                    '<p>2016-11-14 20:00~21:00 60.00元</p>' +
                    '</div>' +
                    '<div class="print-content-items">' +
                    '<p class="print-content-item">3号场地</p>' +
                    '<p>2016-11-14 20:00~21:00 60.00元</p>' +
                    '</div>' +
                    '<div class="print-content-items">' +
                    '<p class="print-content-item">3号场地</p>' +
                    '<p>2016-11-14 20:00~21:00 60.00元</p>' +
                    '</div>' +
                    '<p style="text-align: right">合计: 180.00元</p>' +
                    '<hr>' +
                    '<p><span class="print-content-w2">场地:</span>第一七一中学体育俱乐部</p>' +
                    '<p><span class="print-content-w2">地址:</span>北京市朝阳区某条路门号</p>' +
                    '<p><span class="print-content-w2">电话:</span>010-85223322</p>' +
                    '</div>';

                return style + html;
            },
            ConsumptionTemplate: function (data) {
                var style = '<style type="text/css">' +
                    '.sc-print-content {width: 220px; font-size: 14px;}' +
                    '.sc-print-content .print-content-header,.sc-print-content .print-content-footer {font-size: 24px;font-weight: bold;}' +
                    '.sc-print-content .print-content-w2 {width: 40px;display: inline-block;}' +
                    '.sc-print-content .print-content-w4 {width: 70px;display: inline-block;}' +
                    '.sc-print-content .print-content-w6 {width: 100px;display: inline-block;}' +
                    '.sc-print-content .print-content-items p {margin-left: 16px;}' +
                    '.sc-print-content .print-content-items .print-content-item {margin-left: 4px;}' +
                    '</style>';
                var html = '<div class="sc-print-content">' +
                    '<p class="print-content-header">商品消费单</p>' +
                    '<p><span class="print-content-w4">打印时间:</span>2016-06-13 12:11:00</p>' +
                    '<p><span class="print-content-w4">收银员:</span>王晓红</p>' +
                    '<p><span class="print-content-w4">订单号:</span>214325543242234</p>' +
                    '<hr>' +
                    '<div class="print-content-items">' +
                    '<p class="print-content-item"><span class="print-content-w6">农夫山泉</span><span class="print-content-w2">1</span>5.00元</p>' +
                    '</div>' +
                    '<div class="print-content-items">' +
                    '<p class="print-content-item"><span class="print-content-w6">巧克力</span><span class="print-content-w2">1</span>5.00元</p>' +
                    '</div>' +
                    '<div class="print-content-items">' +
                    '<p class="print-content-item"><span class="print-content-w6">农夫山泉</span><span class="print-content-w2">1</span>5.00元</p>' +
                    '</div>' +
                    '<p style="text-align: right">合计: 15.00元</p>' +
                    '<hr>' +
                    '<p><span class="print-content-w2">场地:</span>第一七一中学体育俱乐部</p>' +
                    '<p><span class="print-content-w2">地址:</span>北京市朝阳区某条路门号</p>' +
                    '<p><span class="print-content-w2">电话:</span>010-85223322</p>' +
                    '</div>';

                return style + html;
            }
        },*/
        // 散客预订打印
        getBookingSheetContent: function (data) {
            var style = '<style type="text/css">' +
                '.sc-print-content {width: 220px; font-size: 14px;}' +
                '.sc-print-content .print-content-header,.sc-print-content .print-content-footer {font-size: 24px;font-weight: bold;}' +
                '.sc-print-content .print-content-w2 {width: 40px;display: inline-block;}' +
                '.sc-print-content .print-content-w4 {width: 70px;display: inline-block;}' +
                '.sc-print-content .print-content-w6 {width: 100px;display: inline-block;}' +
                '.sc-print-content .print-content-items p {margin-left: 16px;}' +
                '.sc-print-content .print-content-items .print-content-item {margin-left: 4px;}' +
                '</style>';
            var html = '<div class="sc-print-content">' +
                '<p class="print-content-header">场地预订结账单</p>' +
                '<p><span class="print-content-w4">打印时间:</span>' + data.datetime + '</p>' +
                '<p><span class="print-content-w4">收银员:</span>' + data.personname + '</p>' +
                '<p><span class="print-content-w4">订单号:</span>' + data.orderno + '</p>' +
                '<hr>';

            for (var i = 0; i < data.orders.length; i++) {
                html +=
                    '<div class="print-content-items">' +
                    '<p class="print-content-item">' + data.orders[i].sitenumber + '</p>' +
                    '<p>' + data.orders[i].date + ' ' + data.orders[i].starttime + '~' + data.orders[i].endtime + ' 60.00元</p>' +
                    '</div>';
            }

            html += '<p style="text-align:right">合计: 180.00元</p>' +
                '<hr>' +
                '<p><span class="print-content-w2">场地:</span>第一七一中学体育俱乐部</p>' +
                '<p><span class="print-content-w2">地址:</span>北京市朝阳区某条路门号</p>' +
                '<p><span class="print-content-w2">电话:</span>010-85223322</p>' +
                '</div>';

            return style + html;
        },
        // 打印预订单
        printBookingSheet: function (data) {
            var LODOP = getLodop();

            LODOP.PRINT_INIT("场地预订结账单");
            LODOP.SET_PRINT_PAGESIZE(3, 650, 40, "");

            LODOP.ADD_PRINT_HTM(10, 12, "100%", "100%", this.getBookingSheetContent(data));

            //LODOP.PREVIEW();
            LODOP.PRINT();
        },
        // 批量预订打印
        getBookingBlockSheetContent: function (data) {
            var style = '<style type="text/css">' +
                '.sc-print-content {width: 220px; font-size: 14px;}' +
                '.sc-print-content .print-content-header,.sc-print-content .print-content-footer {font-size: 24px;font-weight: bold;}' +
                '.sc-print-content .print-content-w2 {width: 40px;display: inline-block;}' +
                '.sc-print-content .print-content-w4 {width: 70px;display: inline-block;}' +
                '.sc-print-content .print-content-w6 {width: 100px;display: inline-block;}' +
                '.sc-print-content .print-content-items p {margin-left: 16px;}' +
                '.sc-print-content .print-content-items .print-content-item {margin-left: 4px;}' +
                '</style>';
            var html = '<div class="sc-print-content">' +
                '<p class="print-content-header">场地预订结账单</p>' +
                '<p><span class="print-content-w4">打印时间:</span>' + data.datetime + '</p>' +
                '<p><span class="print-content-w4">收银员:</span>' + data.personname + '</p>' +
                '<p><span class="print-content-w4">订单号:</span>' + data.orderno + '</p>' +
                '<hr>';

            for (var i = 0; i < data.orders.length; i++) {
                html +=
                    '<div class="print-content-items">' +
                    '<p class="print-content-item">' + data.orders[i].sitenumber + '</p>' +
                    '<p>' + data.orders[i].startdate + '~' + data.orders[i].enddate + '~' + data.orders[i].scheduledweek + '</p>' +
                    '</div>';
            }

            html += '<p style="text-align:right">合计: 180.00元</p>' +
                '<hr>' +
                '<p><span class="print-content-w2">场地:</span>第一七一中学体育俱乐部</p>' +
                '<p><span class="print-content-w2">地址:</span>北京市朝阳区某条路门号</p>' +
                '<p><span class="print-content-w2">电话:</span>010-85223322</p>' +
                '</div>';

            return style + html;
        },
        // 打印批量预订单
        printBookingBlockSheet: function (data) {
            var LODOP = getLodop();

            LODOP.PRINT_INIT("场地预订结账单");
            LODOP.SET_PRINT_PAGESIZE(3, 650, 40, "");

            LODOP.ADD_PRINT_HTM(10, 12, "100%", "100%", this.getBookingBlockSheetContent(data));

            //LODOP.PREVIEW();
            LODOP.PRINT();
        }/*,
        // 打印消费单
        printConsumptionSheet: function (data) {
            var LODOP = getLodop();

            LODOP.PRINT_INIT("商品消费单");
            LODOP.SET_PRINT_PAGESIZE(3, 650, 40, "");

            LODOP.ADD_PRINT_HTM(10, 12, "100%", "100%", this.opts.ConsumptionTemplate(data));

            LODOP.PREVIEW();
            //LODOP.PRINT();
        },*/
        /*init: function () {
            var content = this;
            var data = "";

            $(".sc-print1").on("click", function (e) {
                e.preventDefault();

                content.printBookingSheet(data);
            });

            $(".sc-print2").on("click", function (e) {
                e.preventDefault();

                content.printConsumptionSheet(data);
            });
        }*/
    };

    //Web_Print.init();
})(jQuery);