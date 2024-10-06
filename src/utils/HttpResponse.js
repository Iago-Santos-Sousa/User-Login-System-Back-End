class HttpResponse {
  constructor(statusCode, message, data = null) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  toJSON() {
    return {
      status: this.statusCode < 400 ? "success" : "error",
      message: this.message,
      data: this.data,
    };
  }

  static badRequest(message) {
    return new HttpResponse(400, message);
  }

  static notFound(message) {
    return new HttpResponse(404, message);
  }

  static unauthorized(message) {
    return new HttpResponse(401, message);
  }

  static existResource(message) {
    return new HttpResponse(409, message);
  }

  static notAcceptable(message) {
    return new HttpResponse(406, message);
  }

  static gone(message) {
    return new HttpResponse(410, message);
  }

  static success(data, message = "Success") {
    return new HttpResponse(200, message, data);
  }

  static internalServerError(message = "Internal Server Error") {
    return new HttpResponse(500, message);
  }
}

module.exports = HttpResponse;
