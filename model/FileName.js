const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const fileNameSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  path: [String],
});

module.exports = mongoose.model("FileName", fileNameSchema);
