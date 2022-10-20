const allowedOrigin = require("./allowedOrigin");

const corsOptions = {
  origin: (origin, callback) => {
    // if (allowedOrigin.indexOf(origin) !== -1 || !origin) {
    callback(null, true);
    // } else {
    // callback(new Error("Not allowed by CORS"));
    // }
  },
  allowedHeaders: "Content-Type, Authorization",
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
