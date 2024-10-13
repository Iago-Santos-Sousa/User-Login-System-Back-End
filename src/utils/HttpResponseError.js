class HttpError extends Error {
  constructor(message, statusCode, body) {
    super(message);
    this.statusCode = statusCode;
    this.messageResponse = message;
    this.body = body;
  }
}

class BadRequestError extends HttpError {
  constructor(messageResponse, body) {
    super(messageResponse, 400, body);
  }
}

class UnauthorizedError extends HttpError {
  constructor(messageResponse) {
    super(messageResponse, 401);
  }
}

class ForbiddenError extends HttpError {
  constructor(messageResponse) {
    super(messageResponse, 403);
  }
}

class NotFoundError extends HttpError {
  constructor(messageResponse) {
    super(messageResponse, 404);
  }
}
class ExistResourceError extends HttpError {
  constructor(messageResponse) {
    super(messageResponse, 409);
  }
}

class NotAcceptableError extends HttpError {
  constructor(messageResponse) {
    super(messageResponse, 406);
  }
}

class GoneError extends HttpError {
  constructor(messageResponse) {
    super(messageResponse, 410);
  }
}

class InternalServerError extends HttpError {
  constructor(messageResponse) {
    super(messageResponse, 500);
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
