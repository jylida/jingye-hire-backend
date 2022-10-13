const fileUpload = require("express-fileupload");
const uploadController = require("../../controllers/uploadController");
const filePayloadExists = require("../../middleware/filesPayloadExists");
const fileSizeLimiter = require("../../middleware/fileSizeLimiter");
const fileExtLimiter = require("../../middleware/fileExtLimiter");
const express = require("express");
const router = express.Router();

router
  .route("/:id")
  .post(
    fileUpload({ createParentPath: true }),
    filePayloadExists,
    fileExtLimiter([".png", ".jpg", ".jpeg", ".pdf"]),
    fileSizeLimiter,
    uploadController.uploadController
  );

module.exports = router;
