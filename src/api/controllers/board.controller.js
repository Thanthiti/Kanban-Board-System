const boardService = require("../../services/board.service");
const { successResponse, errorResponse } = require("../../config/response");

const boardController = {
  createBoardCTRL,
  addMemberCTRL,
  getOwnedBoardsCTRL,
  getMemberBoardsCTRL,
  getAllBoardsCTRL,
  getBoardbyIdCTRL,
  getMembersCTRL,
  updateBoardCTRL,
  deleteBoardCTRL,
};

// Create a board
async function createBoardCTRL(req, res) {
  try {
    const owner_id = req.user?.id;
    if (!owner_id)
      return res.status(401).json(errorResponse(401, "Unauthorized"));

    const { name } = req.body;
    const board = await boardService.createBoard(name, owner_id);
    res.status(201).json(successResponse(board));
  } catch (error) {
    res.status(400).json(errorResponse(400, error.message));
  }
}

// Add a member to a board
async function addMemberCTRL(req, res) {
  try {
    const owner_id = req.user?.id;
    if (!owner_id)
      return res.status(401).json(errorResponse(401, "Unauthorized"));

    const { boardId } = req.params;
    const { user_id }  = req.body;

    if (!user_id)
      return res.status(400).json(errorResponse(400, "User not found"));

    const board = await boardService.addMember(boardId, owner_id, user_id);
    res.status(200).json(successResponse(board));
  } catch (error) {
    res.status(400).json(errorResponse(400, error.message));
  }
}

// Display boards that a user is the owner
async function getOwnedBoardsCTRL(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json(errorResponse(401, "Unauthorized"));
    
    const boards = await boardService.getOwnerBoards(userId);
    res.status(200).json(successResponse(boards));
  } catch (error) {
    res.status(400).json(errorResponse(400, error.message));
  }
}

// Display boards that a user is the member
async function getMemberBoardsCTRL(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json(errorResponse(401, "Unauthorized"));

    const boards = await boardService.getMemberBoards(userId);
    res.status(200).json(successResponse(boards));
  } catch (error) {
    res.status(400).json(errorResponse(400, error.message));
  }
}

// Display all boards that a user with one privilege can access (both Owner and Member)
async function getAllBoardsCTRL(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json(errorResponse(401, "Unauthorized"));

    const boards = await boardService.getAllBoards(userId);
    res.status(200).json(successResponse(boards));
  } catch (error) {
    res.status(400).json(errorResponse(400, error.message));
  }
}

// Display a board by id to details columns and tasks
async function getBoardbyIdCTRL(req, res) {
  try{
    const boardId = Number(req.params.boardId);
    const userId = req.user?.id;
    if (!boardId || !userId)
      return res.status(400).json(errorResponse(400, "Bad request"));

    const board = await boardService.getBoardbyId(boardId, userId);
    res.status(200).json(successResponse(board));
  }
  catch(error){
    res.status(400).json(errorResponse(400, error.message));
  }
}

// Display member of a board
async function getMembersCTRL(req, res) {
  try {
    const boardId =Number(req.params.boardId);
    const userId = req.user?.id;

    if (!boardId || !userId)
      return res.status(400).json(errorResponse(400, "Board not found"));

    const members = await boardService.getMembers(boardId, userId);
    res.status(200).json(successResponse(members));
  } catch (error) {
    res.status(400).json(errorResponse(400, error.message));
  }
}

// Update a board
async function updateBoardCTRL(req, res) {
  try {
    const owner_id = req.user?.id;
    const { name } = req.body;
    const boardId = Number(req.params.boardId);

    if (!boardId|| !name)
      return res.status(400).json(errorResponse(400, "Bad request"));
    
    if (!owner_id)
      return res.status(401).json(errorResponse(401, "Unauthorized"));
    
    const boardExists = await boardService.getBoardbyId(boardId, owner_id);
    if (!boardExists)
      return res.status(404).json(errorResponse(404, "Board not found"));
    if (boardExists.owner_id !== owner_id)
      return res.status(403).json(errorResponse(403, "Unauthorized"));
    
    const board = await boardService.updateBoard(boardId, owner_id, name);
    res.status(200).json(successResponse(board));
  } catch (error) {
    res.status(400).json(errorResponse(400, error.message));
  }
}

// Delete a board
async function deleteBoardCTRL(req, res) {
  try {
    const owner_id = req.user?.id;
    const boardId = Number(req.params.boardId);
    ;
    if (!boardId)
      return res.status(400).json(errorResponse(400, "Board not found"));

    if (!owner_id)
      return res.status(401).json(errorResponse(401, "Unauthorized"));

    const boardExists = await boardService.getBoardbyId(boardId);

    if (!boardExists)
      return res.status(404).json(errorResponse(404, "Board not found"));
    if (boardExists.owner_id !== owner_id)
      return res.status(403).json(errorResponse(403, "Unauthorized"));

    await boardService.deleteBoard(boardId, owner_id);
    res.status(200).json(successResponse({ message: "Board deleted successfully" }));
  } catch (error) {
    res.status(400).json(errorResponse(400, error.message));
  }
}

module.exports = boardController;
