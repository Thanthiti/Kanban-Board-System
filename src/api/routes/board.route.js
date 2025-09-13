const express = require("express");
const router = express.Router();
const boardController = require("../controllers/board.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validator.middleware");
const { createBoardSchema, updateBoardSchema , addMembertoBoard} = require("../../schemas/board.schema");

// Create Board
router.post("/",validate(createBoardSchema) ,authMiddleware, boardController.createBoardCTRL); 

// Get Owned Boards
router.get("/owner", authMiddleware, boardController.getOwnedBoardsCTRL);

// Get Member Boards
router.get("/member", authMiddleware, boardController.getMemberBoardsCTRL);

// Get All Boards
router.get("/all", authMiddleware, boardController.getAllBoardsCTRL);

// Get Board by id detail column and task 
router.get("/:boardId", authMiddleware, boardController.getBoardbyIdCTRL);

// Update Board 
router.put("/:boardId",validate(updateBoardSchema), authMiddleware, boardController.updateBoardCTRL);

// Delete Board 
router.delete("/:boardId", authMiddleware, boardController.deleteBoardCTRL);

// Add member to board
router.post("/:boardId/members", validate(addMembertoBoard), authMiddleware, boardController.addMemberCTRL);

// Get all members of a board
router.get("/:boardId/members", authMiddleware, boardController.getMembersCTRL);

module.exports = router;

