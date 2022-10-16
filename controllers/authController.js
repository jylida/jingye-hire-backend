const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Users = require("../model/Users");
const Applicant = require("../model/Applicant");

const handleAuth = async (req, res) => {
  const cookies = req.cookies;
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
    const newRefreshToken = jwt.sign(
      {
        username: foundUser.username,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    let newRTArray = !cookies?.jwt
      ? foundUser.refreshToken
      : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);
    if (cookies?.jwt) {
      //Scenario added here:
      //  User login in but never use RT and does not logout
      //  RT is stolen
      //  If 1 & 2, reuse detection is needed to clear all RTs when user login
      const refreshToken = cookies.jwt;
      const foundToken = await Users.findOne({ refreshToken }).exec();
      if (!foundToken) {
        //RT has been stolen, requiring the stolen RT to be removed from DB
        console.log("attempted fresh token reuse at login!");
        newRTArray = [];
      }
      res.clearCookie("jwt", { httpOnly: true, sameSite: "none" });
    }
    foundUser.refreshToken = [...newRTArray, newRefreshToken];
    await foundUser.save();

    res.cookie("jwt", newRefreshToken, {
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
