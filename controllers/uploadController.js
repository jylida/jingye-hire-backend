const path = require("path");
const uploadController = (req, res) => {
  const files = req.files;
  Object.keys(files).forEach((key) => {
    const filePath = path.join(__dirname, "..", "files", files[key].name);
    files[key].mv(filePath, (err) => {
      if (err) {
        return res.status(500).json({ status: "error", message: err.message });
      }
    });
  });
  res.status(200).json({ status: "success", message: "logged" });
};

module.exports = { uploadController };
