import type { StatusCode } from "hono/utils/http-status";

export class AppError extends Error {
  constructor(
    public response_code: string,
    message: string,
    public statusCode: StatusCode = 500
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}
