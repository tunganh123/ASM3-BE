const express = require("express");
const Session = require("./models/session");
const userroute = require("./routers/user");
const bodyparser = require("body-parser");
const product = require("./routers/product");
const orderroute = require("./routers/order");
const adminroute = require("./routers/admin");
const path = require("path");
require("dotenv").config();
const cors = require("cors");
const corsoption = {
  origin: [
    "https://asm-3-user.vercel.app",
    "https://asm3-admin.onrender.com",
    "https://store-user.onrender.com",
    "http://localhost:3001",
    "http://localhost:3000",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
const mongoose = require("mongoose");
const cookieparser = require("cookie-parser");
const app = express();
// initialization
/////////////////////////////////////////////
app.use("/public", express.static(path.join(__dirname, "public")));
//set port
app.set("port", process.env.PORT);
// set cors
app.use(cors(corsoption));
// usebodyparser get json
app.use(bodyparser.json());
//use cookie parser get cookie
app.use(cookieparser());
// router
app.use(userroute);
app.use(product);
app.use(orderroute);
app.use(adminroute);
// connect database
// listen port
mongoose
  .connect(process.env.URL_MONGO)
  .then((res) => {
    console.log("ok");
    const server = app.listen(app.get("port"));
    const io = require("socket.io")(server, {
      cors: {
        // origin: [process.env.URL_USER, process.env.URL_ADMIN],
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: false,
      },
    });
    // Connect
    io.on("connection", async (socket) => {
      //admin
      socket.on("setsessionadmin", async (data) => {
        // Lấy ở db danh phiên kết nối tương ứng
        const sessionitem = await Session.findOne({ session: data.session });
        // join roomID
        await socket.join(data.session);
        // Xóa bỏ danh sách các phiên kết nối cũ trong roomID
        const socketIDs = io.sockets.adapter.rooms.get(data.session);
        if (socketIDs) {
          const sockets = Array.from(socketIDs).map((socketID) => {
            return io.sockets.sockets.get(socketID);
          });
          for (let index = 1; index < sockets.length - 1; index++) {
            sockets[index].leave(data.session);
          }
          /////////////////////////////////////////////////////////////
          // console.log(io.sockets.adapter.rooms.get(data.session));
        } else {
          console.log("Không có socket nào kết nối đến phòng");
        }
        io.emit("getmess", sessionitem.message);
      });
      let sescheck;
      socket.on("setsession", async (data) => {
        // console.log(`user ${socket.id} join ${data.session}`);
        sescheck = data.session;
        const sessionitem = new Session(data);
        socket.join(data.session);
        await sessionitem.save();
        io.emit("getsession", data);
      });
      socket.on("sendmess", async (data) => {
        try {
          const sessionitem = await Session.findOne({ session: data.sess });
          if (sessionitem) {
            let datamess = {
              mess: data.mess,
              user: {
                fullname: data.user.fullname,
              },
            };
            let newmess = [...sessionitem.message, datamess];
            const sessitem = await Session.findOneAndUpdate(
              { session: data.sess },
              {
                message: newmess,
              }
            );
            let datareceiver = {
              mess: data.mess,
              user: {
                fullname: data.user.fullname,
              },
            };
            socket.to(data.sess).emit("reciver", datareceiver);
          }
        } catch (error) {
          console.log(error);
        }
      });
      // Lắng nghe sự kiện gửi hình ảnh từ client
      socket.on("uploadImage", async (data) => {
        try {
          const sessionitem = await Session.findOne({ session: data.sess });
          if (sessionitem) {
            let datamess = {
              mess: data.mess,
              user: {
                fullname: data.user.fullname,
              },
            };
            let newmess = [...sessionitem.message, datamess];
            const sessitem = await Session.findOneAndUpdate(
              { session: data.sess },
              {
                message: newmess,
              }
            );
          }
          let dataok = {
            mess: data.mess,
            user: {
              fullname: data.user.fullname,
            },
          };
          socket.to(data.sess).emit("getimg", dataok);
        } catch (error) {
          console.log(error);
        }
      });
      // remove session
      socket.on("removesession", async (data) => {
        try {
          const allsess = await Session.find();
          const sessfilter = allsess.filter((item) => item.session != data);
          const sessitem = allsess.find((it) => it.session == data);
          let sessok = {
            sessfilter: sessfilter,
            name: sessitem.user,
            session: sessitem.session,
          };
          io.emit("user-leave", sessok);
          const bolen = await Session.findOneAndRemove({ session: data });
          socket.leave(data);
          if (!bolen) {
            throw new Error();
          }
        } catch (error) {
          console.log(error);
        }
      });
      socket.on("disconnect", async () => {
        try {
          const allsess = await Session.find();
          const sessfilter = allsess.filter((item) => item.session != sescheck);
          const sessitem = allsess.find((it) => it.session == sescheck);
          let sessok = {
            sessfilter: sessfilter,
            session: sessitem?.session,
          };
          io.emit("user-leave", sessok);
          const bolen = await Session.findOneAndRemove({ session: sescheck });
          socket.leave(sescheck);
          if (!bolen) {
            throw new Error();
          }
        } catch (error) {
          console.log(error);
        }
      });
    });
  })
  .catch((err) => console.log(err));
