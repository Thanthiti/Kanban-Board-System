  const columnRepository = require("../repositories/column.repository");
  const boardRepository = require("../repositories/board.repository");
  const logger = require("../config/logger");

  const columnService = {
      createColumn,
      updateColumn,
      deleteColumn,
      getColumns,
      getColumnbyId
  };
  // Check premissions if user is a member of the board
  async function checkPermissionColumn(userId, boardId, action) {
    // Check if user is a member of the board
    try {
      
      const boardUser = await boardRepository.findBoardUser(boardId, userId);
      if (!boardUser) {
        logger.error(`You are not a member of this board`);
        throw new Error("You are not a member of this board");
      }
  
      // Owner can do anything
      if (boardUser.role === "OWNER") return true;
  
      // Member can only perform allowed action
      const allowedActionsForMember = ["read"]; 
      if (!allowedActionsForMember.includes(action)) {
        throw new Error("You are not allowed to perform this action on Column");
      }
      return true;
    }
    catch (error) {
      logger.error(`Permission check failed - ${error.message}`);
      throw error;
    }
  }

  // Create column
  async function createColumn(board_id,user_id,columnName) {
      try {
        await checkPermissionColumn(user_id, board_id, "create");
      
        const column = await columnRepository.createColumn(columnName, board_id);
        if (!column) {
          logger.error(`Column creation failed - Board not found - ${board_id}`);
          throw new Error("Board not found");
        }
        logger.info(`Column created successfully - ${column.id}`);
        return column;
      }
      catch (error) {
          logger.error(`Column creation failed - ${error.message}`);
          throw error;
      }
  }

  // Update column
  async function updateColumn(board_id, column_id, user_id, columnName) {
    try {
    await checkPermissionColumn(user_id, board_id, "update");
    
    const column = await columnRepository.updateColumn(column_id, board_id , { name: columnName });
    if (!column) {
      logger.error(`Column update failed - Column not found - ${column_id}`);
      throw new Error("Column not found");
    }
    logger.info(`Column updated successfully - ${column.id}`);
    return column;
    }
    catch (error) {
        logger.error(`Column update failed - ${error.message}`);
        throw error;
    }
  }

  // Delete column
  async function deleteColumn(board_id, column_id, user_id) {
    try {
    await checkPermissionColumn(user_id, board_id, "delete");

    const column = await columnRepository.deleteColumn(column_id, board_id);
    if (!column) {
      logger.error(`Column deletion failed - Column not found - ${column_id}`);
      throw new Error("Column not found");
    }
    logger.info(`Column deleted successfully - ${column.id}`);
    return column;
    }
    catch (error) {
        logger.error(`Column deletion failed - ${error.message}`);
        throw error;
    }
  }

  // Get columns of a board
  async function getColumns(board_id, user_id) {
    try{ 
      await checkPermissionColumn(user_id, board_id, "read");
      
      const columns = await columnRepository.findByBoardId(board_id);
      if (!columns) {
        logger.error(`Columns retrieval failed - Board not found - ${board_id}`);
        throw new Error("Board not found");
      }
      logger.info(`Columns retrieved successfully - Board ${board_id}`);
      return columns;
    }
    catch (error) {
        logger.error(`Columns retrieval failed - ${error.message}`);
        throw error;
    }
  }

// Get column by id 
  async function getColumnbyId(board_id, column_id, user_id) {
    try{
      await checkPermissionColumn(user_id, board_id, "read");
      
      const columns = await columnRepository.findById(column_id,board_id);
      if (!columns) {
        logger.error(`Columns retrieval failed - Column not found - ${column_id}`);
        throw new Error("Column not found");
      }
      logger.info(`Columns retrieved successfully - Board ${board_id}`);
      return columns;

    }
    catch (error) {
        logger.error(`Columns retrieval failed - ${error.message}`);
        throw error;
    }
    
  }

  module.exports = columnService;