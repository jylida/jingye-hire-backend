const express = require("express");
const router = express.Router();
const applyController = require("../../controllers/applyController");
const ROLES_LIST = require("../../config/rolesLists");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .get(
    verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin),
    applyController.getAllApplication
  )
  .post(verifyRoles(ROLES_LIST.User), applyController.handleApply);

router
  .route("/:id")
  .get(verifyRoles(ROLES_LIST.User), applyController.getOneApplication);

module.exports = router;
