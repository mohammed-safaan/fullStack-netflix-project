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
        .pattern(/^[A-Za-z0-9]{3,30}$/)
        .required(),
    }),
};

module.exports = {
  signupValidation,
};
