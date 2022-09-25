const express = require("express");
const router = express.Router();
const hireNewsController = require("../../controllers/hireNewsController");
const ROLES_LIST = require("../../config/rolesLists");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .get(hireNewsController.getAllHireNews)
  .post(
    verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin),
    hireNewsController.createNewHireNews
  )
  .put(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    hireNewsController.updateHireNews
  )
  .delete(verifyRoles(ROLES_LIST.Admin), hireNewsController.deleteHireNews);

router.route("/:id").get(hireNewsController.getOneHireNews);

module.exports = router;
