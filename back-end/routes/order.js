const router = require("express").Router();
const { authenticationToken } = require("../controller/userAuth");
const { placeOrder, orderHistory, updateStatus, getAllOrders, getLatestOrder } = require("../controller/Order.js");

router.post("/placeorder", authenticationToken, placeOrder);
router.get("/orderhistory", authenticationToken, orderHistory);
router.put("/updatestatus/:id", authenticationToken, updateStatus);
router.get("/allorders", authenticationToken, getAllOrders);
router.get("/get-latest-order", getLatestOrder);

module.exports = router;