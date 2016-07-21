(function ($) {
    // 场次预订配置
    var Venue_Settings = {
        // 初始化
        init: function () {
            this.initEvents();
        },
        initEvents: function () {
            var content = this;
            var $venueTimes = $(".sc-ui-venue-settings .venue-times");
            var $venueSave = $(".sc-ui-venue-settings .role-save");

            // 时间选择
            $venueTimes.on("click", "a.btn", function (e) {
                e.preventDefault();

                var $this = $(this);

                if ($this.hasClass("btn-default")) {
                    $this.addClass("btn-primary").removeClass("btn-default");
                } else if ($this.hasClass("btn-primary")) {
                    $this.addClass("btn-default").removeClass("btn-primary");
                }
            });

            // 保存
            $venueSave.on("click", function (e) {
                e.preventDefault();

                alert("保存成功");
            });
        }
    };

    Venue_Settings.init();

    // 会员角色设置
    var Role_Settings = {
        tpl: {
            role: function () {
                return '<a href="javascript:void(0)" class="btn btn-default">' +
                    '#ROLENAME# <span class="glyphicon glyphicon-remove text-danger"></span>' +
                    '</a>';
            }
        },
        // 初始化
        init: function () {
            this.initEvents();
        },
        initEvents: function () {
            var content = this;
            var $roleAdd = $(".sc-ui-role-settings .role-add");
            var $roleDelete = $(".sc-ui-role-settings .role-selected");
            var $roleSave = $(".sc-ui-role-settings .role-save");

            // 角色添加
            $roleAdd.on("click", function (e) {
                e.preventDefault();

                var $name = $(".sc-ui-role-settings #role-name");
                var $names = $(".sc-ui-role-settings #role-names");
                var $rolesSelected = $(".sc-ui-role-settings .role-selected");

                var name = $name.val().replace(/\s/g, "");
                var names = $names.val().replace(/\s/g, "");

                if (!name) return;

                if (names.indexOf(name) > -1) {
                    return alert("aaa");
                }

                $rolesSelected.append(content.tpl.role().replace(/#ROLENAME#/g, name));
            });

            // 角色删除
            $roleDelete.on("click", "a.btn", function (e) {
                e.preventDefault();

                var $this = $(this);

                // 删除条件
                $this.remove();
            });

            // 角色保存
            $roleSave.on("click", function (e) {
                e.preventDefault();

                var $name = $(".sc-ui-role-settings #role-name");
                var $names = $(".sc-ui-role-settings #role-names");

                alert("保存成功");
            });
        }
    };

    Role_Settings.init();
})(jQuery);
