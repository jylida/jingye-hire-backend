const express = require("express");
const router = express.Router();
const applyController = require("../../controllers/applyController");
const ROLES_LIST = require("../../config/rolesLists");
const verifyRoles = require("../../middleware/verifyRoles");

router.route("/").post(applyController.handleApply);

module.exports = router;
