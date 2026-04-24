function errorHandler(error, request, response, next) {
  const statusCode = error.statusCode || 500;

  if (response.headersSent) {
    next(error);
    return;
  }

  response.status(statusCode).json({
    ok: false,
    message: statusCode === 500 ? "Something went wrong on the server." : error.message,
  });
}

module.exports = errorHandler;
