const jwt = require("jsonwebtoken");
const User = require("../model/Users");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }
  const refreshToken = cookies.jwt;
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None" });

  const foundUser = await User.findOne({ refreshToken }).exec();
  console.log(foundUser);
  if (!foundUser) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          return res.sendStatus(403);
        }
        const hackedUser = await User.findOne({
          username: decoded.username,
        }).exec();
        hackedUser.refreshToken = [];
        hackedUser.save();
      }
    );
    return res.sendStatus(403);
  }

  const newRTArray = foundUser.refreshToken.filter((rt) => rt !== refreshToken);

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        console.log("expired refresh token");
        foundUser.refreshToken = [...newRTArray];
        await foundUser.save();
      }
      if (err || foundUser.username !== decoded.username) {
        return res.sendStatus(403);
      }
      const roles = Object.values(foundUser.roles).filter((rl) => rl);
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: decoded.username,
            roles: roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "10s",
        }
      );
      const newRefreshToken = jwt.sign(
        {
          username: foundUser.username,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      foundUser.refreshToken = [...newRTArray, newRefreshToken];
      await foundUser.save();
      res.cookie("jwt", newRefreshToken, { httpOnly: true, sameSite: "none" });
      res.json({ accessToken, roles });
    }
  );
};

module.exports = { handleRefreshToken };
