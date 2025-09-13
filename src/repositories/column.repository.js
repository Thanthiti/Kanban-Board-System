const prisma = require("../config/db");
const logger = require("../config/logger");
const boardRepository = require("../repositories/board.repository");

class ColumnRepository {
  // Create column
  async createColumn(name, board_id) {
    const board = await boardRepository.findById(board_id);
    if (!board) {
      logger.error(`Column creation failed - Board not found - ${board_id}`);
      throw new Error("Board not found");
    }
    const column = await prisma.column.create({
      data: { name, board_id },
    });
    logger.info(`Column created successfully - ${column.id}`);
    return column;
  }

  // Find column by id
  // async findColumnById(columnId, boardId) {
  //   return await prisma.column.findUnique({
  //     where: {
  //       id: columnId,
  //       board_id: boardId, // ป้องกัน column ผิด board
  //     },
  //     include: {
  //       tasks: true, // ดึง tasks ใน column ด้วย
  //     },
  //   });
  // }

  // Find column by id to detail task
  async findById(columnId, boardId) {
    const column = await prisma.column.findUnique({
      where: {
        id: columnId,
        board_id: boardId, 
      },
      include: {
        tasks: true,
      },
    })
    if (!column) {
      logger.error(`Column not found - ${columnId}`);
      throw new Error("Column not found");
    }
    logger.info(`Column retrieved successfully - ${column.id}`);
    return column
}

  // Find column by board_id
  async findByBoardId(board_id) {
    const columns = await prisma.column.findMany({ where: { board_id } });
    if (!columns) {
      logger.error(`Columns retrieval failed - Board not found - ${board_id}`);
      throw new Error("Board not found");
    }
    logger.info(`Columns retrieved successfully - Board ${board_id}`);
    return columns
  }

  // Update column
  async updateColumn(column_id, board_id, data) {
    const column = await this.findById(column_id,board_id);
    if (!column) {
      logger.error(`Column update failed - Column not found - ${column_id}`);
      throw new Error("Column not found");
    }
    const updatedColumn = await prisma.column.update({
      where: { id: column_id },
      data,
    });
    logger.info(`Column updated successfully - ${column_id}`);
    return updatedColumn;
  }

  // Delete column
  async deleteColumn(column_id,board_id) {
    const column = await this.findById(column_id,board_id);
    if (!column) {
      logger.error(`Column deletion failed - Column not found - ${column_id}`);
      throw new Error("Column not found");
    }
    const deletedColumn = await prisma.column.delete({
      where: { id: column_id },
    });
    logger.info(`Column deleted successfully - ${column_id}`);
    return deletedColumn;
  }
}

module.exports = new ColumnRepository();