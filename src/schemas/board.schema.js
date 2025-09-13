const Joi = require("joi");

const createBoardSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
});

const updateBoardSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
});

const addMembertoBoard = Joi.object({
  user_id: Joi.number().required(),
});

module.exports = { createBoardSchema, updateBoardSchema , addMembertoBoard};