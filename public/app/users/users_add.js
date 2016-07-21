(function ($) {
    var Users_Edit = {
        opts: {
            showSpeed: 400,
            hideSpeed: 200
        },
        init: function () {
            this.initEvents();
        },
        // 绑定会员卡弹窗
        bindUsersCard: function () {
            var userNo = $("#user_no").val();
            var userName = $("#user_name").val();
            var userCard = $("#user_card_no").val();

            $.UsersCardDialog.bindUsersCard(userNo, userName, userCard);
        },
        // 提交会员基本信息
        submitUsersInfo: function () {
            var content = this;
            var $bindCard = $(".sc-ui-submit .sc-submit");
            var $bindCardForm = $("#user_form");
            var $isUserEdit = $("#is_edit");
            var $isUserBind = $("#user_bind");
            var clickable = true;

            // 提交信息
            $bindCard.on("click", function (e) {
                e.preventDefault();

                var conditions = $bindCardForm.serialize();

                $bindCardForm.find(".sc-submit-tips").hide().removeClass("text-success,text-danger");
                if (!clickable || !$bindCardForm.validate().form()) {
                    return;
                }
                clickable = false;

                if ($isUserEdit.val().trim()) {
                    // 修改
                    $.post('/users/ModifyUsers', conditions, function (res) {
                        if (res.status == 200) {
                            $bindCardForm.find(".sc-submit-tips").show().html("修改会员成功!!").addClass("text-success");
                            // 添加成功
                            if ($isUserBind.prop("checked")) {
                                content.bindUsersCard();

                                $(".sc-ui-bind-card").show();
                                $(".sc-ui-dialog-overlay").show();
                            } else {
                                location.assign("/users");
                            }
                        } else {
                            $bindCardForm.find(".sc-submit-tips").show().html(res.message).addClass("text-danger");
                        }
                        clickable = true;
                    }).fail(function (err) {
                        console.log(err);
                        $bindCardForm.find(".sc-submit-tips").show().html("网络异常, 修改会员失败!!")
                            .addClass("text-danger");
                    });
                } else {
                    // 添加
                    $.post('/users/AddUsers', conditions, function (res) {
                        if (res.status == 200) {
                            $bindCardForm.find(".sc-submit-tips").show().html("添加会员成功!!").addClass("text-success");
                            // 添加成功
                            if ($isUserBind.prop("checked")) {
                                content.bindUsersCard();

                                $(".sc-ui-bind-card").show();
                                $(".sc-ui-dialog-overlay").show();
                            } else {
                                location.assign("/users");
                            }
                        } else {
                            $bindCardForm.find(".sc-submit-tips").show().html(res.message).addClass("text-danger");
                        }
                        clickable = true;
                    }).fail(function (err) {
                        console.log(err);
                        $bindCardForm.find(".sc-submit-tips").show().html("网络异常, 添加会员失败!!")
                            .addClass("text-danger");
                    });
                }
            });
        },
        initEvents: function () {
            this.submitUsersInfo();
        }
    };

    Users_Edit.init();
})(jQuery);
