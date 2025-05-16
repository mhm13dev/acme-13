export const ApiResponseCode = {
  ok: "ok",
  path_not_found: "path_not_found",
  internal_server_error: "internal_server_error",
  resource_not_found: "resource_not_found",
  access_token_required: "access_token_required",
  unauthorized: "unauthorized",
  conflict: "conflict",
  forbidden: "forbidden",
} as const;

export type ApiResponseCode = (typeof ApiResponseCode)[keyof typeof ApiResponseCode];

interface IApiResponseParams<T> {
  response_code: ApiResponseCode;
  message: string;
  data?: T;
}

export class ApiResponse<T = unknown> {
  response_code: ApiResponseCode;
  message: string;
  data: T;

  constructor(response: IApiResponseParams<T>) {
    this.response_code = response.response_code;
    this.message = response.message;
    this.data = response.data as T;
  }
}
