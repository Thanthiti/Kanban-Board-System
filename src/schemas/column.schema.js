// schemas/column.schema.js
const Joi = require("joi");

const createColumnSchema = Joi.object({
  boardId: Joi.number().integer().required(),
  name: Joi.string().min(1).max(255).required(),
});

const updateColumnSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  boardId: Joi.number().integer().required(),
});

module.exports = { createColumnSchema, updateColumnSchema };
