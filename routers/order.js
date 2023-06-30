const express = require("express");
const router = express.Router();
const ordercontroller = require("../controllers/order");
const { authuser } = require("../middleware/authuser");
// add product
router.post("/addorder", authuser, ordercontroller.addorder);
// get order
router.post("/getorder", authuser, ordercontroller.getorder);
// get detail order
router.post("/getdetailorder", authuser, ordercontroller.getdetailorder);
module.exports = router;
