
// success response
function successResponse(data) {
  return {
    success: true,
    data: data,
    error: null,
  };
}

// error response
function errorResponse(code, message) {
  return {
    success: false,
    data: null,
    error: {
      code: code,
      message: message,
    },
  };
}

module.exports = {
  successResponse,
  errorResponse,
};
