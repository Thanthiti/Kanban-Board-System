const columnService = require("../../services/column.service");
const { successResponse, errorResponse } = require("../../config/response");

const columnController = {
    createColumnCTRL,
    getColumnsCTRL,
    getColumnbyIdCTRL,
    updateColumnCTRL,
    deleteColumnCTRL,
};
// Create a column
async function createColumnCTRL(req, res) {
    try {
        const {boardId, name } = req.body;
        const userId = req.user?.id;
        if (!boardId || !userId || !name)
            return res.status(400).json(errorResponse(400, "Bad request"));

        const column = await columnService.createColumn(boardId,userId, name);
        res.status(201).json(successResponse(column));
    } catch (error) {
        res.status(400).json(errorResponse(400, error.message));
    }
}
// Display all columns of a board
async function updateColumnCTRL(req, res) {
    try{
        const  columnId  = Number(req.params.columnId);
        const { boardId , name} = req.body;
        const userId = req.user?.id;
        if (!boardId || !userId || !name)
            return res.status(400).json(errorResponse(400, "Bad request"));
        
        const column = await columnService.updateColumn(boardId,columnId,userId, name);
        res.status(200).json(successResponse(column));
    }
    catch(error){
        res.status(400).json(errorResponse(400, error.message));
    }
}
// Delete a column
async function deleteColumnCTRL(req, res) {
    try{
        const columnId = Number(req.params.columnId);
        const boardId = Number(req.params.boardId);
        const userId = req.user?.id;
        if (!boardId || !userId || !columnId)
            return res.status(400).json(errorResponse(400, "Bad request"));

        await columnService.deleteColumn(boardId,columnId,userId);
        res.status(200).json(successResponse({message:"Columns deleted successfully"}));
    }
    catch(error){
        res.status(400).json(errorResponse(400, error.message));
    }
}
// Display all columns
async function getColumnsCTRL(req, res) {
    try{
        const boardId = Number(req.params.boardId);
        const userId = req.user?.id;
        if (!boardId || !userId)
            return res.status(400).json(errorResponse(400, "Bad request"));

        const columns = await columnService.getColumns(boardId,userId);
        res.status(200).json(successResponse(columns));
    }
    catch(error){
        res.status(400).json(errorResponse(400, error.message));
    }
}

// Display a column by id
async function getColumnbyIdCTRL(req, res) {
    try{
        const columnId = Number(req.params.columnId);
        const boardId = Number(req.params.boardId);
        const userId = req.user?.id;
        if (!boardId || !userId || !columnId)
            return res.status(400).json(errorResponse(400, "Bad request"));

        const column = await columnService.getColumnbyId(boardId,columnId,userId);
        res.status(200).json(successResponse(column));
    }
    catch(error){
        res.status(400).json(errorResponse(400, error.message));
    }
}

module.exports = columnController;