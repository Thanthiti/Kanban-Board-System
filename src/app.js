require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const loggerMiddleware = require("./api/middlewares/logger.middleware");
const userRouter = require("./api/routes/user.routes");
const authMiddleware = require("./api/middlewares/auth.middleware");

const app = express();

app.use(loggerMiddleware);
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api/users", userRouter);

app.use(authMiddleware);

app.use((err, req, res, next) => {
  console.error(err.stack); 
  res.status(400).json({ error: err.message }); 
});


module.exports = app;
