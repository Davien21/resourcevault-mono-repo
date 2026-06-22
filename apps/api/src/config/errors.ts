export class HttpError extends Error {
  statusCode: number;
  code: string;
  details?: Record<string, string[]>;

  constructor(
    statusCode: number,
    message: string,
    code = "error",
    details?: Record<string, string[]>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "Bad request", details?: Record<string, string[]>) {
    super(400, message, "bad_request", details);
  }
}
export class UnauthorizedError extends HttpError {
  constructor(message = "You must be signed in to do that") {
    super(401, message, "unauthorized");
  }
}
export class ForbiddenError extends HttpError {
  constructor(message = "You do not have permission to do that") {
    super(403, message, "forbidden");
  }
}
export class NotFoundError extends HttpError {
  constructor(message = "Resource not found") {
    super(404, message, "not_found");
  }
}
export class ConflictError extends HttpError {
  constructor(message = "That already exists") {
    super(409, message, "conflict");
  }
}
