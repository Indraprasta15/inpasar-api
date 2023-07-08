const joi = require("joi");

const schema = {
  create: joi.object({
    title: joi.string().max(150).required(),
    description: joi.string().max(255),
    full_description: joi.string().max(5000).allow(),
    price: joi.number().max(100000000).required(),
    category_id: joi.number().required(),
  }),
};

module.exports = schema;
