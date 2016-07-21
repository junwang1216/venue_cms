/**
 * 预订支付弹窗
 */
(function ($) {
    $.VenuePayDialog = {
        init: function (opts) {
            var $uiBookingPay = $(".sc-booking-pay");
            var $uiOverlay = $(".sc-ui-dialog-overlay");
            var $bookingVenueForm = $("#venue_pay_form");
            var clickable = true;

            $("#pay_order_no").val(opts.orderno);
            $("#pay_order_money").val(opts.paidamount);
            $uiBookingPay.show();
            $uiOverlay.show();


            $uiBookingPay.on("click", ".dialog-confirm", function (e) {
                e.preventDefault();

                var conditions = $bookingVenueForm.serialize();

                $bookingVenueForm.find(".sc-submit-tips").hide().removeClass("text-success,text-danger");
                if (!clickable) {
                    return;
                }
                clickable = false;

                $.post('/venue/PaymentVenue', conditions, function (res) {
                    if (res.status == 200) {
                        $bookingVenueForm.find(".sc-submit-tips").show().html("提交付款成功!!").addClass("text-success");
                        location.reload();
                    } else {
                        $bookingVenueForm.find(".sc-submit-tips").show().html(res.message).addClass("text-danger");
                    }
                    clickable = true;
                }).fail(function (err) {
                    console.log(err);
                    $bookingVenueForm.find(".sc-submit-tips").show().html("网络异常, 提交付款成功!!")
                        .addClass("text-danger");
                    clickable = true;
                });
            });

            $uiBookingPay.on("click", ".dialog-close", function (e) {
                e.preventDefault();

                $uiBookingPay.hide();
                $uiOverlay.hide();
                location.reload();
            });
        }
    };
})(jQuery);
