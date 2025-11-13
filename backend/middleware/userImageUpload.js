const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../config/doSpacesClient");

// Middleware to upload user images to DO Spaces
const userImageUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.DO_SPACE_NAME,
    acl: "public-read",
    key: (req, file, cb) => {
      const filename = Date.now() + "-" + file.originalname;
      cb(null, "user-image/" + filename); // folder specific to user
    },
  }),
});

module.exports = userImageUpload;
