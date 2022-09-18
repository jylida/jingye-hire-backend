const registerController = require("../controllers/registerController");
const express = require("express");
const router = express.Router();

router.route("/").post(registerController.handleNewUser);

module.exports = router;
