const Joi = require("joi");

// Kullanıcı kayıt doğrulama şeması

const signupSchema = Joi.object({
  email: Joi.string()
    .min(6)
    .max(60)
    .required()
    .email({ tlds: { allow: ["com", "net"] } }), // Sadece .com ve .net uzantılarına izin ver
  password: Joi.string()
    .required()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      )
    ), // En az 8 karakter, en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir
});

const signinSchema = Joi.object({
  email: Joi.string()
    .min(6)
    .max(60)
    .required()
    .email({ tlds: { allow: ["com", "net"] } }), // Sadece .com ve .net uzantılarına izin ver
  password: Joi.string()
    .required()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      )
    ), // En az 8 karakter, en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir
});


const acceptCodeSchema = Joi.object({
   email: Joi.string()
    .min(6)
    .max(60)
    .required()
    .email({ tlds: { allow: ["com", "net"] } }),
    providedCode: Joi.number().required()
})

const changePasswordSchema = Joi.object({
  newPassword: Joi.string()
  .required()
  .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      )),
  oldPassword:Joi.string()
  .required()
  .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      )),
})

module.exports = {
  signupSchema,
  signinSchema,
  acceptCodeSchema,
  changePasswordSchema,
  
};
