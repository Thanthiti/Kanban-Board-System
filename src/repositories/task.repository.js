const prisma = require("../config/db");
const logger = require("../config/logger");

class TaskRepository {
  // Create a new task
  async create(taskData) {
    return prisma.task.create({
      data: taskData,
      include: {
        column: true,
        assignees: {
          include: { user: true },
        },
        tags: {
          include: { tag: true },
        },
      },
    });
  }

  // find last task by column_id
  async findLastTaskByColumnId(column_id) {
    return prisma.task.findFirst({
      where: { column_id },
      orderBy: { position: "desc" }, // Sort by position in descending order
    });
  }

  // Add task users
  async addTaskUsers(taskId, users) {
    return prisma.taskUser.createMany({
      data: users.map((u) => ({ task_id: taskId, ...u })),
      skipDuplicates: true,
    });
  }

  // Add task tags
  async addTaskTags(taskId, tagIds) {
    return prisma.taskTag.createMany({
      data: tagIds.map((tag_id) => ({ task_id: taskId, tag_id })),
      skipDuplicates: true,
    });
  }

  // Find Task by id with relations
  async findByIdWithRelations(taskId) {
    return prisma.task.findUnique({
      where: { id: taskId },
      include: {
        column: true,
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
        }
      },
    });
  }

  // Find User by role
  async findUserRole(task_id, user_id) {
    
    return prisma.taskUser.findUnique({
      where: {
        task_id_user_id: { task_id, user_id },
      },
      select: { role: true },
    });
  }

  //  Update Task
  async update(taskId, data) {
    return prisma.task.update({
      where: { id: taskId },
      data,
      include: {
        assignees: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        tags: {
          select: {
            task_id: true,
            tag_id: true,
            tag: { select: { id: true, name: true } },
          },
        },
      },
    });
  }

  //  Update position of tasks
 async findByColumn(columnId) {
    return prisma.task.findMany({
      where: { column_id: columnId },
      orderBy: { position: "asc" },
    });
  }

  //  Update position of tasks
  async updateTask(taskId, columnId, position) {
    return prisma.task.update({
      where: { id: taskId },
      data: { column_id: columnId, position },
    });
  }

  //  Update position of tasks
  async updatePositions(columnId, filter, shift, reverse = false) {
    const tasks = await prisma.task.findMany({
      where: { column_id: columnId, ...filter },
      orderBy: { position: reverse ? "desc" : "asc" },
    });
    for (const task of tasks) {
      await prisma.task.update({
        where: { id: task.id },
        data: { position: task.position + shift },
      });
    }
  }

  //  Delete Task
  async delete(taskId) {
    await prisma.taskUser.deleteMany({ where: { task_id: taskId } });

    await prisma.taskTag.deleteMany({ where: { task_id: taskId } });
    return prisma.task.delete({
      where: { id: taskId },
    });
  }

  //  Find Task by id
  async findById(taskId) {
    return prisma.task.findUnique({
      where: { id: taskId },
      include: {
        column: {
          include: { board: true },
        },
        assignees: {
          select: {
            user_id: true,
            role: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
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
    });
  }
}

module.exports = new TaskRepository();
