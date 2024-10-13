class HttpError extends Error {
  constructor(message, statusCode, body) {
    super(message);
    this.statusCode = statusCode;
    this.body = body;
  }
}

class BadRequestError extends HttpError {
  constructor(message, body) {
    super(message, 400, body);
  }
}

class UnauthorizedError extends HttpError {
  constructor(message) {
    super(message, 401);
  }
}

class ForbiddenError extends HttpError {
  constructor(message) {
    super(message, 403);
  }
}

class NotFoundError extends HttpError {
  constructor(message) {
    super(message, 404);
  }
}
class ExistResourceError extends HttpError {
  constructor(message) {
    super(message, 409);
  }
}

class NotAcceptableError extends HttpError {
  constructor(message) {
    super(message, 406);
  }
}

class GoneError extends HttpError {
  constructor(message) {
    super(message, 410);
  }
}

class InternalServerError extends HttpError {
  constructor(message) {
    super(message, 500);
  }
}

module.exports = {
  HttpError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  InternalServerError,
  ExistResourceError,
  NotAcceptableError,
  GoneError,
};
