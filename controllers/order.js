const User = require("../models/user");
const Order = require("../models/order");
const Product = require("../models/product");
const nodemailer = require("nodemailer");
require("dotenv").config();
exports.addorder = async (req, res) => {
  try {
    const convert = (value) => {
      const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
      });
      let vl = formatter.format(value);
      // Sử dụng glocal flag
      let res = vl.slice(1).replace(/,/g, ".");
      return res;
    };
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ID, // generated ethereal user
        pass: process.env.PASSWORD, // generated ethereal password
      },
    });
    const dataorder = req.body;
    const orderitem = new Order(dataorder);
    // Cập nhật tồn cho Product
    const productArr = dataorder.products;
    //Check card
    let checkcount = false;
    for (let index = 0; index < productArr.length; index++) {
      const productitem = await Product.findById(productArr[index].product._id);
      let newcount = productitem.count - productArr[index].count;
      if (newcount < 0) {
        checkcount = true;
        break;
      }
    }
    //update count
    if (!checkcount) {
      productArr.forEach(async (item) => {
        const productitem = await Product.findById(item.product._id);
        await Product.findByIdAndUpdate(item.product._id, {
          count: productitem.count - item.count,
        });
      });
    } else {
      throw new Error();
    }
    // Save item
    const check = await orderitem.save();
    if (!check) {
      throw new Error("err save");
    }

    let message = {
      from: "louistunganh1@gmail.com", // sender address
      to: dataorder.infoorder.email, // list of receivers
      subject: "Xác nhận đặt hàng", // Subject line
      html: `
      <!DOCTYPE html>
            <html>
            <head>
            <style>
            table {
              font-family: arial, sans-serif;
              border-collapse: collapse;
              width: auto;
            }

            td, th {
              border: 1px solid #dddddd;
              text-align: center;
              width: auto;
            }
            tr:nth-child(even) {
              background-color: #dddddd;
            }
            </style>
            </head>
            <body>
            <h2>Xin chào ${dataorder.infoorder.fullname}</h2>
            <h4>Phone: ${dataorder.infoorder.phone}</h4>
            <h4>Address: ${dataorder.infoorder.address}</h4>
            <table>
              <tr>
                <th>Tên Sản Phẩm</th>
                <th>Hình Ảnh</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
              </tr>
              ${productArr
                .map((item) => {
                  let pathimg = item.product?.img1;
                  if (item.product?.img1?.includes("public")) {
                    pathimg = `https://be-mobile-ecommerce.herokuapp.com/${item.product?.img1}`;
                  }
                  return `<tr>
                        <td>${item.product.name}</td>
                        <td><img src=${pathimg} width="100px" height="100px" alt=""></td>
                        <td>${convert(item.product.price)} VND</td>
                        <td>${item.count}</td>
                        <td>${convert(item.product.price * item.count)} VND</td>
                    </tr>`;
                })
                .join("")}
                  </table>
                  <h2>Tổng Thanh Toán: </h2>
                  <h2>${convert(dataorder.totalprice)} VND</h2>
                <br/>
                 <br/>
                  <h2>Cảm ơn bạn! </h2>
          </body>
            </html>
      `,
    };
    // send mail with defined transport object
    await transporter.sendMail(message);
    res.json({ ok: "ok" });
  } catch (error) {
    res.json({ err: "Số lượng đặt hàng quá so với hàng tồn" });
  }
};
exports.getorder = async (req, res) => {
  try {
    const iduser = req.body.iduser;
    const arrorder = await Order.find({ useridorder: iduser });
    res.status(200).json(arrorder);
  } catch (error) {
    console.log(error);
  }
};
exports.getdetailorder = async (req, res) => {
  try {
    const iddetailorder = req.body.iddetailorder;
    const detailorder = await Order.findById(iddetailorder);
    res.status(200).json(detailorder);
  } catch (error) {
    console.log(error);
  }
};
