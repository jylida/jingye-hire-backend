const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eduBg = new Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  school: {
    type: String,
    required: true,
  },
  degree: {
    type: String,
    required: true,
  },
  majorType: {
    type: String,
    required: true,
  },
  majorName: {
    type: String,
    required: true,
  },
  isGraduated: {
    type: Boolean,
    required: true,
  },
});
const workBg = new Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  specific: {
    type: String,
    required: true,
  },
  reasonOnLeave: {
    type: String,
    required: false,
  },
});

const applicantSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  IDCard: {
    type: String,
    required: true,
  },
  politics: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  phoneSecondary: {
    type: Number,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  addressDistrict: {
    type: String,
    required: true,
  },
  addressStreet: {
    type: String,
    required: true,
  },
  addressSpecific: {
    type: String,
    required: true,
  },
  EducationBackground: [eduBg],
  workingExperience: [workBg],
});

module.exports = mongoose.model("Applicant", applicantSchema);
