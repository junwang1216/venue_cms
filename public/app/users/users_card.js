/**
 * 用户会员卡的绑定,挂失,充值
 */
(function ($) {
    $.UsersCardDialog = {
        // 充值
        rechargeUsersCard: function (userId, isQuick) {
            var $rechargeCardForm = $("#user_card_recharge_form");
            var $rechargeCardClose = $(".sc-ui-money-card .dialog-close");
            var $rechargeCardConfirm = $(".sc-ui-money-card .dialog-confirm");
            var $rechargeCardWay = $("#money_user_card_pay");
            var $rechargeCardSearch = $(".sc-ui-money-card .money-card-search");
            var clickable = true;

            function _getUserDetail(memberId) {
                var $dialog = $.dialog({
                    content: "数据加载...",
                    title: 'load',
                    width: 'auto',
                    height: 'auto',
                    lock: true
                });

                $.getJSON('/users/Detail/' + memberId, function (result) {
                    var data = result.data;

                    $rechargeCardForm.find(".sc-submit-tips").hide().removeClass("text-success, text-danger");
                    if (result.status == 200 && data.memberid) {
                        $('[name="memberid"]').val(data.memberid);
                        $('[name="cardnumber"]').val(data.cardnumber);
                        $('[name="memberlevel"]').val(data.memberlevel);
                        $('[name="membername"]').val(data.membername);
                        $('[name="balance"]').val(data.balance);
                        $('[name="validityperiod"]').val(data.validityperiod);
                    } else {
                        $rechargeCardForm.find(".sc-submit-tips").show().addClass("text-danger").html(result.message);
                    }

                    $dialog.close();
                });
            }

            if (isQuick) {
                $(".money-card-quick").show();

                $('[name="memberid"]').val("");
                $('[name="cardnumber"]').val("");
                $('[name="memberlevel"]').val("");
                $('[name="membername"]').val("");
                $('[name="balance"]').val("");
                $('[name="validityperiod"]').val("");
            } else {
                $(".money-card-quick").hide();
                _getUserDetail(userId);
            }

            // 查询
            $rechargeCardSearch.on("click", function (e) {
                e.preventDefault();

                _getUserDetail($("#money_user_card_keys").val());
            });

            // 支付方式改变
            $rechargeCardWay.on("change", function () {
                var $this = $(this);

                if ($this.val() == 3) {
                    $('#money_user_card_check').parents(".form-group").show();
                } else {
                    $('#money_user_card_check').parents(".form-group").hide();
                }
            });

            // 关闭
            $rechargeCardClose.on("click", function (e) {
                e.preventDefault();

                $(".sc-ui-money-card").hide();
                $(".sc-ui-dialog-overlay").hide();
            });

            // 确认
            $rechargeCardConfirm.on("click", function (e) {
                e.preventDefault();

                var conditions = $rechargeCardForm.serialize();

                $rechargeCardForm.find(".sc-submit-tips").hide().removeClass("text-success, text-danger");
                if (!clickable || !$rechargeCardForm.validate().form()) {
                    return;
                }
                clickable = false;

                $.post('/users/RechargeCard', conditions, function (res) {
                    if (res.status == 200) {
                        $rechargeCardForm.find(".sc-submit-tips").show().html("会员挂失成功!!").addClass("text-success");

                        $(".sc-ui-money-card").hide();
                        $(".sc-ui-dialog-overlay").hide();

                        location.reload();
                    } else {
                        $rechargeCardForm.find(".sc-submit-tips").show().html(res.message).addClass("text-danger");
                    }
                    clickable = true;
                }).fail(function (err) {
                    console.log(err);
                    $rechargeCardForm.find(".sc-submit-tips").show().html("网络异常, 会员充值失败!!")
                        .addClass("text-danger");
                    clickable = true;
                });
            });
        },
        // 绑定与挂失会员卡弹窗
        bindUsersCard: function (userNo, userName, userCard) {
            var $bindCardForm = $("#user_card_form");
            var $bindCardClose = $(".sc-ui-bind-card .dialog-close");
            var $bindCardConfirm = $(".sc-ui-bind-card .dialog-confirm");
            var clickable = true;

            var $isOpencard = $("#is_open_card");
            $("#user_no_bind").val(userNo);
            $("#user_name_bind").val(userName);
            $("#user_old_card_no_bind").val(userCard);
            $isOpencard.val(userCard);

            if ($isOpencard.val().trim()) {
                $(".bind-card-no").hide();
                $(".lose-card-no").show();
            } else {
                $(".bind-card-no").show();
                $(".lose-card-no").hide();
            }

            $bindCardForm.find(".sc-submit-tips").hide().removeClass("text-success, text-danger");

            // 关闭
            $bindCardClose.on("click", function (e) {
                e.preventDefault();

                $(".sc-ui-bind-card").hide();
                $(".sc-ui-dialog-overlay").hide();
            });

            // 确认
            $bindCardConfirm.on("click", function (e) {
                e.preventDefault();

                var conditions = $bindCardForm.serialize();

                $bindCardForm.find(".sc-submit-tips").hide().removeClass("text-success, text-danger");
                if (!clickable || !$bindCardForm.validate().form()) {
                    return;
                }
                clickable = false;

                if ($isOpencard.val().trim()) {
                    $.post('/users/LoseUsersCard', conditions, function (res) {
                        if (res.status == 200) {
                            $bindCardForm.find(".sc-submit-tips").show().html("会员挂失成功!!").addClass("text-success");

                            $(".sc-ui-bind-card").hide();
                            $(".sc-ui-dialog-overlay").hide();
                            location.assign("/users");
                        } else {
                            $bindCardForm.find(".sc-submit-tips").show().html(res.message).addClass("text-danger");
                        }
                        clickable = true;
                    }).fail(function (err) {
                        console.log(err);
                        $bindCardForm.find(".sc-submit-tips").show().html("网络异常, 会员挂失失败!!")
                            .addClass("text-danger");
                        clickable = true;
                    });
                } else {
                    $.post('/users/BindUsersCard', conditions, function (res) {
                        if (res.status == 200) {
                            $bindCardForm.find(".sc-submit-tips").show().html("会员发卡成功!!").addClass("text-success");

                            $(".sc-ui-bind-card").hide();
                            $(".sc-ui-dialog-overlay").hide();
                            location.assign("/users");
                        } else {
                            $bindCardForm.find(".sc-submit-tips").show().html(res.message).addClass("text-danger");
                        }
                        clickable = true;
                    }).fail(function (err) {
                        console.log(err);
                        $bindCardForm.find(".sc-submit-tips").show().html("网络异常, 会员发卡失败!!")
                            .addClass("text-danger");
                        clickable = true;
                    });
                }
            });
        }
    };
})(jQuery);
