function notFound(request, response, next) {
  if (request.path.startsWith("/api/")) {
    response.status(404).json({
      ok: false,
      message: "API route not found.",
    });
    return;
  }

  next();
}

module.exports = notFound;
