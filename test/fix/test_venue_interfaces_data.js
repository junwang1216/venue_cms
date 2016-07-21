var name = "测试" + Date.now().toString();
var mobile = "110" + Date.now().toString().substring(0, 8);

module.exports = {
    venue : [{
        // pass
        data: {
            schedulchannel : "1",
            userclass : "3",
            fitphone: mobile,
            remarks: "散客预订",
            paymenttype: "0",
            list: [{
                sitenumber: "001",
                starttime: "20:00",
                endtime: "21:00"
            }, {
                sitenumber: "002",
                starttime: "20:00",
                endtime: "21:00"
            }]
        },
        expect: {
            status: 200
        }
    }]
};