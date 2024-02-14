var Joi = require("joi");

const SuperAdminValidator = (data) => {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    secretCode: Joi.string().required(),
  });
  return schema.validate(data);
};


const CompanyValidator = (data) => {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
  });
  return schema.validate(data);
};


const AdminEMValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    companyId: Joi.number().integer().required(),
  });

  return schema.validate(data);
};

module.exports = { SuperAdminValidator, CompanyValidator, AdminEMValidator };