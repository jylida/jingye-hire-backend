const path = require("path");
const AdmZip = require("adm-zip");
const fs = require("fs");

const getUsername = (filePath) => {
  const indexOFSlash = filePath.indexOf("_");
  return filePath.slice(0, indexOFSlash);
};

const uploadController = async (req, res) => {
  const files = req.files;
  const filePathArray = [];
  Object.keys(files).forEach((key) => {
    const filePath = path.join(
      __dirname,
      "..",
      "files",
      getUsername(files[key].name),
      files[key].name
    );
    filePathArray.push(filePath);
    files[key].mv(filePath, (err) => {
      if (err) {
        return res.status(500).json({ status: "error", message: err.message });
      }
    });
  });
  res.status(200).json({ status: "success", message: "logged" });
};

const downloadImageController = async (req, res) => {
  if (!req?.params?.id) {
    return res
      .status(204)
      .json({ status: "failure", message: "Id is required!" });
  }
  const outputFile = path.join("files", `${req.params.id}.zip`);
  if (!fs.existsSync(path.join(__dirname, "..", outputFile))) {
    const zip = new AdmZip();
    try {
      zip.addLocalFolder(path.join(__dirname, "..", "files", req.params.id));
      zip.writeZip(outputFile);
    } catch (err) {
      return res.status(500).json({ status: "failure", message: err.message });
    }
  }
  res.status(201).download(path.join(__dirname, "..", outputFile));
};

module.exports = { uploadController, downloadImageController };
