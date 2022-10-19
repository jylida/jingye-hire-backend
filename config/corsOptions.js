const allowedOrigin = require("./allowedOrigin");
const corsOptions = {
  origin: "*",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
