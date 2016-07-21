(function ($) {
    var clickable = true;

    $(".sc-submit").on("click", function (e) {
        e.preventDefault();

        if (!clickable || !$("#sc-form-complete").validate().form()) {
            return;
        }

        var $dialog = $.dialog({
            title: 'load',
            content: "信息保存中...",
            lock: true
        });

        $.post('/user/ModifyPasswordSubmit', $("#sc-form-complete").serialize(), function (res) {
            if (res.status == 200) {
                $(".sc-errors").html("完善信息成功");
            } else {
                $(".sc-errors").html(res.message);
            }
            $dialog.close();
        });
    });
})(jQuery);
