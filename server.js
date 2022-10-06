require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const { logger } = require("./middleware/logEvent");
const verifyJWT = require("./middleware/verifyJWT");
const credentials = require("./middleware/credentials");
const filePayloadExists = require("./middleware/filesPayloadExists");
const fileSizeLimiter = require("./middleware/fileSizeLimiter");
const fileExtLimiter = require("./middleware/fileExtLimiter");
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

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));
app.post(
  "/upload",
  fileUpload({ createParentPath: true }),
  filePayloadExists,
  fileExtLimiter([".png", ".jpg", ".jpeg", ".pdf"]),
  fileSizeLimiter,
  (req, res) => {
    const files = req.files;
    Object.keys(files).forEach((key) => {
      const filePath = path.join(__dirname, "files", files[key].name);
      files[key].mv(filePath, (err) => {
        if (err) {
          return res
            .status(500)
            .json({ status: "error", message: err.message });
        }
      });
    });
    console.log(files);
    res.json({ status: "success", message: "logged" });
  }
);
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));
app.use("/hirenews", require("./routes/api/hireNews"));
app.use(verifyJWT);
app.use("/apply", require("./routes/api/apply"));

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
