const passport = require("passport");

module.exports = function (req, res, next) {
  passport.authenticate("jwt", function (err, admin) {
    if (err || !admin) {
      res.status(403).send({
        error: 0,
      });
    } else {
      req.admin = admin;
      next();
    }
  })(req, res, next);
};
