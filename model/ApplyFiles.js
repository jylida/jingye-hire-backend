const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const applyFileSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  filePath: [String],
});

module.exports = mongoose.model("ApplyFiles", applyFileSchema);
