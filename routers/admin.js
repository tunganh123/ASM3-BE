const express = require("express");
const router = express.Router();
const { authadmin, authsupporter } = require("../middleware/authuser");
const {
  getalltransaction,
  getallproduct,
  addproduct,
  upload,
  detailproduct,
  updatedetail,
  deletedetail,
  adminlogin,
  adminlogout,
  livechat,
  deletesession,
} = require("../controllers/admin");
//get all transaction
router.post("/adminlogin", adminlogin);
//get all transaction
router.get("/adminlogout", adminlogout);
//get all transaction
router.get("/getalltransaction", authadmin, getalltransaction);
//get all product
router.get("/getallproduct", authadmin, getallproduct);
//get all product
router.post("/addproduct", authadmin, addproduct);
//get detail product
router.post("/detailproduct", authadmin, detailproduct);
//get detail product
router.post("/updatedetail/:idproduct", updatedetail);
//get detail product
router.delete("/deletedetail/:idproduct", deletedetail);
//livechat
router.get("/livechat", authsupporter, livechat);
//livechat
router.post("/deletesession", deletesession);
module.exports = router;
