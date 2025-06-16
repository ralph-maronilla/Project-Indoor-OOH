import { StatusCodes } from "http-status-codes";


export class NotFoundError extends Error {1
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}

export class UnauthenticatedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnauthenticatedError";
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export class UnauthorizedError extends Error {
  constructor(message) {
     super(message);
    this.name = "UnauthorizedError";
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}