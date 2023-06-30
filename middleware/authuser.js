const jwt = require("jsonwebtoken");
const authuser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("err");
    }
    const decodetoken = jwt.verify(token, "privateuser");
    if (!decodetoken) {
      throw new Error("err");
    }
    next();
  } catch (error) {
    res.json({ err: "Vui lòng đăng nhập để đặt hàng" });
  }
};
const authadmin = (req, res, next) => {
  try {
    let tokenadmin = req.headers.authorization.split(" ")[1];
    if (tokenadmin) {
      const decoded = jwt.decode(tokenadmin);
      if (decoded.role != "supporter") {
        const decodetoken = jwt.verify(tokenadmin, "privateadmin");
        if (!decodetoken) {
          throw new Error("err");
        }
        next();
      } else {
        throw new Error("err");
      }
    } else {
      throw new Error("err");
    }
  } catch (error) {
    res.json({ err: "Vui lòng đăng nhập bằng tài khoản ADMIN" });
    // console.log(error);
  }
};
const authsupporter = (req, res, next) => {
  try {
    let tokenadmin = req.headers.authorization.split(" ")[1];
    if (tokenadmin) {
      const decodetoken = jwt.verify(tokenadmin, "privateadmin");
      if (!decodetoken) {
        throw new Error("err");
      }
      next();
    } else {
      throw new Error("err");
    }
  } catch (error) {
    res.json({ err: "Vui lòng đăng nhập bằng tài khoản SUPPORTER" });
    // console.log(error);
  }
};
module.exports = {
  authuser,
  authadmin,
  authsupporter,
};
