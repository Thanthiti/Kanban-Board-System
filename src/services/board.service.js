const boardRepository = require("../repositories/board.repository")
const userRepository = require("../repositories/user.repository")
const logger = require("../config/logger");

const boardService = {
    createBoard,
    addMember,
    getBoardbyId,
    getMemberBoards,
    getOwnerBoards,
    getAllBoards,
    getMembers,
    updateBoard,
    deleteBoard
};

async function createBoard(name, owner_id) {
    try {
        const board = await boardRepository.createBoard(name, owner_id);
        logger.info(`Board created successfully - ${board.id}`);
        return board;
    } catch (error) {
        logger.error(`Board creation failed - ${error.message}`);
        throw error;
    }
}

async function addMember(board_id,owner_id, user_id) {
    try {
        user_id = parseInt(user_id);
        board_id = parseInt(board_id);
        owner_id = parseInt(owner_id);
        const user = await userRepository.findbyId(user_id);

        // Check if the user has permission to add members
        const members = await boardRepository.getMembers(board_id,);
        const ownerMembership = members.find((m) => m.user_id === owner_id);

        if (!ownerMembership || ownerMembership.role !== "OWNER") {
          throw new Error("You do not have permission to add members");
        }

        if (!user) {
            logger.error(`add member  failed - User not found - ${owner_id}`);
            throw new Error("User not found");
        }

        if (owner_id === user_id) {
              throw new Error("Owner cannot add themselves");
        }
        
        
        const board = await boardRepository.addMember(board_id, user_id, "MEMBER");
        if (!board) {
            logger.error(`add member  failed - Board not found - ${board_id}`);
            throw new Error("add member failed");
        }

        logger.info(`add member successfully - ${board.id}`);
        return board;
    } catch (error) {
        logger.error(`add member failed - ${error.message}`);
        throw error;
    }
    
}

async function getOwnerBoards(userId){
    try{
        userId = parseInt(userId);
        if (!userId) {
            logger.error(`Board retrieval failed - User not found - ${userId}`);
            throw new Error("User not found");
        }
        const board = await boardRepository.getOwnerBoards(userId);
        
        if (!board || board.length === 0) {
            logger.info(`Board ${userId} has no boards`);
        }else{
            logger.info(`Board ${userId} has ${board.length} boards for user ${userId}`);
        }

        logger.info(`Board Owner retrieved successfully - ${userId}`);
        return board;
    }catch (error) {
        logger.error(`Board retrieval failed - ${error.message}`);
        throw error;
    }
}

async function getMemberBoards(userId) {
    try{
        userId = parseInt(userId);
        if (!userId) {
            logger.error(`Board retrieval failed - User not found - ${userId}`);
            throw new Error("User not found");
        }
        const board = await boardRepository.getMemberBoards(userId);
        
        if (!board || board.length === 0) {
            logger.info(`Board ${userId} has no boards`);
        }else{
            logger.info(`Board ${userId} has ${board.length} boards for user ${userId}`);
        }

        logger.info(`Board members retrieved successfully - ${userId}`);
        return board;
    }
    catch (error) {
        logger.error(`Board retrieval failed - ${error.message}`);
        throw error;
    }
}

async function getBoardbyId(id){
    try {
        id = parseInt(id);
        const board = await boardRepository.findById(id);
        if (!board) {
            logger.error(`Board retrieval failed - Board not found - ${id}`);
            throw new Error("Board not found");
        }
        logger.info(`Board retrieved successfully - ${id}`);
        return board;
    }
    catch (error) {
        logger.error(`Board creation failed - ${error.message}`);
        throw error;
    }
    
}

async function getAllBoards(userId) {
    try {
        if (!userId) {
            logger.error(`Board retrieval failed - User not found - ${userId}`);
            throw new Error("User not found");
        }
        const board = await boardRepository.getAllBoardsByUser(userId);
        if (!board) {
            logger.error(`Board retrieval failed - Board not found - ${userId}`);
            throw new Error("Board not found");
        }
        logger.info(`Board retrieved successfully - ${userId}`);
        return board;
    } catch (error) {
        logger.error(`Board retrieval failed - ${error.message}`);
        throw error;
    }
}

async function getMembers(boardId){
    try {
    boardId = parseInt(boardId);
    if (!boardId) {
        logger.error(`Board retrieval failed - Board not found - ${boardId}`);
        throw new Error("Board not found");
    }
     const members = await boardRepository.getMembers(boardId);
     if (!members || members.length === 0) {
       logger.info(`Board ${boardId} has no members`);
     } else {
       logger.info(`Board ${boardId} has ${members.length} members for board ${boardId}`);
     }

    logger.info(`Board retrieved successfully - ${boardId}`);
    return  member;
    }catch{
        logger.error(`Board retrieval failed - ${error.message}`);
        throw error;
    }
}

async function updateBoard(id, data, owner_id) {
    try {
        id = parseInt(id);
        const boardExists = await boardRepository.findById(id);
        if (!boardExists) {
            logger.error(`Board update failed - Board not found - ${id}`);
            throw new Error("Board not found");
        }

        if (boardExists.owner_id !== owner_id) {
            logger.error(`Board update failed - Unauthorized - ${id}`);
            throw new Error("Unauthorized");
        }
        const board = await boardRepository.updateBoard(id, data);
        logger.info(`Board updated successfully - ${board.id}`);
        return board;
    } catch (error) {
        logger.error(`Board update failed - ${error.message}`);
        throw error;
    }
}

async function deleteBoard(id, owner_id) {
    try {
        id = parseInt(id);  
        const boardExists = await boardRepository.findById(id);
        if (!boardExists) {
            logger.error(`Board deletion failed - Board not found - ${id}`);
            throw new Error("Board not found");
        }

        if (boardExists.owner_id !== owner_id) {
            logger.error(`Board deletion failed - Unauthorized - ${id}`);
            throw new Error("Unauthorized");
        }
        
        await boardRepository.deleteBoard(id);
        logger.info(`Board deleted successfully - ${id}`);
    } catch (error) {
        logger.error(`Board deletion failed - ${error.message}`);
        throw error;
    }
}

module.exports = boardService

