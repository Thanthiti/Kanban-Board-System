const prisma = require("../config/db");
const logger = require("../config/logger");

class BoardRepository {
  // Create a new board
  async createBoard(name, owner_id) {
    owner_id = parseInt(owner_id);
    if (!owner_id) throw new Error("owner_id is required");

    const user = await prisma.user.findUnique({ where: { id: owner_id } });
    if (!user) {
      logger.error(`Board creation failed - User not found - ${owner_id}`);
      throw new Error("User not found");
    }

    const board = await prisma.board.create({
      data: { name, owner_id },
    });

    // Create boardUser entry for owner
    await prisma.boardUser.create({
      data: { board_id: board.id, user_id: owner_id, role: "OWNER" },
    });

    logger.info(`Board created successfully - ${board.id}`);
    return board;
  }

  // find member of a board
  async findBoardUser(board_id, user_id) {
    return await prisma.boardUser.findUnique({
      where: { board_id_user_id: { board_id, user_id } },
    });
  }

  // Find board by ID  detail column and task
  async findById(boardId) {
    return await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        columns: {
          include: {
            tasks: {
              include: {
                assignees: {
                  select: {
                    task_id: true,
                    user_id: true,
                    role: true,
                    user: { select: { id: true, name: true, email: true } },
                  },
                },
                tags: {
                  select: {
                    task_id: true,
                    tag_id: true,
                    tag: { select: { id: true, name: true } },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  // Add member to board
  async addMember(board_id, user_id, role) {
    const board = await prisma.board.findUnique({ where: { id: board_id } });
    if (!board) {
      logger.error(`Add member failed - Board not found - ${board_id}`);
      throw new Error("Board not found");
    }

    const user = await prisma.user.findUnique({ where: { id: user_id } });
    if (!user) {
      logger.error(`Add member failed - User not found - ${user_id}`);
      throw new Error("User not found");
    }

    const existingMember = await this.findBoardUser(board_id, user_id);

    if (existingMember) {
      logger.error(`Add member failed - User already exists - ${user_id}`);
      throw new Error("User already exists");
    }

    const member = await prisma.boardUser.create({
      data: { board_id, user_id, role },
    });

    logger.info(`Member added successfully - ${user_id} to board ${board_id}`);
    return member;
  }

  // Get boards that user owns
  async getOwnerBoards(userId) {
    return await prisma.board.findMany({
      where: { owner_id: userId },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });
  }

  // Get boards user is member (excluding owner boards)
  async getMemberBoards(userId) {
    return await prisma.board.findMany({
      where: {
        members: { some: { user_id: userId, role: "MEMBER" } },
        NOT: { owner_id: userId },
      },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });
  }

  // Check if user is member of a board
  async isBoardMember(board_id, user_id) {
    const member = await prisma.boardUser.findUnique({
      where: { board_id_user_id: { board_id, user_id } },
    });
    return !!member;
  }

  // Get all boards user belongs to (owner + member)
  async getAllBoardsByUser(userId) {
    return await prisma.board.findMany({
      where: {
        OR: [{ owner_id: userId }, { members: { some: { user_id: userId } } }],
      },
      include: {
        members: {
          where: { user_id: userId },
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });
  }

  // Get all members of a board
  async getMembers(board_id, userId = null) {
    const whereClause = userId ? { board_id, user_id: userId } : { board_id };
    return await prisma.boardUser.findMany({
      where: whereClause,
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }

  // Update board
  async updateBoard(id, data) {
    const board = await this.findById(id);
    if (!board) {
      logger.error(`Board update failed - Board not found - ${id}`);
      throw new Error("Board not found");
    }

    const updatedBoard = await prisma.board.update({ where: { id }, data });
    logger.info(`Board updated successfully - ${id}`);
    return updatedBoard;
  }

  // Delete board

  async deleteBoard(id) {
    // 1. ลบ TaskUser ที่ผูกกับ task ของ board นี้
    
    await prisma.taskUser.deleteMany({
      where: {
        task: {
          column: {
            board_id: id,
          },
        },
      },
    });

    // 2. ลบ TaskTag ที่ผูกกับ task ของ board นี้
    await prisma.taskTag.deleteMany({
      where: {
        task: {
          column: {
            board_id: id,
          },
        },
      },
    });

    // 3. ลบ Task เอง
    await prisma.task.deleteMany({
      where: {
        column: {
          board_id: id,
        },
      },
    });

    // 4. ลบ Column
    await prisma.column.deleteMany({
      where: { board_id: id },
    });

    // 5. ลบ BoardUser
    await prisma.boardUser.deleteMany({ where: { board_id: id } });

    // 6. ลบ Board
    const deletedBoard = await prisma.board.delete({
      where: { id },
    });

    logger.info(`Board deleted successfully - ${id}`);
    return deletedBoard;
  }
}

module.exports = new BoardRepository();
