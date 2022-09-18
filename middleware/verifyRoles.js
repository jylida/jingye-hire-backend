const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.body.roles) {
      return res.sendStatus(401);
    }
    const allowedRolesArray = [...allowedRoles];
    const result = req.body.roles
      .map((role) => allowedRolesArray.includes(role))
      .find((val) => val === true);
    if (!result) {
      return res.sendStatus(401);
    } else {
      next();
    }
  };
};

module.exports = verifyRoles;
