import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { ApiResponseCode } from "@repo/shared-lib/api-response";

export class ApiError extends Error {
  constructor(
    public response_code: ApiResponseCode,
    message: string,
    public statusCode: ContentfulStatusCode = 500
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}
