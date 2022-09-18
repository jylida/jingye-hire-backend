const User = require("../model/Users");

const handleLogout = async (req, res) => {
  const refreshToken = req.cookies.jwt;
  if (!refreshToken) {
    return res.sendStatus(204);
  }
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.cookie("jwt", { httpOnly: true, sameSite: "None" });
    return res.sendStatus(204);
  }
  foundUser.refreshToken = "";
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
