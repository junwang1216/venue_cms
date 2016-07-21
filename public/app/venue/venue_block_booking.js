(function ($) {
    var Venue_Bookings = {
        tpl: {
            BlockBooking: function () {
                return '<tr data-id="#BOOKING_ID#">' +
                    '<td>#BOOKING_SPORT#</td>' +
                    '<td>#BOOKING_START_DATE#~#BOOKING_END_DATE#</td>' +
                    '<td>#BOOKING_WEEK##BOOKING_START_TIME#~#BOOKING_END_TIME#</td>' +
                    '<td>#BOOKING_AREA#</td>' +
                    '<td><button type="button" class="btn btn-danger booking-cancel">' +
                    '<span class="glyphicon glyphicon-remove"></span> 取消 </button></td></tr>';
            }
        },
        init: function () {
            this.initEvents();
        },
        initEvents: function () {
            var content = this;
            this.queryMembers();
            this.querySportsArea();
            this.bookingVenue();

            var $txtStartTime = $("#block_time_start");
            var $txtEndTime = $("#block_time_end");
            //var $txtBookingWeek = $("#block_booking_week");

            // 起始时间改变
            $txtStartTime.on("change", function (e) {
                e.preventDefault();

                //var week = $txtBookingWeek.val();
                //var mayTime = $txtBookingWeek.find('option[value=' + week + ']').attr("data-time");
                var endTime = $txtEndTime.val();
                var startTime = $txtStartTime.val();

                var tmp = parseInt(startTime.replace(/^(\d+):00$/, "$1"));
                tmp++;
                tmp = (tmp > 9 ? "" + tmp : "0" + tmp) + ":00";

                if (startTime >= endTime) {
                    $txtEndTime.val(tmp);
                }
            });

            // 终止时间改变
            $txtEndTime.on("change", function (e) {
                e.preventDefault();

                //var week = $txtBookingWeek.val();
                //var mayTime = $txtBookingWeek.find('option[value=' + week + ']').attr("data-time");
                var endTime = $txtEndTime.val();
                var startTime = $txtStartTime.val();

                var tmp = parseInt(endTime.replace(/^(\d+):00$/, "$1"));
                tmp--;
                tmp = (tmp > 9 ? "" + tmp : "0" + tmp) + ":00";

                if (startTime >= endTime) {
                    alert("结束时间大于起始时间!!");
                    $txtStartTime.val(tmp);
                }
            });

            var $txtStartDate = $("#block_start_date");
            var $txtEndDate = $("#block_end_date");

            // 起始日期改变
            $txtStartDate.on("change", function (e) {
                e.preventDefault();

                var endDate = $txtEndDate.val();
                var startDate = $txtStartDate.val();

                if (startDate > endDate) {
                    $txtEndDate.val($(this).val());
                }
            });

            // 终止日期改变
            $txtEndDate.on("change", function (e) {
                e.preventDefault();

                var endDate = $txtEndDate.val();
                var startDate = $txtStartDate.val();

                if (startDate > endDate) {
                    alert("终止日期不能小于起始日期!!");
                    $txtStartDate.val($(this).val());
                }
            });

            var $uiBookingVenue = $(".sc-booking-venue");
            var $txtPayType = $("#block_pay_type");

            // 付款方式改变
            if ($txtPayType.val() == 1) {
                $uiBookingVenue.find(".booking-pay").parents(".form-group").show();
                $uiBookingVenue.find(".booking-confirm").parents(".form-group").hide();
            } else {
                $uiBookingVenue.find(".booking-pay").parents(".form-group").hide();
                $uiBookingVenue.find(".booking-confirm").parents(".form-group").show();
            }
            $txtPayType.on("change", function (e) {
                e.preventDefault();

                if ($txtPayType.val() == 1) {
                    $uiBookingVenue.find(".booking-pay").parents(".form-group").show();
                    $uiBookingVenue.find(".booking-confirm").parents(".form-group").hide();
                } else {
                    $uiBookingVenue.find(".booking-pay").parents(".form-group").hide();
                    $uiBookingVenue.find(".booking-confirm").parents(".form-group").show();
                }
            });

            var clickable = true;
            // 删除加场的场次
            $uiBookingVenue.on("click", ".booking-cancel", function (e) {
                e.preventDefault();

                var $this = $(this);
                var conditions = {
                    fieldnumber: $this.parents("tr").attr("data-id")
                };

                if (!clickable) {
                    return;
                }
                clickable = false;

                $.post('/venue/CancelVenueBookingsAdd', conditions, function (res) {
                    if (res.status == 200) {
                        $this.parents("tr").remove();
                    } else {
                        console.log(res);
                    }
                    clickable = true;
                }).fail(function (err) {
                    console.log(err);
                    clickable = true;
                });
            });

            var $bookingVenueForm = $("#user_venue_info_form");
            // 加场
            $uiBookingVenue.on("click", ".booking-add", function (e) {
                e.preventDefault();

                var $listVenues = $uiBookingVenue.find(".sc-booking-venues");
                var conditions = $bookingVenueForm.serialize();

                $bookingVenueForm.find(".sc-submit-tips").hide().removeClass("text-success,text-danger");
                if (!clickable || !$bookingVenueForm.validate().form()) {
                    return;
                }
                clickable = false;

                $.post('/venue/AddVenueBookings', conditions, function (res) {
                    var data = res.data;

                    if (res.status == 200) {
                        $("#batch_number").val(data.batchnumber);
                        $listVenues.append(content.tpl.BlockBooking()
                            .replace("#BOOKING_ID#", data.fieldnumber)
                            .replace("#BOOKING_SPORT#", $("#block_user_degree").find("option:selected").text().trim())
                            .replace("#BOOKING_START_DATE#", $("#block_start_date").val())
                            .replace("#BOOKING_END_DATE#", $("#block_end_date").val())
                            .replace("#BOOKING_START_TIME#", $("#block_time_start").find("option:selected").text().trim())
                            .replace("#BOOKING_END_TIME#", $("#block_time_end").find("option:selected").text().trim())
                            .replace("#BOOKING_AREA#", $("#block_venue_name").find("option:selected").text().trim())
                            .replace("#BOOKING_WEEK#", "(" + $("#block_booking_week").find("option:selected").text().trim() + ")"));
                    } else {
                        $bookingVenueForm.find(".sc-submit-tips").show().html(res.message).addClass("text-danger");
                    }
                    clickable = true;
                }).fail(function (err) {
                    console.log(err);
                    $bookingVenueForm.find(".sc-submit-tips").show().html("网络异常, 提交预订失败!!")
                        .addClass("text-danger");
                    clickable = true;
                });
            });
        },
        // 查询会员
        queryMembers: function () {
            var $uiBookingUser = $(".sc-booking-user");

            $uiBookingUser.on("click", ".user-search", function (e) {
                e.preventDefault();

                var $keywords = $("#block_search_name");

                $.getJSON('/users/Search', {
                    name: $keywords.val().trim()
                }, function (result) {
                    var data = result.data;

                    if (result.status == 200) {
                        $('[name="userclass"]').val(data.memberlevel);
                        $('[name="membernumber"]').val(data.memberid);
                        $('[name="membername"]').val(data.membername);
                        $('[name="fitphone"]').val(data.phone);
                    } else {
                        alert(result.message);
                    }
                });
            });
        },
        // 场地列表
        querySportsArea: function () {
            var $txtSiteClass = $("#block_user_degree");

            $.getJSON('/venue/getVenueSportsArea', {
                sport: $txtSiteClass.val().trim()
            }, function (result) {
                var data = result.data;
                var html = "";

                if (result.status == 200) {
                    for (var i = 0; i < data.length; i++) {
                        html += '<option value="' + data[i].sitenumber + '">' + data[i].sitename + '</option>';
                    }

                    $("#block_venue_name").html(html);
                } else {
                    alert(result.message);
                }
            });
        },
        // 场地预订和付款
        bookingVenue: function () {
            var $bookingVenue = $(".sc-booking-venue");
            var $bookingVenueForm = $("#user_venue_info_form");
            var clickable = true;

            // 预订不付款
            $bookingVenue.on("click", ".booking-confirm", function (e) {
                e.preventDefault();

                $bookingVenueForm.find(".sc-submit-tips").hide().removeClass("text-success,text-danger");
                if (!clickable) {
                    return;
                }
                clickable = false;

                $.post('/venue/SubmitVenueBookingsBlock', {"batchnumber": $("#batch_number").val()}, function (res) {
                    var data = res.data;

                    if (res.status == 200) {
                        $bookingVenueForm.find(".sc-submit-tips").show().html("提交预订成功!!").addClass("text-success");
                        setTimeout(function () {
                            location.reload();
                        }, 3000);
                        $.Web_Print.printBookingSheet(data);
                    } else {
                        $bookingVenueForm.find(".sc-submit-tips").show().html(res.message).addClass("text-danger");
                    }
                    clickable = true;
                }).fail(function (err) {
                    console.log(err);
                    $bookingVenueForm.find(".sc-submit-tips").show().html("网络异常, 提交预订失败!!")
                        .addClass("text-danger");
                    clickable = true;
                });
            });

            // 预订付款
            $bookingVenue.on("click", ".booking-pay", function (e) {
                e.preventDefault();

                $bookingVenueForm.find(".sc-submit-tips").hide().removeClass("text-success,text-danger");
                if (!clickable) {
                    return;
                }
                clickable = false;

                $.post('/venue/SubmitVenueBookingsBlock', {"batchnumber": $("#batch_number").val()}, function (res) {
                    var data = res.data;

                    if (res.status == 200) {
                        $bookingVenueForm.find(".sc-submit-tips").show().html("提交预订成功!!").addClass("text-success");

                        setTimeout(function () {
                            location.reload();
                        }, 3000);
                        $.Web_Print.printBookingSheet(data);
                    } else {
                        $bookingVenueForm.find(".sc-submit-tips").show().html(res.message).addClass("text-danger");
                    }
                    clickable = true;
                }).fail(function (err) {
                    console.log(err);
                    $bookingVenueForm.find(".sc-submit-tips").show().html("网络异常, 提交预订失败!!")
                        .addClass("text-danger");
                    clickable = true;
                });
            });
        }
    };

    Venue_Bookings.init();
})(jQuery);