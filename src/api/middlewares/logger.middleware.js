const logger = require("../../config/logger");

function loggerMiddleware(req, res, next) {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  next();
}

module.exports = loggerMiddleware;
