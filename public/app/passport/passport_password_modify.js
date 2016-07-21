(function ($) {
    $(".sc-submit").on("click", function (e) {
        e.preventDefault();

        var $passwordForm = $("#sc-form-password");

        if (!$passwordForm.validate().form()) {
            return;
        }

        var $dialog = $.dialog({
            title: 'load',
            content: "密码修改中...",
            lock: true
        });

        $.post('/pp/ModifyPasswordSubmit', $passwordForm.serialize(), function (res) {
            if (res.status == 200) {
                $passwordForm.find(".sc-submit-tips").show().html("修改密码成功!!").addClass("text-success");
            } else {
                $passwordForm.find(".sc-submit-tips").show().html(res.message).addClass("text-danger");
            }
            $dialog.close();
        }).fail(function (err) {
            console.log(err);
            $passwordForm.find(".sc-submit-tips").show().html("网络异常, 修改密码失败!!")
                .addClass("text-danger");
        });
    });
})(jQuery);
