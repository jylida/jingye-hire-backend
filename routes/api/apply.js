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
  .post(verifyRoles(ROLES_LIST.User), applyController.handleApply)
  .delete(verifyRoles(ROLES_LIST.User), applyController.deleteOneApplication);

router
  .route("/:id")
  .get(verifyRoles(ROLES_LIST.User), applyController.getOneApplication)
  .put(
    verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin),
    applyController.updateOneApplicationStatus
  );

module.exports = router;
