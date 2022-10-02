const Applicant = require("../model/Applicant");

const handleApply = async (req, res) => {
  const { basic, education, work } = req.body;
  if (!(basic && education && work)) {
    return res.status(400).json({
      message:
        "basic information, education background, and work experience are all required!",
    });
  }
  const duplicate = await Applicant.findOne({
    username: basic.username,
  }).exec();
  if (duplicate) {
    return res.status(409).json({
      message: `User ${basic.username} has already lodged a application!`,
    });
  }
  const newApplication = { ...basic, ...education, ...work };
  try {
    const result = await Applicant.create(newApplication);
    console.log(result);
    res.status(201).json({
      success: `User ${newApplication.username} successfully lodge a new application`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleApply };
