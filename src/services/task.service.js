const taskRepository = require("../repositories/task.repository");
const columnRepository = require("../repositories/column.repository");
const logger = require("../config/logger");
const boardRepository = require("../repositories/board.repository");
const prisma = require("../config/db");

const taskService = {
  createTask,
  updateTask,
  deleteTask,
  getTaskbyId,
  moveTask 
};


async function checkTaskPermission(task_id, user_id, allowedRoles) {
  const task = await taskRepository.findUserRole(task_id, user_id);
  
  if (!task) {
    logger.error(`Task creation failed - Task not found - ${task_id}`);
    throw new Error("Task not foundasd");
  }
  if (!allowedRoles.includes(task.role.toLocaleLowerCase())) {
    logger.error(
      `Task creation failed - You are not part of this task - ${task_id}`
    );
    throw new Error("You are not part of this task");
  }
  
  return task.role;
}

async function validateAssignees(boardId, assigneeIds, ownerId) {
  const validAssignees = [];
  const invalidAssignees = [];

  if (!assigneeIds?.length) return { validAssignees, invalidAssignees };

  for (const id of assigneeIds) {
    if (id === ownerId) continue;

    const isMember = await boardRepository.findBoardUser(boardId, id);
    if (isMember) validAssignees.push({ user_id: id, role: "assignee" });
    else invalidAssignees.push(id);
  }

  return { validAssignees, invalidAssignees };
}

async function normalizePositions(columnId) {
  const tasks = await taskRepository.findByColumn(columnId);
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].position !== i + 1) {
      await taskRepository.updateTask(tasks[i].id, columnId, i + 1);
    }
  }
}

async function createTask(
  {
    title,
    description,
    column_id,
    position,
    dueDate,
    completedAt,
    assigneeIds,
    tagIds,
  },
  user_id
) {
  try {
    const column = await columnRepository.findById(column_id);

    if (!column) {
      logger.error(`Task creation failed - Column not found - ${column_id}`);
      throw new Error("Column not found");
    }

    const board = await boardRepository.findById(column.board_id);
    if (board.owner_id !== user_id) {
      logger.error(
        `Task creation failed - Only board owner can create task - ${column.board_id}`
      );
      throw new Error("Only board owner can create task");
    }
    if (!position) {
      const lastTask = await taskRepository.findLastTaskByColumnId(column_id);
      position = lastTask ? lastTask.position + 1 : 1;
    }

    //  Validate assignees
    const { validAssignees, invalidAssignees } = await validateAssignees(
      column.board_id,
      assigneeIds,
      user_id
    );
    if (invalidAssignees.length > 0) {
      throw new Error(
        `Invalid assignees (not board members): ${invalidAssignees.join(", ")}`
      );
    }

    const task = await taskRepository.create({
      title,
      description,
      column_id,
      position,
      dueDate,
      completedAt,
    });

    const taskId = task.id;

    const assigneesToAdd = [
      { user_id, role: "OWNER" },
      ...assigneeIds.map((user_id) => ({ user_id, role: "ASSIGNEE" })),
    ];
    await taskRepository.addTaskUsers(taskId, assigneesToAdd);

    if (Array.isArray(tagIds) && tagIds.length > 0) {
      await taskRepository.addTaskTags(taskId, tagIds);
    }
    const taskWithRelations = await taskRepository.findByIdWithRelations(taskId);

    return taskWithRelations;
  } catch (error) {
    logger.error(`Task creation failed - ${error.message}`);
    throw error;
  }
}

// Update task
async function updateTask(taskId, input, userId) {
  
  try {
    
    const role = await checkTaskPermission(taskId, userId, [
      "owner",
      "assignee",
    ]);

    if (!role) throw new Error("You are not allowed to update this task");

    if (role.toLowerCase() === "assignee") {
      if (!input.tagIds) throw new Error("Assignees can only add tags");
      return taskRepository.update(taskId, {
        tags: {
          connectOrCreate: input.tagIds.map((tag_id) => ({
            where: { task_id_tag_id: { task_id: taskId, tag_id } },
            create: { tag_id },
          })),
        },
      });
    }

    if (role.toLowerCase() === "owner") {
      //Owner can do anything
      const { assigneeIds, tagIds, column_id, ...scalarData } = input;
      const updateData = { ...scalarData };

      if (column_id) updateData.column = { connect: { id: column_id } };

      const task = await taskRepository.findById(taskId, {
        include: { column: { select: { board_id: true } } },
      });

      if (!task) throw new Error("Task not found");
      if (!task.column) throw new Error("Task column not found");
      const { validAssignees, invalidAssignees } = await validateAssignees(
        task.column.board_id,
        assigneeIds || [],
        userId
      );

      if (invalidAssignees.length > 0)
        throw new Error(`Invalid assignees (not board members): ${invalidAssignees.join(", ")}`);
      // If there are assigneeIds
      if (assigneeIds?.length) {
        // updateData.assignees will be an object with connectOrCreate property
        updateData.assignees = {
          connectOrCreate: validAssignees.map((user) => ({
            where: {
              task_id_user_id: { task_id: taskId, user_id: user.user_id },
            },
            create: { user_id: user.user_id, role: "assignee" },
          })),
        };
      }
      // If there are tagIds
      if (tagIds?.length) {
        // updateData.tags will be an object with connectOrCreate property
        updateData.tags = {
          connectOrCreate: tagIds.map((tag_id) => ({
            where: { task_id_tag_id: { task_id: taskId, tag_id } },
            create: { tag_id },
          })),
        };
      }
      return taskRepository.update(taskId, updateData);
    }
  } catch (error) {
    logger.error(`Task update failed - ${error.message}`);
    throw error;
  }
}

async function deleteTask(taskId, userId) {
  // Only owner can delete
  try {
    await checkTaskPermission(taskId, userId, ["owner"]);
    return taskRepository.delete(taskId);
  } catch (error) {
    logger.error(`Task deletion failed - ${error.message}`);
    throw error;
  }
}

// Get task by id
async function getTaskbyId(taskId, userId) {
  try {
  
  const task = await taskRepository.findById(taskId);
  if (!task){
    logger.error(`Task not found - ${taskId}`);
    throw new Error("Task not found");
  } 
    const isAssignee = task.assignees.some((a) => a.user_id === userId);
    const column = await prisma.column.findUnique({
      where: { id: task.column_id },
      select: { board_id: true },
    });

    const board = await prisma.board.findUnique({
      where: { id: column.board_id },
      select: { owner_id: true },
    });

    const isOwner = board.owner_id === userId;

    if (!isAssignee && !isOwner) {
      logger.error(`User ${userId} has no permission to view Task ${taskId}`);
      throw new Error("Forbidden: You cannot view this task");
    }

  logger.info(`Task found successfully - ${task.id}`);
  return task
  } catch (error) {
    logger.error(`Task not found - ${error.message}`);
    throw error;
  }
}

 async function moveTask(taskId, column_id, position) {
  try{
  const task = await taskRepository.findById(taskId);
  if (!task) throw new Error("Task not found");

  const sourceColumnId = task.column_id;

  const destTasks = await taskRepository.findByColumn(column_id);
  if (position < 1 || position > destTasks.length + 1) {
    logger.error(`Invalid position - ${position}`);
    throw new Error("Invalid position");
  }

  if (sourceColumnId === column_id) {
    // same column
    if (position < task.position) {
      // shift down tasks between position old -> position new
      await taskRepository.updatePositions(
        sourceColumnId,
        { position: { gte: position, lt: task.position } },
        1
      );
    } else if (position > task.position) {
      // shift up tasks between position new -> position old      
      await taskRepository.updatePositions(
        sourceColumnId,
        { position: { lte: position, gt: task.position } },
        -1
      );
    }
  } else {
    // shift up column old
    await taskRepository.updatePositions(
      sourceColumnId,
      { position: { gt: task.position } },
      -1
    );
    // shift down column new
    await taskRepository.updatePositions(
      column_id,
      { position: { gte: position } },
      1
    );
  }

  // update task 
  await taskRepository.updateTask(taskId, column_id, position);

  // normalize position of column
  await normalizePositions(sourceColumnId);
  if (sourceColumnId !== column_id) {
    await normalizePositions(column_id);
  }

  return taskRepository.findById(taskId);
} catch (error) {
  logger.error(`Task move failed - ${error.message}`);
  throw error;
  }
}

module.exports = taskService;
