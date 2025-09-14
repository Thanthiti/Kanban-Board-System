const Joi = require("joi");

// Create Task
const createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  description: Joi.string().allow(null, "").max(1000),
  column_id: Joi.number().integer().required(),
  position: Joi.number().integer().min(1).optional(),
  dueDate: Joi.date().iso().greater("now").allow(null).optional(),
  completedAt: Joi.date().iso().allow(null).optional(),
  assigneeIds: Joi.array().items(Joi.number().integer()).optional(),
  tagIds: Joi.array().items(Joi.number().integer()).optional(),
});

// Update Task
const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(255).optional(),
  description: Joi.string().allow(null, "").max(1000).optional(),
  column_id: Joi.number().integer().optional(),
  dueDate: Joi.date().allow(null).optional(),
  completedAt: Joi.date().allow(null).optional(),
  assigneeIds: Joi.array().items(Joi.number().integer()).optional(),
  tagIds: Joi.array().items(Joi.number().integer()).optional(),
});

// Move Task
const moveTaskSchema = Joi.object({
  column_id: Joi.number().integer().required(),
  position: Joi.number().integer().required(),
});

module.exports = { createTaskSchema, updateTaskSchema, moveTaskSchema };
