(function ($) {
    $("#formTarget").on('load', function () {
        var content = document.getElementById("formTarget").contentDocument;
        var element = content.body;
        var $uiGoodForm = $("#good_form");

        try {
            var data = JSON.parse(element.innerText.trim());

            $uiGoodForm.find(".good-upload-url").attr("src", data.imageurl.showURI);
            $uiGoodForm.find(".good-upload-result").val(data.imageurl.showURI);
        } catch (e) {
            console.log(e);
        }
    });

    var Goods_Edit = {
        opts: {
            showSpeed: 400,
            hideSpeed: 200
        },
        init: function () {
            this.initEvents();
            this.uploadGoodImage();
        },
        uploadGoodImage: function () {
            var $uiGoodForm = $("#good_form");
            var $btnUpload = $uiGoodForm.find(".good-upload");

            $btnUpload.on("change", function (e) {
                setTimeout(function () {
                    $uiGoodForm.submit();
                }, 10);

                e.preventDefault();
            });
        },
        // 提交商品基本信息
        submitGoodsInfo: function () {
            var $uiGoodForm = $("#good_form");
            var $btnSubmit = $uiGoodForm.find(".sc-submit");
            var $isGoodEdit = $("#is_edit");
            var clickable = true;

            // 提交信息
            $btnSubmit.on("click", function (e) {
                e.preventDefault();

                var conditions = $uiGoodForm.serialize();

                $uiGoodForm.find(".sc-submit-tips").hide().removeClass("text-success,text-danger");
                if (!clickable || !$uiGoodForm.validate().form()) {
                    return;
                }
                clickable = false;

                if ($isGoodEdit.val().trim()) {
                    // 修改
                    $.post('/goods/EditGoods', conditions, function (res) {
                        if (res.status == 200) {
                            $uiGoodForm.find(".sc-submit-tips").show().html("修改商品成功!!").addClass("text-success");
                            // 添加成功
                            location.assign("/goods/List");
                        } else {
                            $uiGoodForm.find(".sc-submit-tips").show().html(res.message).addClass("text-danger");
                        }
                        clickable = true;
                    }).fail(function (err) {
                        console.log(err);
                        $uiGoodForm.find(".sc-submit-tips").show().html("网络异常, 修改商品失败!!")
                            .addClass("text-danger");
                    });
                } else {
                    // 添加
                    $.post('/goods/AddGoods', conditions, function (res) {
                        if (res.status == 200) {
                            $uiGoodForm.find(".sc-submit-tips").show().html("添加商品成功!!").addClass("text-success");
                            location.assign("/goods/List");
                        } else {
                            $uiGoodForm.find(".sc-submit-tips").show().html(res.message).addClass("text-danger");
                        }
                        clickable = true;
                    }).fail(function (err) {
                        console.log(err);
                        $uiGoodForm.find(".sc-submit-tips").show().html("网络异常, 添加商品失败!!")
                            .addClass("text-danger");
                    });
                }
            });
        },
        initEvents: function () {
            this.submitGoodsInfo();
        }
    };

    Goods_Edit.init();
})(jQuery);
