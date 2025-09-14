require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const loggerMiddleware = require("./api/middlewares/logger.middleware");
const userRouter = require("./api/routes/user.routes");
const boardRouter = require("./api/routes/board.route");
const columnRouter = require("./api/routes/column.route");
const taskRouter = require("./api/routes/task.route");
const authMiddleware = require("./api/middlewares/auth.middleware");

const app = express();

app.use(loggerMiddleware);
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/boards", boardRouter);
app.use("/api/columns", columnRouter);
app.use("/api/tasks", taskRouter);

app.use(authMiddleware);

app.use((err, req, res, next) => {
  console.error(err.stack); 
  res.status(400).json({ error: err.message }); 
});

module.exports = app;
