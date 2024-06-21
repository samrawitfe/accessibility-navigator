const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).json({ error: "Malformatted id" });
  }
  next(error);
};

module.exports = errorHandler;
