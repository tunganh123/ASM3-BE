const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const datauser = req.body;
    const useritem = await User.findOne({ email: datauser.email });
    if (!useritem) {
      const passok = await bcrypt.hash(datauser.password, 12);
      const usersv = new User({
        ...datauser,
        password: passok,
      });
      const sv = await usersv.save();
      if (!sv) {
        throw new Error("Save Err");
      }
    } else {
      return res.json({ err: "Trùng email" });
    }
    res.status(200).json({ ok: "Lưu thành công" });
  } catch (error) {
    console.log(error);
  }

  // const user
};
exports.login = async (req, res) => {
  try {
    const datalogin = req.body;
    // find user with email
    const useritem = await User.findOne({ email: datalogin.email });
    // if can't find return.
    if (!useritem) {
      throw new Error("loi");
    }
    // check password with bcrypt
    const bolen = await bcrypt.compare(datalogin.password, useritem.password);
    //if false return
    if (!bolen) {
      throw new Error("loi");
    }
    //create token
    const token = jwt.sign(
      {
        iduser: useritem._id,
        fullname: useritem.fullname,
        email: useritem.email,
        phone: useritem.phone,
      },
      "privateuser"
    );
    //create cookie in client
    // res.cookie("token", token, {
    //   // path: "/",
    //   // domain: "https://asm-3-be.vercel.app",/
    //   httpOnly: false,
    //   secure: true,
    //   sameSite: "none",
    // });
    res.json({ token: token });
  } catch (error) {
    console.log(error);
    res.json({ err: "Thông tin đăng nhập sai" });
  }
};
exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.end();
  } catch (error) {
    console.log(error);
  }
};
