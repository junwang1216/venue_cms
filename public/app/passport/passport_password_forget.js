(function ($) {
    var clickable = true;

    $(".sc-submit").on("click", function (e) {
        e.preventDefault();

        if (!clickable || !$("#sc-form-password").validate().form()) {
            return;
        }

        var $dialog = $.dialog({
            title: 'load',
            content: "确认邮件发送...",
            lock: true
        });

        $.post('/user/ForgetPasswordSubmit', $(".sc-ui-login form").serialize(), function (res) {
            if (res.status == 200) {
                location.assign('/pp/Login');
            } else {
                $(".sc-errors").html(res.message);
                $dialog.close();
            }
        });
    });
})(jQuery);
