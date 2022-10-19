// const allowedOrigin = require("../config/allowedOrigin");

const credentials = (req, res, next) => {
  // let origin = req.headers.origin;
  // if (allowedOrigin.includes(origin)) {
  // res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  // }
  next();
};

module.exports = credentials;
