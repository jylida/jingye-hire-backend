const User = require("../model/Users");

const handleLogout = async (req, res) => {
  const refreshToken = req.cookies.jwt;
  console.log("refresh Token: ", refreshToken);
  if (!refreshToken) {
    return res.sendStatus(204);
  }
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None" });
    return res.sendStatus(204);
  }
  foundUser.refreshToken = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );
  const result = await foundUser.save();
  console.log(result);

  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    //   secure: true,
  });
  res.sendStatus(204);
};

module.exports = { handleLogout };
