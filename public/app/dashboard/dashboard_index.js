(function ($) {
    var option = {
        title : {
            text: '羽毛球场地使用情况',
            subtext: '1~8号场地的使用情况',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['未占用','1号场地','2号场地','3号场地','4号场地']
        },
        series : [
            {
                name: '使用情况',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:335, name:'未占用'},
                    {value:310, name:'1号场地'},
                    {value:234, name:'2号场地'},
                    {value:135, name:'3号场地'},
                    {value:1548, name:'4号场地'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    var myChart1 = echarts.init($('#chart1')[0]);
    myChart1.setOption(option);
    var myChart2 = echarts.init($('#chart2')[0]);
    myChart2.setOption(option);
})(jQuery);
