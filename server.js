require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const https = require("https");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fs = require("fs");

const { logger } = require("./middleware/logEvent");
const verifyJWT = require("./middleware/verifyJWT");
const credentials = require("./middleware/credentials");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConnection");

// Connect to MongoDB
connectDB();

const app = express();

const PORT = process.env.PORT || 3500;

app.use(logger);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//middleware for cookies
app.use(cookieParser());
app.use(credentials);

app.use("/", require("./routes/root"));
app.use("/api1/captcha", require("./routes/captcha"));
app.use("/api1/register", require("./routes/register"));
app.use("/api1/auth", require("./routes/auth"));
app.use("/api1/refresh", require("./routes/refresh"));
app.use("/api1/logout", require("./routes/logout"));
app.use("/api1/hirenews", require("./routes/api/hireNews"));
app.use(verifyJWT);
app.use("/api1/apply", require("./routes/api/apply"));
app.use("/api1/upload", require("./routes/api/upload"));
app.use("/api1/download", require("./routes/api/download"));

app.all("*", (req, res) => {
  res.status(404).send("404 not found!");
});
// const server = https.createServer(
//   {
//     key: fs.readFileSync("/etc/nginx/sites-available/jingyeschool.org.cn.key"),
//     cert: fs.readFileSync(
//       "/etc/nginx/sites-available/jingyeschool.org.cn_bundle.crt"
//     ),
//   },
//   app
// );

mongoose.connection.once("open", () => {
  console.log("Connected MongoDB");
  app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
});
