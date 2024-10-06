const HttpResponse = require("../utils/HttpResponse");

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof HttpResponse) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  const internalError = new HttpResponse(500, "Internal Server Error");
  res.status(internalError.statusCode).json(internalError.toJSON());
};

module.exports = errorHandler;
