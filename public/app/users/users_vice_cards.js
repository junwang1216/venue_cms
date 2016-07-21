(function ($) {
    var Vice_Card = {
        init: function () {
            this.initEvents();
        },
        initEvents: function () {
            var $viceCardsList = $(".sc-ui-vice-cards");
            var $viceCardsAdd = $(".sc-ui-vice-cards-add .cards-add");
            var $viceFormAdd  = $("#user_add_vice_form");
            var clickable = true;

            // 副卡列表
            $viceCardsList.on("click", ".vice-cards-remove", function (e) {
                e.preventDefault();

                var $this = $(this);

                $this.parents("li").remove();
            });

            // 副卡添加
            $viceCardsAdd.on("click", function (e) {
                e.preventDefault();

                $viceFormAdd.find(".sc-submit-tips").hide().removeClass("text-success,text-danger");
                if (!clickable || !$viceFormAdd.validate().form()) {
                    return;
                }
                clickable = false;

                var viceNo = $('[name="vicecard"]').val();
                var cardNo = $('#user_card_no').val();

                $.post('/users/AddViceCard', {cardnumber: cardNo, vicephone: viceNo}, function (res) {
                    if (res.status == 200) {
                        $viceFormAdd.find(".sc-submit-tips").show().html("添加副卡成功!!").addClass("text-success");
                        location.reload();
                    } else {
                        $viceFormAdd.find(".sc-submit-tips").show().html(res.message).addClass("text-danger");
                    }
                    clickable = true;
                }).fail(function (err) {
                    console.log(err);
                    $viceFormAdd.find(".sc-submit-tips").show().html("网络异常, 添加副卡失败!!")
                        .addClass("text-danger");
                    clickable = true;
                });
            });
        }
    };

    Vice_Card.init();
})(jQuery);
