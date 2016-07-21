(function ($) {
    var clickable = true;

    $(".user-login").on("click", function (e) {
        e.preventDefault();

        var $form = $("#sc-form-login");

        if (!clickable || !$form.validate().form()) {
            return;
        }

        var $dialog = $.dialog({
            title: 'load',
            content: "用户登录中...",
            lock: true
        });

        $.post('/pp/LoginSubmit', $form.serialize(), function (res) {
            var returnUrl = location.search;

            if (returnUrl) {
                returnUrl = location.search.replace(/^(.+return=)(.+)$/, "$2");
            } else {
                returnUrl = "/";
            }

            if (res.status == 200) {
                location.assign(returnUrl);
            } else {
                $(".sc-errors").html(res.message);
                $dialog.close();
            }
        });
    });
})(jQuery);
