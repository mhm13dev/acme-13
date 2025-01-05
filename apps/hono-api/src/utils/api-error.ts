import type { StatusCode } from "hono/utils/http-status";
import type { ApiResponseCode } from "./api-response.js";

export class ApiError extends Error {
  constructor(
    public response_code: ApiResponseCode,
    message: string,
    public statusCode: StatusCode = 500
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}
