const joi = require("joi");

const signupValidation = {
  body: joi
    .object()
    .required()
    .keys({
      username: joi.string().min(3).max(30).required(),
      email: joi.string().email().required(),
      password: joi
        .string()
        .pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$/)
        .required(),
    }),
};

module.exports = {
  signupValidation,
};
