const Joi = require("joi");

module.exports = {
  userRegistration(req, res, next) {
    const schema = {
      email: Joi.string().email(),
      password: Joi.string().regex(new RegExp("^[a-zA-Z0-9]{7,32}$"))
    };

    const { error, value } = Joi.validate(req.body, schema);

    if (error) {
      switch (error.details[0].context.key) {
        case "email":
          res.status(400).send({
            error: "Invalid email address"
          });
          break;
        case "password":
          res.status(400).send({
            error:
              "Password  contains ONLY the following characters: <br>" +
              " 1.Lower case, upper case and 0-9" +
              "<br> " +
              "2.With minimum of 7 characters and not greater than 32 characters"
          });
          break;
        default:
          res.status(400).send({
            error: "Invalide registration information try again"
          });
      }
    } else {
      next();
    }
  }
};
