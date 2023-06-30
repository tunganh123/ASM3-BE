const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
function fileFilterz(req, file, cb) {
  if (file.mimetype !== "image/png") {
    req.fileValidationError = "goes wrong on the mimetype";
    cb(null, false, new Error("goes wrong on the mimetype"));
  } else {
    cb(null, true);
  }
}
const upload = multer({ storage: storage, fileFilter: fileFilterz }).single(
  "image"
);
exports.upload = upload;
exports.home = (req, res) => {
  res.json({ acac: "acvava" });
};
exports.saveimg = (req, res) => {
  console.log(req.file);
  upload(req, res, function (err) {
    if (err) {
      console.log(req.fileValidationError);
    }
  });
  res.json({ a: "b" });
};
