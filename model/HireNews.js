const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hireNewsPostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  createDate: {
    type: String,
    required: true,
  },
  updateDate: {
    type: String,
    required: false,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  editor: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("HireNewsPost", hireNewsPostSchema);
