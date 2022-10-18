const express = require("express");
const router = express.Router();
const captchaControllers = require("../controllers/captchaController");

router
  .route("/")
  .get(captchaControllers.createCaptcha)
  .post(captchaControllers.verifyCaptcha)
  .put(captchaControllers.createCaptcha);

module.exports = router;
