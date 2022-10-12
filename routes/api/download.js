const express = require("express");
const verifyRoles = require("../../middleware/verifyRoles");
const ROLES_LIST = require("../../config/rolesLists");
const router = express.Router();
const uploadController = require("../../controllers/uploadController");

router
  .route("/:id")
  .get(
    verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin),
    uploadController.downloadImageController
  );

module.exports = router;
