const joi = require("joi");

const Schema = {
  create: joi.object({
    title: joi.string().max(100).required(),
  }),
};

module.exports = Schema;
