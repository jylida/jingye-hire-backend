const { CaptchaGenerator } = require("captcha-canvas");

let captchaToken = undefined;

const generateCaptchaText = ({ length = 7, isCaseSensitive = true }) => {
  const allChr =
    "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
  const charArray = (isCaseSensitive ? allChr : allChr.toLowerCase()).split("");
  const indexArray = Array.from({ length: length }, () =>
    Math.floor(Math.random() * charArray.length)
  );
  return indexArray
    .map((index) =>
      index === charArray.length ? charArray[index - 1] : charArray[index]
    )
    .join("");
};
const generateCaptchaImage = async () => {
  captchaToken = generateCaptchaText({ isCaseSensitive: false });
  const captcha = new CaptchaGenerator()
    .setDimension(50, 200)
    .setCaptcha({
      text: captchaToken,
      size: 30,
      color: "blueviolet",
    })
    .setDecoy({ opacity: 0.5 })
    .setTrace({ color: "blueviolet" });
  const buffer = await captcha.generate();
  const imageString = buffer.toString("base64");
  return { imageString };
};

const createCaptcha = (req, res) => {
  generateCaptchaImage().then(({ imageString }) => {
    return res.status(200).json({ imageString });
  });
};

const verifyCaptcha = (req, res) => {
  const input = req.body.text;
  console.log(input, captchaToken);
  if (input !== captchaToken) {
    return res
      .status(403)
      .json({ status: "failure", message: "captcha validation fails!" });
  }
  res.status(200).json({ status: "success" });
};

module.exports = { createCaptcha, verifyCaptcha };
