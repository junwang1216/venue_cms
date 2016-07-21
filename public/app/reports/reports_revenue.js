(function ($) {
    var option1 = {
        title : {
            text: '场地时间分布',
            subtext: '场馆的每个场地的营业时间,使用时间和空闲时间的分布汇总'
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            show: false,
            data:['营业时间','使用时间', '空闲时间']
        },
        toolbox: {
            show : false
        },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                data : ['1号场','2号场','3号场','4号场']
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'5月份',
                type:'bar',
                data:[10, 10, 30, 90],
                markLine : {
                    data : [
                        {type : 'average', name: '平均值'}
                    ]
                }
            },
            {
                name:'6月份',
                type:'bar',
                data:[30, 20, 60, 40],
                markLine : {
                    data : [
                        {type : 'average', name: '平均值'}
                    ]
                }
            },{
                name:'7月份',
                type:'bar',
                data:[70, 60, 40, 50],
                markLine : {
                    data : [
                        {type : 'average', name: '平均值'}
                    ]
                }
            }
        ]
    };

    var option2 = {
        title : {
            text: '场地使用率统计',
            subtext: '场馆的每个场地的使用率汇总统计'
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            show: false,
            data:['场地使用率']
        },
        toolbox: {
            show : false
        },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                data : ['1号场','2号场','3号场','4号场']
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'场地使用率',
                type:'bar',
                data:[0.1, 0.3, 0.9, 0.2],
                markLine : {
                    data : [
                        {type : 'average', name: '平均值'}
                    ]
                }
            }
        ]
    };


    /*var myChart1 = echarts.init($('#chart1')[0]);
    myChart1.setOption(option1);
    var myChart2 = echarts.init($('#chart2')[0]);
    myChart2.setOption(option2);*/
})(jQuery);

(function ($) {
    var Reports_Revenue = {
        init: function () {
            this.initEvents();
        },
        initEvents: function () {
            var $reportsSearchForm = $("#reports_search_form");
            var $reportsSearch = $reportsSearchForm.find(".sc-search");
            var $reportsToday = $reportsSearchForm.find(".sc-today");
            var $reportsSeven = $reportsSearchForm.find(".sc-week");
            var $reportsThirty = $reportsSearchForm.find(".sc-month");
            var $reportsExport = $reportsSearchForm.find(".sc-export");
            var $reportsDate = $reportsSearchForm.find('[name="selectdate"]');

            if ($reportsDate.val() != "") {
                $reportsSearchForm.find(".sc-" + $reportsDate.val()).removeClass("btn-primary").addClass("btn-warning");
            }

            // 搜索
            $reportsSearch.on("click", function (e) {
                e.preventDefault();

                $reportsSearchForm.find('[name="selectdate"]').val("");

                var conditions = $reportsSearchForm.serialize();

                location.assign('/reports/revenue?' + conditions);
            });

            // 今天
            $reportsToday.on("click", function (e) {
                e.preventDefault();

                $reportsSearchForm.find('[name="selectdate"]').val("today");

                var conditions = $reportsSearchForm.serialize();

                location.assign('/reports/revenue?' + conditions);
            });

            // 最近7天
            $reportsSeven.on("click", function (e) {
                e.preventDefault();

                $reportsSearchForm.find('[name="selectdate"]').val("week");

                var conditions = $reportsSearchForm.serialize();

                location.assign('/reports/revenue?' + conditions);
            });

            // 最近30天
            $reportsThirty.on("click", function (e) {
                e.preventDefault();

                $reportsSearchForm.find('[name="selectdate"]').val("month");

                var conditions = $reportsSearchForm.serialize();

                location.assign('/reports/revenue?' + conditions);
            });

            // 导出
            $reportsExport.on("click", function (e) {
                e.preventDefault();

                var conditions = $reportsSearchForm.serialize();

                location.assign('/reports/revenue/Exports?' + conditions);
            });
        }
    };

    Reports_Revenue.init();
})(jQuery);

