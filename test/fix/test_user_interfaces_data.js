var name = "测试" + Date.now().toString();
var mobile = "110" + Date.now().toString().substring(0, 8);
var idNumber = Date.now().toString() + Date.now().toString().substring(0, 5);
var cardNumber = Date.now().toString();
var rechargeAmount = Math.ceil(Math.random() * 10000);
var paymentMethod = Math.floor(Math.random() * 4);
var checkNumber = paymentMethod == 3 ? "03234341213" : "";

module.exports = {
    user : [{
        // pass
        data: {
            memberlevel : "0",
            membername : name,
            sex: "0",
            phone: mobile,
            idnumber: idNumber,
            addr: "北京市海淀区",
            paymenttype: "0",
            creditlimit: "100",
            validityperiod: "2016-12-31",
            remarks: "测试数据"
        },
        expect: {
            status: 200
        }
    }],
    card: [{
        // pass
        data: {
            cardnumber: cardNumber,
            rechargeamount: rechargeAmount + "",
            giftamount: Math.ceil(rechargeAmount / 10) + "",
            paymentmethod: paymentMethod + "",
            checknumber: checkNumber + "",
            remarks: cardNumber + "充值" + rechargeAmount,
            vicephone: "110098765443,11098765432,11087654321"
        },
        expect: {
            status: 200
        }
    }]
};