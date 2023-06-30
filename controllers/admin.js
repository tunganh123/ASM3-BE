const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Session = require("../models/session");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-";
    cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
  },
});
const storagechat = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
function fileFilter(req, file, cb) {
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg" ||
    file.mimetype == "video/mp4" ||
    file.mimetype == "video/mpeg"
  ) {
    cb(null, true);
  } else {
    req.fileValidationError = "File must be JPEG or PNG";
    cb("File must be JPEG or PNG", false);
  }
}
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  // limits: { files: 4 },
}).array("img", 4);
const uploadimgchat = multer({
  storage: storagechat,
  fileFilter: fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // Giới hạn dung lượng tệp là 20MB
}).single("imgchat");
// exports.upload = upload;

const getalltransaction = async (req, res) => {
  try {
    const alltran = await Order.find();
    const user = await User.find();
    const usercount = user.length;
    res.status(200).json({
      alltransaction: alltran,
      usercount: usercount,
    });
  } catch (error) {
    console.log(error);
  }
};
const getallproduct = async (req, res) => {
  try {
    const allproduct = await Product.find();
    res.status(200).json(allproduct);
  } catch (error) {
    res.json({ err: "errr" });
    console.log(error);
  }
};
const addproduct = async (req, res) => {
  upload(req, res, async (err) => {
    try {
      if (err) {
        throw new Error(err);
        // return res.json({ err: err });
      }
      const data = req.body;
      const filesobj = req.files;
      let objimg = {};
      let i = 1;
      filesobj.forEach((item) => {
        objimg[`img${i}`] = item.path;
        i++;
      });
      const productitem = new Product({
        ...data,
        short_desc: data.shortdesc,
        long_desc: data.longdesc,
        ...objimg,
      });
      const blen = await productitem.save();
      if (!blen) {
        throw new Error("Err Save");
      }
      res.json({ a: "b" });
    } catch (error) {
      // console.log(error.message);
      res.json({ err: error.message });
    }
  });
};
const detailproduct = async (req, res) => {
  try {
    const idproduct = req.body.idproduct;
    const productitem = await Product.findById(idproduct);
    res.status(200).json(productitem);
  } catch (error) {
    console.log(error);
  }
};
const updatedetail = async (req, res) => {
  try {
    const idproduct = req.params["idproduct"];
    const productitem = await Product.findByIdAndUpdate(idproduct, req.body);
    if (!productitem) {
      throw new Error({ err: "Update Loi" });
    }
  } catch (error) {
    console.log(error);
  }
};
const deletedetail = async (req, res) => {
  try {
    const idproduct = req.params["idproduct"];
    const productitem = await Product.findByIdAndDelete(idproduct);
    if (!productitem) {
      throw new Error({ err: "Delete Loi" });
    }
  } catch (error) {
    console.log(error);
  }
};
const adminlogin = async (req, res) => {
  try {
    const datauser = req.body;
    let resultadmin;
    resultadmin = await User.findOne({
      email: datauser.email,
      role: "admin",
    });
    if (!resultadmin) {
      resultadmin = await User.findOne({
        email: datauser.email,
        role: "supporter",
      });
    }
    if (resultadmin) {
      const bolen = bcrypt.compare(datauser.password, resultadmin.password);
      if (bolen) {
        const token = jwt.sign(
          {
            fullname: resultadmin.fullname,
            email: resultadmin.email,
            role: resultadmin.role,
          },
          "privateadmin"
        );
        // res.cookie("tokenadmin", token, {
        //   httpOnly: false,
        //   secure: true,
        //   sameSite: "none",
        // });
        res.status(200).json({ token: token });
      } else throw new Error();
    } else {
      throw new Error();
    }
  } catch (error) {
    res.status(400).json();
  }
};
const adminlogout = async (req, res) => {
  res.clearCookie("tokenadmin");
  res.json({});
};
const livechat = async (req, res) => {
  try {
    const result = await Session.find();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ err: "error" });
    console.log(error);
  }
};
const deletesession = async (req, res) => {
  try {
    console.log(req.body);
    const result = await Session.findOneAndDelete({
      session: req.body.session,
    });
    if (!result) {
      throw new Error();
    }
    res.status(200).json({ ok: "ok" });
  } catch (error) {
    res.status(400).json({ err: "error" });
    console.log(error);
  }
};
const saveimgchat = async (req, res) => {
  uploadimgchat(req, res, async (err) => {
    try {
      if (err) {
        throw new Error(err);
      }
      res.json({ a: "b" });
    } catch (error) {
      res.json({ err: error.message });
    }
  });
};
module.exports = {
  getalltransaction,
  getallproduct,
  addproduct,
  detailproduct,
  updatedetail,
  deletedetail,
  adminlogin,
  adminlogout,
  livechat,
  deletesession,
  saveimgchat,
};
