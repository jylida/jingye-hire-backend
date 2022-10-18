require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");

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
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(credentials);

app.use("/", express.static(path.join(__dirname, "public")));
// app.use("/captcha", require("./routes/captcha"));
app.use("/captcha", require("./routes/captcha"));
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));
app.use("/hirenews", require("./routes/api/hireNews"));
app.use(verifyJWT);
app.use("/apply", require("./routes/api/apply"));
app.use("/upload", require("./routes/api/upload"));
app.use("/download", require("./routes/api/download"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(__dirname, "views", "404.html");
  } else if (req.accepts("json")) {
    res.json({ error: "404 not Found!" });
  } else {
    res.type("txt").send("404 not found!");
  }
});

mongoose.connection.once("open", () => {
  console.log("Connected MongoDB");
  app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
});
