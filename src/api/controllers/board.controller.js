const boardService = require("../../services/board.service");
const { successResponse, errorResponse } = require("../../config/response");

const boardController = {
  createBoardCTRL,
  addMemberCTRL,
  getOwnedBoardsCTRL,
  getMemberBoardsCTRL,
  getAllBoardsCTRL,
  getMembersCTRL,
  updateBoardCTRL,
  deleteBoardCTRL,
};

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

async function addMemberCTRL(req, res) {
  try {
    const owner_id = req.user?.id;
    if (!owner_id)
      return res.status(401).json(errorResponse(401, "Unauthorized"));

    const { boardId } = req.params;
    const { user_id } = req.body;

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


// Display member of a board
async function getMembersCTRL(req, res) {
  try {
    const boardId = req.params.id;
    if (!boardId)
      return res.status(400).json(errorResponse(400, "Board not found"));

    const members = await boardService.getMembers(boardId);
    res.status(200).json(successResponse(members));
  } catch (error) {
    res.status(400).json(errorResponse(400, error.message));
  }
}


async function updateBoardCTRL(req, res) {
  try {
    const owner_id = req.user?.id;
    if (!owner_id)
      return res.status(401).json(errorResponse(401, "Unauthorized"));

    const boardExists = await boardService.getBoardbyId(req.params.id);
    if (!boardExists)
      return res.status(404).json(errorResponse(404, "Board not found"));
    if (boardExists.owner_id !== owner_id)
      return res.status(403).json(errorResponse(403, "Unauthorized"));

    const board = await boardService.updateBoard(
      req.params.id,
      req.body,
      owner_id
    );
    res.status(200).json(successResponse(board));
  } catch (error) {
    res.status(400).json(errorResponse(400, error.message));
  }
}

async function deleteBoardCTRL(req, res) {
  try {
    const owner_id = req.user?.id;
    if (!owner_id)
      return res.status(401).json(errorResponse(401, "Unauthorized"));

    const boardExists = await boardService.getBoardbyId(
      req.params.id,
      owner_id
    );
    if (!boardExists)
      return res.status(404).json(errorResponse(404, "Board not found"));
    if (boardExists.owner_id !== owner_id)
      return res.status(403).json(errorResponse(403, "Unauthorized"));

    await boardService.deleteBoard(req.params.id, owner_id);
    res
      .status(200)
      .json(successResponse({ message: "Board deleted successfully" }));
  } catch (error) {
    res.status(400).json(errorResponse(400, error.message));
  }
}

module.exports = boardController;
