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
  const newApplication = {
    ...basic,
    education,
    work,
    progress: [{ lodgeDate: new Date(), applicationStatus: "提交申请" }],
  };
  try {
    const result = await Applicant.create(newApplication);
    console.log(result);
    res.status(201).json({
      success: `User ${newApplication.username} successfully lodge a new application`,
      id: result._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllApplication = async (req, res) => {
  const applications = await Applicant.find();
  if (!applications) {
    return res.status(204).json({ message: "no applicant found!" });
  }
  res.status(201).json({ applications });
};

const getOneApplication = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(204).json({
      message: "Parameter ID required!",
    });
  }
  console.log(req.params.id);
  const application = await Applicant.findOne({ username: req.params.id });
  if (!application) {
    return res.status(204).json({ message: "no applicant found!" });
  }
  res.status(201).json({ application });
};

const deleteOneApplication = async (req, res) => {
  console.log("req body: ", req.body);
  if (!req?.body?.id) {
    return res.status(204).json({
      message: "Parameter ID required!",
    });
  }
  const application = await Applicant.findOne({ username: req.body.id }).exec();
  console.log("application: ", application);
  if (!application) {
    return res
      .status(400)
      .json({ message: `News ID ${req.body.id} not found!` });
  }
  const result = await application.deleteOne();
  res.json(result);
};

module.exports = {
  handleApply,
  getAllApplication,
  getOneApplication,
  deleteOneApplication,
};
