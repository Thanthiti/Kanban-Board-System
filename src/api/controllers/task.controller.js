const taskService = require("../../services/task.service");
const { successResponse, errorResponse } = require("../../config/response");

const taskController = {
    createTaskCTRL,
    updateTaskCTRL,
    deleteTaskCTRL,
    getTaskByIdCTRL,
    moveTaskCTRL
};
async function createTaskCTRL(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json(errorResponse(401, "Unauthorized"));
    const task = await taskService.createTask(req.body, userId);
    res.status(201).json(successResponse(task));
  } catch (err) {
    res.status(400).json(errorResponse(400, err.message));
  }
}

async function updateTaskCTRL(req, res) {
  try{
    const taskId = Number(req.params.taskId);
    const input = req.body;
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json(errorResponse(401, "Unauthorized"));

    const task = await taskService.updateTask(taskId, input, userId);
    res.status(200).json(successResponse(task));
  }catch(err){
    res.status(400).json(errorResponse(400, err.message));
  }
}

async function deleteTaskCTRL(req, res){
  try{
    const taskId = Number(req.params.taskId);
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json(errorResponse(401, "Unauthorized"));

    await taskService.deleteTask(taskId, userId);
    res.status(200).json(successResponse({ message: "Task deleted successfully" }));
  }catch(err){
    res.status(400).json(errorResponse(400, err.message));
  }
}

async function getTaskByIdCTRL(req, res){ 
  try{
    const taskId = Number(req.params.taskId);
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json(errorResponse(401, "Unauthorized"));

    const task = await taskService.getTaskbyId(taskId, userId);
    res.status(200).json(successResponse(task));
  }catch(err){
    res.status(400).json(errorResponse(400, err.message));
  }
}

async function moveTaskCTRL(req, res){
  try{
    const taskId = Number(req.params.taskId);
    const { columnId ,position} = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json(errorResponse(401, "Unauthorized"));
    
const task = await taskService.moveTask(taskId, columnId, position, userId);
res.status(200).json(successResponse({message :"Task moved successfully"}));
  }
  catch(err){
    res.status(400).json(errorResponse(400, err.message));
  }
}

module.exports = taskController;