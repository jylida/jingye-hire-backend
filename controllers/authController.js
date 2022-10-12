const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Users = require("../model/Users");
const Applicant = require("../model/Applicant");

const handleAuth = async (req, res) => {
  const { user, pwd } = req.body;
  if (!(user && pwd)) {
    return res
      .status(400)
      .json({ message: "Username and password are both required!" });
  }
  const foundUser = await Users.findOne({ username: user }).exec();
  if (!foundUser) {
    return res.sendStatus(401);
  }
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles).filter(Boolean);
    const application = await Applicant.findOne({ username: user });
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1m" }
    );
    const refreshToken = jwt.sign(
      {
        username: foundUser.username,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      // secure: true,
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });
    res.json({
      accessToken,
      roles,
      progress: application ? application.progress : [],
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleAuth };
