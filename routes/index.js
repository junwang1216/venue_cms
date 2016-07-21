var express = require('express');

var Passport = require("./passport");
var Dashboard = require("./dashboard");
var Message = require("./message");
var Venue = require("./venue");
var Orders = require("./orders");
var Users = require("./users");
var Goods = require("./goods");
var Reports = require("./reports");

// 路由
var router = express.Router();

// 通行证
router.get('/pp/Login', Passport.renderUserLogin);
router.post('/pp/LoginSubmit', Passport.submitUserLogin);
router.get('/pp/ForgetPassword', Passport.renderUserForgetPassword);
router.post('/pp/ForgetPasswordSubmit', Passport.submitUserForgetPassword);
router.get('/pp/CompleteAccount', Passport.userAuth, Passport.renderUserCompleteAccount);
router.post('/pp/CompleteAccountSubmit', Passport.submitUserCompleteAccount);
router.get('/pp/ModifyPassword', Passport.userAuth, Passport.renderUserModifyPassword);
router.post('/pp/ModifyPasswordSubmit', Passport.submitUserModifyPassword);
router.post('/pp/LogoutSubmit', Passport.submitUserLogout);

// 首页
router.get('/', Passport.userAuth, Dashboard.renderDashboardIndex);
router.get('/dashboard/Message', Message.renderDashboardMessage);
router.get('/dashboard/Helps', Dashboard.renderDashboardHelps); // TODO
router.get('/dashboard/Settings', Dashboard.renderDashboardSettings); // TODO
router.get('/dashboard/Print', Dashboard.renderDashboardPrint);

// 场地预订
router.get('/venue/Helps', Dashboard.renderVenueHelps);
router.get('/venue', Passport.userAuth, Venue.renderVenueList);
router.get('/venue/BlockBooking', Passport.userAuth, Venue.renderVenueBookingBlock);
router.get('/venue/getVenueSportsArea', Passport.userAuthJSON, Venue.getVenueSportsArea);
router.get('/venue/Query', Passport.userAuthJSON, Venue.queryVenueList);
router.post('/venue/BookingsVenue', Venue.submitVenueBookings);
router.post('/venue/PaymentVenue', Venue.submitVenuePayment);
router.post('/venue/LockVenueBookings', Venue.submitVenueBookingsLock);
router.post('/venue/UnLockVenueBookings', Venue.submitVenueBookingsUnLock);
router.post('/venue/SwitchVenueBookings', Venue.submitVenueBookingsSwitch);
router.post('/venue/OpenVenueBookings', Venue.submitVenueBookingsOpen);
router.post('/venue/CancelVenueBookings', Venue.SubmitVenueBookingsCancel);
router.post('/venue/AddVenueBookings', Venue.submitVenueBookingsAdd);
router.post('/venue/CancelVenueBookingsAdd', Venue.submitVenueBookingsAddCancel);
router.post('/venue/SubmitVenueBookingsBlock', Venue.SubmitVenueBookingsBlock);

// 订单管理
router.get('/orders', Passport.userAuth, Orders.renderOrdersList);
router.get('/orders/Exports', Passport.userAuth, Orders.renderOrdersListExports);
router.get('/orders/View/:id', Passport.userAuth, Orders.renderOrdersView);
router.get('/orders/View/:id/Exports', Passport.userAuth, Orders.renderOrdersViewExports);
router.get('/orders/PrintList', Passport.userAuth, Orders.renderPrintList);
router.get('/orders/GetPrintList', Passport.userAuthJSON, Orders.getPrintList);
router.get('/orders/GetPrintDetail/:id', Passport.userAuthJSON, Orders.getPrintOrderDetail);
router.post('/orders/MarkPrintState/:id', Orders.submitPrintStateMark);

// 会员管理
router.get('/users/Helps', Dashboard.renderUsersHelps);
router.get('/users', Passport.userAuth, Users.renderUsersList);
router.get('/users/Exports', Users.renderUsersListExports);
router.get('/users/View/:id', Passport.userAuth, Users.renderUsersView);
router.post('/users/Delete/:id', Users.submitUsersDelete);
router.get('/users/Add', Passport.userAuth, Users.renderUsersAdd);
router.post('/users/AddUsers', Users.submitUsersAdd);
router.get('/users/Edit/:id', Passport.userAuth, Users.renderUsersEdit);
router.post('/users/ModifyUsers', Users.submitUsersEdit);
router.post('/users/BindUsersCard', Users.submitUsersCardBind);
router.post('/users/LoseUsersCard', Users.submitUsersCardLose);
router.get('/users/:id/ViceCards', Passport.userAuth, Users.renderUsersViceCards);
router.post('/users/AddViceCard', Users.submitUsersViceCardAdd);
router.post('/users/saveRoles', Users.submitUsersRolesSave);
router.get('/users/Detail/:id', Passport.userAuthJSON, Users.getUsersDetail);
router.get('/users/Search', Passport.userAuthJSON, Users.getUsersSearch);
router.post('/users/RechargeCard', Users.submitUsersCardCharge);

// 商品管理
router.get('/goods/Helps', Dashboard.renderGoodsHelps);
router.get('/goods', Passport.userAuth, Goods.renderGoodsBuyList);
router.post('/goods/SaveGoodsCart', Goods.submitGoodsCartSave);
router.get('/goods/QueryGoodsCart', Passport.userAuthJSON, Goods.queryGoodsCart);
router.get('/goods/Cart', Passport.userAuth, Goods.renderGoodsCart);
router.post('/goods/DeleteGoodsCart', Goods.submitGoodsCartDelete);
router.post('/goods/PlusGoodsCartCount', Goods.submitGoodsCartCountPlus);
router.post('/goods/MinusGoodsCartCount', Goods.submitGoodsCartCountMinus);
router.post('/goods/BuyGoods', Goods.submitGoodsBuy);
router.post('/goods/submitGoodsConfirmBuy', Goods.submitGoodsConfirmBuy);
router.get('/goods/List', Passport.userAuth, Goods.renderGoodsList);
router.get('/goods/Exports', Passport.userAuth, Goods.renderGoodsExports);
router.get('/goods/Add', Passport.userAuth, Goods.renderGoodsAdd);
router.post('/goods/UploadGoodsImage', Goods.submitGoodsImageUpload);
router.post('/goods/AddGoods', Goods.submitGoodsAdd);
router.post('/goods/DeleteGoods', Goods.submitGoodsDelete);

// 报表统计
router.get('/reports/Helps', Dashboard.renderReportsHelps);
router.get('/reports', Reports.renderReportsIndex);
router.get('/reports/revenue', Reports.renderReportsRevenue);
router.get('/reports/revenue/Exports', Reports.renderReportsRevenueExports);
router.get('/reports/users', Reports.renderReportsUsers);
router.get('/reports/users/Exports', Reports.renderReportsUsersExports);

//对外接口
exports.root = router;
