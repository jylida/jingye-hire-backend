const { CaptchaGenerator } = require("captcha-canvas");
const fs = require("fs");
const fsPromise = fs.promises;
const path = require("path");

const pngPath = path.join(__dirname, "..", "files", "captcha.png");
const tokenPath = path.join(__dirname, "..", "files", "captchaToken.txt");

const generateCaptchaText = ({ length = 7, isCaseSensitive = true }) => {
  const allChr =
    "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
  const charArray = (isCaseSensitive ? allChr : allChr.toLowerCase()).split("");
  const indexArray = Array.from({ length: length }, () =>
    Math.floor(Math.random() * charArray.length)
  );
  return indexArray.map((index) =>
    index === charArray.length ? charArray[index - 1] : charArray[index]
  );
};
const generateCaptchaImage = () => {
  const captchaText = generateCaptchaText({ isCaseSensitive: false });
  const captcha = new CaptchaGenerator()
    .setDimension(50, 200)
    .setCaptcha({
      text: captchaText,
      size: 30,
      color: "blueviolet",
    })
    .setDecoy({ opacity: 0.5 })
    .setTrace({ color: "blueviolet" });
  const buffer = captcha.generateSync();

  if (!fs.existsSync(path.join(__dirname, "..", "files"))) {
    console.log("directory ~/files does not exist!");
    fs.mkdirSync(path.join(__dirname, "..", "files"));
    console.log("directory ~/files has been created!");
  }
  fs.writeFileSync(pngPath, buffer);
  fs.writeFileSync(tokenPath, captchaText.join(""));
  return captcha;
};

const createCaptcha = (req, res) => {
  generateCaptchaImage();
  const s = fs.createReadStream(pngPath);
  s.on("open", () => {
    res.set("Content-Type", "image/png");
    s.pipe(res);
  });
  s.on("error", (err) => {
    return res.status(500).json({ status: "failure", message: err.message });
  });
};

const verifyCaptcha = (req, res) => {
  const input = req.body.text;
  console.log(input);
  try {
    fs.readFile(tokenPath, "utf-8", (err, data) => {
      console.log(data);
      return input === data
        ? res.status(200).json({ status: "success", match: true })
        : res.status(401).json({ status: "failure", match: false });
    });
  } catch (err) {
    return res.status(500).json({ status: "failure", message: err.message });
  }
};

module.exports = { createCaptcha, verifyCaptcha };
