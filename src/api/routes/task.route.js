const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validator.middleware");
const { createTaskSchema, updateTaskSchema, moveTaskSchema } = require("../../schemas/task.schema");

// Create Task
router.post("/", validate(createTaskSchema), authMiddleware, taskController.createTaskCTRL);

// find task by id
router.get("/:taskId", authMiddleware, taskController.getTaskByIdCTRL);

// Update Task
router.put("/:taskId", validate(updateTaskSchema), authMiddleware, taskController.updateTaskCTRL);

// Delete Task
router.delete("/:taskId", authMiddleware, taskController.deleteTaskCTRL);

// Move Task
router.put("/:taskId/move", validate(moveTaskSchema), authMiddleware, taskController.moveTaskCTRL);

module.exports = router;
