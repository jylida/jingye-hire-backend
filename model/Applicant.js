const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
  ethics: {
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
  isLecturer: {
    type: Boolean,
    required: true,
  },
  subject: {
    type: String,
    required: false,
  },
  tqc: {
    type: String,
    required: false,
  },
  department: {
    type: String,
    required: true,
  },
  jobSpecific: {
    type: String,
    required: true,
  },
  education: [
    {
      from: String,
      to: String,
      school: String,
      degree: String,
      majorType: String,
      majorName: String,
      isGraduated: Boolean,
    },
  ],
  work: [
    {
      from: String,
      to: String,
      place: String,
      title: String,
      specific: String,
      reasonOnLeave: String,
    },
  ],
  uploadFile: {
    type: Boolean,
    required: false,
  },
  progress: [{ lodgeDate: Date, applicationStatus: String }],
});

module.exports = mongoose.model("Applicant", applicantSchema);
