const Applicant = require("../model/Applicant");

const handleApply = async (req, res) => {
  const { basic, education, work } = req.body;
  if (!(basic && education && work)) {
    return res.status(400).json({
      message:
        "basic information, education background, and work experience are all required!",
    });
  }
  const duplicateByUserName = await Applicant.findOne({
    username: basic.username,
  }).exec();
  const duplicateByPhone = await Applicant.findOne({
    phone: parseInt(basic.phone),
  }).exec();
  const duplicateByID = await Applicant.findOne({
    IDCard: basic.IDCard,
  }).exec();
  if (duplicateByUserName) {
    return res.status(409).json({
      message: `User ${basic.username} has already lodged a application!`,
    });
  }
  if (duplicateByPhone) {
    return res.status(409).json({
      message: `手机号: ${duplicateByPhone.phone} 已经被用于注册`,
    });
  }
  if (duplicateByID) {
    return res.status(409).json({
      message: `身份证号 ${duplicateByID.IDCard} 已经被用于注册`,
    });
  }
  const newApplication = {
    ...basic,
    education,
    work,
    progress: [{ lodgeDate: new Date(), applicationStatus: "申请已接受" }],
  };
  try {
    const result = await Applicant.create(newApplication);
    res.status(201).json({
      success: `User ${newApplication.username} successfully lodge a new application`,
      id: result._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllApplication = async (req, res) => {
  let page = 1;
  if (req.query.page) {
    page = parseInt(req.query.page);
  }
  let limit = 10;
  if (req.query.limit) {
    limit = parseInt(req.query.limit);
  }
  const findOptions = {};
  if (req.query.isLecturer) {
    findOptions.isLecturer = req.query.isLecturer === "true";
  }
  if (req.query.handled) {
    findOptions.handled = req.query.handled === "true";
  }
  if (req.query.subject) {
    findOptions.subject = req.query.subject;
  }
  if (req.query.department) {
    findOptions.department = req.query.department;
  }
  const indexStart = (page - 1) * limit;
  const indexEnd = page * limit;
  const applications = await Applicant.find(findOptions).exec();
  if (!applications) {
    return res.status(204).json({ message: "no applicant found!" });
  }
  const totalPages = Math.ceil(applications.length / limit);
  const totalApplications = applications.length;
  const totalHandledApplications = applications.filter(
    (app) => app.handled
  ).length;
  res.status(201).json({
    totalApplications,
    totalHandledApplications,
    totalPages,
    applications: applications.slice(indexStart, indexEnd),
  });
};

const getOneApplication = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(204).json({
      message: "Parameter ID required!",
    });
  }
  const application = await Applicant.findOne({ username: req.params.id });
  if (!application) {
    return res.status(404).json({ message: "no applicant found!" });
  }
  res.status(201).json({ application });
};
const updateOneApplicationStatus = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(204).json({
      message: "Parameter ID required!",
    });
  }
  try {
    const application = await Applicant.findOne({ username: req.params.id });
    if (!application) {
      return res.status(404).json({ message: "no applicant found!" });
    }
    application.progress.push({
      lodgeDate: new Date(),
      applicationStatus: req.body.status,
    });
    await application.save();
  } catch (err) {
    return res.status(500).json({ status: "failure", message: err.message });
  }
  res.status(200).json({ status: "success", message: "process updated!" });
};

const deleteOneApplication = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(204).json({
      message: "Parameter ID required!",
    });
  }
  const application = await Applicant.findOne({ username: req.body.id }).exec();
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
  updateOneApplicationStatus,
  deleteOneApplication,
};
