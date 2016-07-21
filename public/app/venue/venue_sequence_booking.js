(function ($) {
    var Venue_Bookings = {
        tpl: {
            show: function () {
                return '<p class="ordered-channel-#ORDEREDCHANNEL#"></p><p class="ordered-user">#USRETYPE#</p>' +
                    '<p class="ordered-mobile">手机: #USERMOBILE#</p>';
            },
            bookingInfo: function () {
                return '<li class="list-group-item booking-order-no">预订编号: #ORDERNO#</li>' +
                    '<li class="list-group-item booking-site-no">场地编号: #SITENAME#</li>' +
                    '<li class="list-group-item booking-date">预订日期: #BOOKINGDATE#</li>' +
                    '<li class="list-group-item booking-time">预订时间: #STARTTIME#~#ENDTIME#</li>';
            }
        },
        init: function () {
            this.loadVenuesList();
            this.initEvents();
            this.toolbarMenu();
            this.sequenceCharts();
            this.bookingPayPop();
        },
        // 锁场
        // date: 锁定的日期, siteList: 锁定的场次列表, callback: 锁场结果返回
        lockVenueSites: function (date, siteList, callback) {
            $.post('/venue/LockVenueBookings', {date: date, list: JSON.stringify(siteList)}, function (res) {
                if (res.status == 200) {
                    callback(true);
                } else {
                    callback(false);
                }
            }).fail(function (err) {
                console.log(err);
                callback(false);
            });
        },
        // 搜索会员信息
        queryMemberInfo: function (conditions, callback) {
            $.getJSON('/users/Search', conditions, function (res) {
                var data = res.data;

                if (res.status == 200 && data.memberid) {
                    callback(true, data);
                } else {
                    callback(false, res.message);
                }
            }).fail(function (err) {
                console.log(err);
                callback(false, err);
            });
        },
        // 预订场地
        bookingVenueSites: function (conditions, callback) {
            $.post('/venue/BookingsVenue', conditions, function (res) {
                var data = res.data;

                if (res.status == 200 && data.orderno) {
                    callback(true, data);
                } else {
                    callback(false, res.message);
                }
            }).fail(function (err) {
                console.log(err);
                callback(false, err);
            });
        },
        // 预订支付
        PayVenueSites: function (conditions, callback) {
            $.post('/venue/PaymentVenue', conditions, function (res) {
                var data = res.data;

                if (res.status == 200) {
                    callback(true, data);
                } else {
                    callback(false, res.message);
                }
            }).fail(function (err) {
                console.log(err);
                callback(false, err);
            });
        },
        // 预订支付流程弹窗
        bookingPayPop: function () {
            var content = this;
            var $popBookingPay = $(".pop-booking-pay");
            var $popOverlayMask = $(".sc-ui-dialog-overlay");
            var clickable = true;

            // 初始化预订流程步骤
            $popBookingPay.find(".ui-booking-pay-steps").steps({
                enableFinishButton: false,
                enablePagination: false,
                enableAllSteps: false
            });

            // 关闭
            $popBookingPay.on("click", ".btn-booking-pay-close", function (e) {
                e.preventDefault();

                $popBookingPay.hide();
                $popOverlayMask.hide();
            });

            // 会员搜索
            $popBookingPay.on("click", ".btn-booking-pay-steps-user-search", function (e) {
                e.preventDefault();

                var $txtUserName = $("#txt_booking_pay_user_name");

                content.queryMemberInfo({name: $txtUserName.val().trim()}, function (status, data) {
                    if (status) {
                        $('#txt_booking_pay_user_class').val(data.memberlevel);
                        $('#txt_booking_pay_member_number').val(data.memberid);
                        $('#txt_booking_pay_member_name').val(data.membername);
                        $('#txt_booking_pay_user_mobile').val(data.phone);
                    } else {
                        alert(data);
                    }
                });
            });

            // 场地预订
            $popBookingPay.on("click", ".btn-booking-pay-steps-user-pay", function (e) {
                e.preventDefault();

                var $formBookingPayUser = $("#form_booking_pay_user");
                var conditions = $formBookingPayUser.serialize();

                $formBookingPayUser.find(".tips-message").hide().removeClass("text-success,text-danger");
                if (!clickable || !$formBookingPayUser.validate().form()) {
                    return;
                }
                clickable = false;

                content.bookingVenueSites(conditions, function (status, data) {
                    if (status) {
                        $popBookingPay.find(".ui-booking-pay-steps").steps("next", 1);
                        $("#txt_booking_pay_paying_order_no").val(data.orderno);
                        $("#txt_booking_pay_paying_order_money").val($("#txt_booking_pay_amount").val());
                        $("#txt_booking_pay_paying_list").val($("#txt_booking_pay_list").val());
                    } else {
                        $formBookingPayUser.find(".tips-message").show().html(data).addClass("text-danger");
                    }
                    clickable = true;
                });
            });

            // 预订支付
            $popBookingPay.on("click", ".btn-booking-pay-steps-paying-ok", function (e) {
                e.preventDefault();

                var $formBookingPayPaying = $("#form_booking_pay_paying");
                var conditions = $formBookingPayPaying.serialize();

                $formBookingPayPaying.find(".tips-message").hide().removeClass("text-success,text-danger");
                if (!clickable || !$formBookingPayPaying.validate().form()) {
                    return;
                }
                clickable = false;

                content.PayVenueSites(conditions, function (status, data) {
                    if (status) {
                        setTimeout(function () {
                            location.reload();
                        }, 3000);
                        $.Web_Print.printBookingSheet(data);
                    } else {
                        $formBookingPayPaying.find(".tips-message").show().html(data).addClass("text-danger");
                    }
                    clickable = true;
                });
            });
        },
        // 时序图上侧工具栏的功能操作
        toolbarMenu: function () {
            var content = this;
            var $uiVenueSequence = $(".ui-venue-sequence");
            var $popBookingPay = $(".pop-booking-pay");
            var $popOverlayMask = $(".sc-ui-dialog-overlay");
            var $btnVenueLock = $('.btn-venue-lock');
            var $btnVenueBooking = $('.btn-venue-booking');

            // 锁场
            $btnVenueLock.on("click", function (e) {
                e.preventDefault();

                var $this = $(this);
                var $list = $uiVenueSequence.find("td.selected");
                var listSize = $list.size();
                var list = [];

                if ($this.attr("working")) {
                    return;
                }
                $this.attr("working", "working");

                if (listSize == 0) {
                    $this.attr("working", "");
                    return alert("请先选中空闲的场地!!");
                }

                for (var i = 0; i < listSize; i++) {
                    list.push({
                        sitenumber: $list.eq(i).parents("tr").attr("data-area-value"),
                        starttime: $list.eq(i).attr("data-time-start"),
                        endtime: $list.eq(i).attr("data-time-end")
                    });
                }

                var $dialog = $.dialog({
                    content: '您确定要锁定这' + listSize + '个可预订场地吗?',
                    title: 'alert',
                    width: 'auto',
                    height: 'auto',
                    lock: true,
                    ok: function () {
                        content.lockVenueSites($this.attr("data-date"), list, function (status) {
                            if (status) {
                                location.reload();
                            }
                            $this.attr("working", "");
                        });
                    },
                    cancel: function () {
                        $dialog.close();
                        $this.attr("working", "");
                    },
                    okText: '确定',
                    cancelText: '取消'
                });
            });

            // 预订
            $btnVenueBooking.on("click", function (e) {
                e.preventDefault();

                var $list = $uiVenueSequence.find("td.selected");
                var listSize = $list.size();
                var list = [];
                var totalAmount = 0;

                if (listSize == 0) {
                    return alert("请先选中空闲的场地!!");
                }

                for (var i = 0; i < listSize; i++) {
                    var amount = parseInt($list.eq(i).attr("data-amount"));

                    totalAmount += amount;
                    list.push({
                        sitenumber: $list.eq(i).parents("tr").attr("data-area-value"),
                        starttime: $list.eq(i).attr("data-time-start"),
                        endtime: $list.eq(i).attr("data-time-end"),
                        amount: $list.eq(i).attr("data-amount")
                    });
                }

                $("#txt_booking_pay_list").val(JSON.stringify(list));
                $("#txt_booking_pay_amount").val(totalAmount.toFixed(2));
                $popBookingPay.show();
                $popOverlayMask.show();
            });

            content.makeDayBookings();
            content.makeWeekBookings();
        },
        loadVenuesList: function () {
            var content = this;

            $.getJSON('/venue/Query' + location.search, function (res) {
                if (res.status == 200) {
                    var venues = res.data;
                    var $bookingTips = $(".sc-booking-tips");

                    for (var i = 0; i < venues.length; i++) {
                        var venue = venues[i];
                        var $area = $('[data-area-value="' + venue.sitenumber + '"]');
                        var timeSelector = '[data-time-start="' + venue.starttime + '"]' +
                            '[data-time-end="' + venue.endtime + '"]';
                        var stateClass = $bookingTips.find('[data-value="' + venue.state + '"] span').attr("class");

                        // 场地预订的情况
                        if (stateClass == "locked") {
                            $area.find(timeSelector).removeClass().addClass(stateClass + "-icon " + stateClass)
                                .attr("data-id", venue.reservenumber).html("");
                        } else {
                            $area.find(timeSelector).removeClass().addClass(stateClass + "-icon " + stateClass)
                                .attr("data-id", venue.reservenumber).html(content.tpl.show()
                                .replace(/#USRETYPE#/, (venue.userclass != "3") ? "会员" : "散客")
                                .replace(/#ORDEREDCHANNEL#/, (venue.schedulchannel != "1") ? "mobile" : "pc")
                                .replace(/#USERMOBILE#/, "*" + venue.phone.substr(-4)));
                        }
                    }
                }
            });
        },
        // 日期选择弹窗
        makeDayBookings: function () {
            var $dayBookings = $(".sc-day-bookings");
            var $uiBookingDate = $(".sc-venue-booking-date");
            var $dayBookingsClose = $uiBookingDate.find(".dialog-close");
            var $dayBookingsConfirm = $uiBookingDate.find(".dialog-confirm");
            var $dayBookingsToday = $uiBookingDate.find(".dialog-today");
            var $dayBookingsSelect = $uiBookingDate.find("#select_date");

            $("#select_date").val($.getToday());

            // 日期预订弹窗
            $dayBookings.on("click", function (e) {
                e.preventDefault();

                $uiBookingDate.show();
                $(".sc-ui-dialog-overlay").show();
            });

            // 日期预订弹窗关闭
            $dayBookingsClose.on("click", function (e) {
                e.preventDefault();

                $uiBookingDate.hide();
                $(".sc-ui-dialog-overlay").hide();
            });

            // 日期预订今天
            $dayBookingsToday.on("click", function (e) {
                e.preventDefault();

                location.assign('/venue?date=');
            });

            // 日期预订弹窗确认
            $dayBookingsConfirm.on("click", function (e) {
                e.preventDefault();

                location.assign('/venue?date=' + $dayBookingsSelect.val());
            });
        },
        // 时序图功能操作
        sequenceCharts: function () {
            var content = this;
            var $areaSelected = $(".sc-booking-area .booking-confirm");
            var $popOverlayMask = $(".sc-ui-dialog-overlay");
            var $bookingDate = $(".sc-venue-date");
            var $bookingInfo = $(".sc-booking-info");

            function _showBookingInfo($this) {
                $bookingInfo.show().find(".booking-info").html(content.tpl.bookingInfo()
                    .replace(/#ORDERNO#/g, $this.attr("data-id").substring(0, 30) + "...")
                    .replace(/#SITENAME#/g, $this.parents("tr").attr("data-area-name"))
                    .replace(/#BOOKINGDATE#/g, $bookingDate.find(".date-select .date-active").attr("data-val"))
                    .replace(/#STARTTIME#/g, $this.attr("data-time-start"))
                    .replace(/#ENDTIME#/g, $this.attr("data-time-end")));
                $popOverlayMask.show();
            }

            // 空闲场地预订
            $areaSelected.on("click", "td.enable", function (e) {
                e.preventDefault();

                var $this = $(this);

                $this.addClass("selected").removeClass("enable").html("");
            });

            // 选择取消
            $areaSelected.on("click", "td.selected", function (e) {
                e.preventDefault();

                var $this = $(this);

                $this.addClass("enable").removeClass("selected").html("");
            });

            // 报警场地处理
            $areaSelected.on("click", "td.warning", function (e) {
                e.preventDefault();

                var $this = $(this);

                _showBookingInfo($this);
                $bookingInfo.find(".booking-switch").hide();
                $bookingInfo.find(".booking-lock").hide();
                $bookingInfo.find(".booking-unlock").hide();
                //$bookingInfo.find(".booking-pay").hide();
                $bookingInfo.find(".booking-cancel").show()
                    .attr("data-id", $this.attr("data-id"));
                $bookingInfo.find(".booking-open").show()
                    .attr("data-id", $this.attr("data-id"))
                    .attr("data-time", $this.attr("data-time-val"));
            });

            // 已预订场地处理
            $areaSelected.on("click", "td.ordered", function (e) {
                e.preventDefault();

                var $this = $(this);

                _showBookingInfo($this);
                $bookingInfo.find(".booking-unlock").hide();
                //$bookingInfo.find(".booking-pay").hide();
                $bookingInfo.find(".booking-cancel").show()
                    .attr("data-id", $this.attr("data-id"));
                $bookingInfo.find(".booking-open").show()
                    .attr("data-id", $this.attr("data-id"))
                    .attr("data-time", $this.attr("data-time-val"));
                $bookingInfo.find(".booking-lock").show()
                    .attr("data-id", $this.attr("data-id"));
                $bookingInfo.find(".booking-switch").show()
                    .attr("data-id", $this.attr("data-id"));
            });

            // 未付款场地处理
            $areaSelected.on("click", "td.unpaid", function (e) {
                e.preventDefault();

                var $this = $(this);

                _showBookingInfo($this);
                $bookingInfo.find(".booking-unlock").hide();
                $bookingInfo.find(".booking-open").hide();
                /*$bookingInfo.find(".booking-pay").show()
                 .attr("data-id", $this.attr("data-id"))
                 .attr("data-time", $this.attr("data-time-val"));*/
                $bookingInfo.find(".booking-cancel").show()
                    .attr("data-id", $this.attr("data-id"));
                $bookingInfo.find(".booking-lock").show()
                    .attr("data-id", $this.attr("data-id"));
                $bookingInfo.find(".booking-switch").show()
                    .attr("data-id", $this.attr("data-id"));
            });

            // 已锁定场地处理
            $areaSelected.on("click", "td.locked", function (e) {
                e.preventDefault();

                var $this = $(this);

                _showBookingInfo($this);
                $bookingInfo.find(".booking-cancel").hide();
                $bookingInfo.find(".booking-open").hide();
                $bookingInfo.find(".booking-lock").hide();
                $bookingInfo.find(".booking-switch").hide();
                //$bookingInfo.find(".booking-pay").hide();
                $bookingInfo.find(".booking-unlock").show()
                    .attr("data-id", $this.attr("data-id"));
            });

            // 已开场地处理
            $areaSelected.on("click", "td.doing", function (e) {
                e.preventDefault();

                var $this = $(this);

                _showBookingInfo($this);
                $bookingInfo.find(".booking-cancel").hide();
                $bookingInfo.find(".booking-open").hide();
                $bookingInfo.find(".booking-lock").hide();
                $bookingInfo.find(".booking-switch").hide();
                $bookingInfo.find(".booking-unlock").hide();
                //$bookingInfo.find(".booking-pay").hide();
            });
        },
        // 预定场地的周时间选择
        makeWeekBookings: function () {
            var $venueDate = $(".sc-venue-date");
            var $preWeekday = $venueDate.find(".date-slider-back");
            var $nextWeekday = $venueDate.find(".date-slider-forward");
            var $selectWeekday = $venueDate.find(".date-select");

            // 选中时间,平移位置
            if ($selectWeekday.find(".date-active").size() > 0) {
                var activeLeft = $selectWeekday.find(".date-active").offset().left;
                var nextLeft = $nextWeekday.offset().left;
                if (activeLeft - nextLeft > -60) { // 当选中的时间超过右侧箭头的left的60像素就会平移
                    $selectWeekday.css("margin-left", ($venueDate.width() - $selectWeekday.width()) + "px");
                }
            }

            // 周左移
            $preWeekday.on("click", function (e) {
                e.preventDefault();

                var left = parseInt($selectWeekday.css("margin-left").replace("px", ""));

                if (left < 0) {
                    $selectWeekday.css("margin-left", (left + 80) + "px");
                }
            });

            // 周右移
            $nextWeekday.on("click", function (e) {
                e.preventDefault();

                var maxOffsetLeft = parseInt($nextWeekday.offset().left);
                var offsetLeft = parseInt($selectWeekday.find("li:last").offset().left) + 80;
                var left = parseInt($selectWeekday.css("margin-left").replace("px", ""));

                if (offsetLeft > (maxOffsetLeft + 10)) {
                    $selectWeekday.css("margin-left", (left - 80) + "px");
                }
            });

            // 周选择
            $selectWeekday.on("click", "li", function (e) {
                e.preventDefault();

                var $this = $(this);

                if ($this.hasClass("date-active")) {
                    return;
                }

                $this.addClass("date-active").siblings().removeClass("date-active");

                location.assign('/venue?date=' + $this.attr("data-val"));
            });
        },
        // 处理场地已选择的操作
        dealVenueSelected: function () {
            var content = this;
            var $venueInfo = $(".sc-booking-info");
            var $popOverlayMask = $(".sc-ui-dialog-overlay");

            // 关闭
            $venueInfo.on("click", ".info-close", function (e) {
                e.preventDefault();

                $venueInfo.hide();
                $popOverlayMask.hide();
            });

            // 场地锁场
            $venueInfo.on("click", ".booking-lock", function (e) {
                e.preventDefault();

                var $this = $(this);

                if ($this.attr("working")) {
                    return;
                }
                $this.attr("working", "working");

                var $dialog = $.dialog({
                    content: '您确定要锁定此预订场地吗?',
                    title: 'alert',
                    width: 'auto',
                    height: 'auto',
                    lock: true,
                    ok: function () {
                        $.post('/venue/LockVenueBookings', {reservenumber: $this.attr("data-id")}, function (res) {
                            if (res.status == 200) {
                                location.reload();
                            }
                            $this.attr("working", "");
                        }).fail(function (err) {
                            console.log(err);
                            $this.attr("working", "");
                        });
                    },
                    cancel: function () {
                        $dialog.close();
                        $this.attr("working", "");
                    },
                    okText: '确定',
                    cancelText: '取消'
                });
            });

            // 场地解锁
            $venueInfo.on("click", ".booking-unlock", function (e) {
                e.preventDefault();

                var $this = $(this);

                if ($this.attr("working")) {
                    return;
                }
                $this.attr("working", "working");

                $.post('/venue/UnLockVenueBookings', {reservenumber: $this.attr("data-id")}, function (res) {
                    if (res.status == 200) {
                        location.reload();
                    }
                    $this.attr("working", "");
                }).fail(function (err) {
                    console.log(err);
                    $this.attr("working", "");
                });
            });

            // 场地切换
            $venueInfo.on("click", ".booking-switch", function (e) {
                e.preventDefault();

                var $this = $(this);

                $(".sc-venue-booking-switch").show();
                $("#switch_venue_reservenumber").val($this.attr("data-id"));
            });

            // 场地开场
            $venueInfo.on("click", ".booking-open", function (e) {
                e.preventDefault();

                var $this = $(this);

                if ($this.attr("working")) {
                    return;
                }
                $this.attr("working", "working");

                $.post('/venue/OpenVenueBookings', {reservenumber: $this.attr("data-id")}, function (res) {
                    if (res.status == 200) {
                        location.reload();
                    }
                    $this.attr("working", "");
                }).fail(function (err) {
                    console.log(err);
                    $this.attr("working", "");
                });
            });

            // 场地取消
            $venueInfo.on("click", ".booking-cancel", function (e) {
                e.preventDefault();

                var $this = $(this);

                if ($this.attr("working")) {
                    return;
                }
                $this.attr("working", "working");

                var $dialog = $.dialog({
                    content: '您确定要取消此预订场地吗?',
                    title: 'alert',
                    width: 'auto',
                    height: 'auto',
                    lock: true,
                    ok: function () {
                        $.post('/venue/CancelVenueBookings', {reservenumber: $this.attr("data-id")}, function (res) {
                            if (res.status == 200) {
                                location.reload();
                            }
                            $this.attr("working", "");
                        }).fail(function (err) {
                            console.log(err);
                            $this.attr("working", "");
                        });
                    },
                    cancel: function () {
                        $dialog.close();
                        $this.attr("working", "");
                    },
                    okText: '确定',
                    cancelText: '取消'
                });
            });
        },
        switchVenueBookings: function () {
            var $uiSwitchBookings = $(".sc-venue-booking-switch");
            var $bookingVenueForm = $("#venue_booking_switch_form");
            var clickable = true;

            // 关闭
            $uiSwitchBookings.on("click", ".switch-close", function (e) {
                e.preventDefault();

                $uiSwitchBookings.hide();
            });

            // 确认
            $uiSwitchBookings.on("click", ".switch-confirm", function (e) {
                e.preventDefault();

                var conditions = $bookingVenueForm.serialize();

                $bookingVenueForm.find(".sc-submit-tips").hide().removeClass("text-success,text-danger");
                if (!clickable) {
                    return;
                }
                clickable = false;

                $.post('/venue/SwitchVenueBookings', conditions, function (res) {
                    if (res.status == 200) {
                        location.reload();
                    }
                    clickable = true;
                }).fail(function (err) {
                    console.log(err);
                    clickable = true;
                });
            });
        },
        initEvents: function () {
            this.dealVenueSelected();
            this.switchVenueBookings();
        }
    };

    Venue_Bookings.init();
})(jQuery);
