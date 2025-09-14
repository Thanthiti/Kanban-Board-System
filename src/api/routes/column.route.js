const express = require("express");
const router = express.Router();
const columnController = require("../controllers/column.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validator.middleware");
const { createColumnSchema, updateColumnSchema} = require("../../schemas/column.schema");

// Creat Column
router.post("/", validate(createColumnSchema), authMiddleware, columnController.createColumnCTRL);

// Get all Column of a board
router.get("/:boardId", authMiddleware, columnController.getColumnsCTRL);

// Get Column by id detail task
router.get("/:columnId/:boardId", authMiddleware, columnController.getColumnbyIdCTRL);

// Update Column
router.put("/:columnId", validate(updateColumnSchema), authMiddleware, columnController.updateColumnCTRL);

// Delete Column
router.delete("/:columnId/boards/:boardId", authMiddleware, columnController.deleteColumnCTRL);

module.exports = router;    