require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

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

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));
app.use(verifyJWT);
app.use("/employees", require("./routes/api/employees"));
app.use('/users', require('./routes/api/users'));

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
