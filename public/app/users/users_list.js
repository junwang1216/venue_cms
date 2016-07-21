(function ($) {
    var Users_List = {
        opts: {
            showSpeed: 400,
            hideSpeed: 200
        },
        init: function () {
            this.initEvents();
        },
        // 绑定会员卡弹窗
        bindUsersCard: function () {
            var content = this;
            var $usersList = $(".users-list");

            // 弹窗绑卡
            $usersList.on("click", ".users-bind-card", function (e) {
                e.preventDefault();

                var $this = $(this);

                var userNo = $this.attr("data-id");
                var userName = $this.attr("data-name");
                var userCard = $this.attr("data-card");

                $.UsersCardDialog.bindUsersCard(userNo, userName, userCard);

                $(".sc-ui-bind-card").show(content.opts.showSpeed);
                $(".sc-ui-dialog-overlay").show();
            });
        },
        // 充值弹窗
        moneyUsersCard: function () {
            var content = this;
            var $usersList = $(".users-list");

            // 弹窗充值
            $usersList.on("click", ".users-money-card", function (e) {
                e.preventDefault();

                var $this = $(this);

                $.UsersCardDialog.rechargeUsersCard($this.attr("data-id"));

                $(".sc-ui-money-card").show(content.opts.showSpeed);
                $(".sc-ui-dialog-overlay").show();
            });
        },
        initEvents: function () {
            var $usersSearchForm = $("#user_search_form");
            var $usersSearch = $usersSearchForm.find(".sc-search");
            var $userExport = $usersSearchForm.find(".sc-export");
            var $usersList = $(".users-list");

            // 搜索
            $usersSearch.on("click", function (e) {
                e.preventDefault();

                var conditions = $usersSearchForm.serialize();

                location.assign('/users?' + conditions);
            });

            // 导出
            $userExport.on("click", function (e) {
                e.preventDefault();

                location.assign("/users/Exports");
            });

            // 注销会员
            $usersList.on("click", ".users-remove", function (e) {
                e.preventDefault();

                var $this = $(this);
                var message = "";
                if ($this.attr("data-card")) {
                    message = '此会员已经绑定会员卡"' + $this.attr("data-card") + '",<br>' +
                        '您确定要注销会员"' + $this.attr("data-name") + '"吗?'
                } else {
                    message = '您确定要注销会员[' + $this.attr("data-name") + ']?';
                }

                var $dialog = $.dialog({
                    content: message,
                    title: 'alert',
                    width: 'auto',
                    height: 'auto',
                    lock: true,
                    ok: function () {
                        $.post('/users/Delete/' + $this.attr("data-id"), {}, function (res) {
                            if (res.status == 200) {
                                location.reload();
                            }
                        }).fail(function (err) {
                            console.log(err);
                        });
                    },
                    cancel: function () {
                        $dialog.close();
                    },
                    okText: '确定',
                    cancelText: '取消'
                });
            });

            // 排序
            $usersList.on("click", "th.sort", function (e) {
                e.preventDefault();

                var $this = $(this);

                if ($this.hasClass("sort-asc")) {
                    $this.addClass("sort-desc").removeClass("sort-asc");
                } else {
                    $this.addClass("sort-asc").removeClass("sort-desc");
                }

                var originalUrl = location.href.replace(/[\?&]sort=(.+)/, "");
                originalUrl = (originalUrl.indexOf("?") > -1) ? (originalUrl + "&") : (originalUrl + "?");

                location.assign(originalUrl + "sort=" + $this.attr("data-name"));
            });

            this.bindUsersCard();
            this.moneyUsersCard();
        }
    };

    Users_List.init();
})(jQuery);
