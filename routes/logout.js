const logoutController = require("../controllers/logoutController");
const express = require("express");
const router = express.Router();
router.route("/").post(logoutController.handleLogout);

module.exports = router;
