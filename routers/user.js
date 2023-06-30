const express = require("express");
const router = express.Router();
const usercontroller = require("../controllers/user");
const authuser = require("../middleware/authuser");
// router.get("/", controllerz.home);
// router.post("/saveimg", controllerz.upload, controllerz.saveimg);
//register
router.post("/register", usercontroller.register);
//login
router.post("/login", usercontroller.login);

//logout
router.get("/logout", usercontroller.logout);
module.exports = router;
