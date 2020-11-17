const multer = require("multer");
const path = require("path");

module.exports = {
  async imageUpload(req, res) {
    try {
      await upload(req, res, err => {
        if (err) {
          res.status(400).send({
            error: "Image uploading is failed"
          });
        } else {
          res.send({
            imageUrl: req.file.filename
          });
        }
      });
    } catch (err) {
      res.status(400).send({
        error: err
      });
    }
  }
};

const storage = multer.diskStorage({
  destination: "./server/images",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + ".png"
    );
  }
});

const upload = multer({
  storage: storage
}).single("img");
