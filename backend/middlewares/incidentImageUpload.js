const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../config/doSpacesClient");

// Middleware to upload incident images to DO Spaces
const incidentImageUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.DO_SPACE_NAME,
    acl: "public-read",
    key: (req, file, cb) => {
      const filename = Date.now() + "-" + file.originalname;
      cb(null, "incident-image/" + filename); // folder specific to incident
    },
  }),
});

module.exports = incidentImageUpload;
