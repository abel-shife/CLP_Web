const bcrypt = require("bcrypt");
module.exports = {
  passwordEncription(passwordToEncript) {
    let hashedPassword = bcrypt.hashSync(passwordToEncript, 10);
    return hashedPassword;
  },

  comparePassword(normalPassword, hashedPassword) {
    let comparedPassword = bcrypt.compareSync(normalPassword, hashedPassword);
    return comparedPassword;
  }
};
