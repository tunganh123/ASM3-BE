const express = require("express");
const router = express.Router();
const authuser = require("../middleware/authuser");
const productcontroller = require("../controllers/product");
// get all product
router.get("/getproduct", productcontroller.getproduct);
// get detail user
router.get("/getproduct/:idproduct", productcontroller.getdetailproduct);
module.exports = router;
