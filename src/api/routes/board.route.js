const express = require("express");
const router = express.Router();
const boardController = require("../controllers/board.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validator.middleware");
const { createBoardSchema, updateBoardSchema , addMembertoBoard} = require("../../schemas/board.schema");

router.post("/",validate(createBoardSchema) ,authMiddleware, boardController.createBoardCTRL); 
router.get("/owner", authMiddleware, boardController.getOwnedBoardsCTRL);
router.get("/member", authMiddleware, boardController.getMemberBoardsCTRL);
router.get("/all", authMiddleware, boardController.getAllBoardsCTRL);
router.put("/:id",validate(updateBoardSchema), authMiddleware, boardController.updateBoardCTRL);
router.delete("/:id", authMiddleware, boardController.deleteBoardCTRL);

router.post("/:boardId/members", validate(addMembertoBoard), authMiddleware, boardController.addMemberCTRL);
router.get("/:boardId/members", authMiddleware, boardController.getMembersCTRL);

module.exports = router;

