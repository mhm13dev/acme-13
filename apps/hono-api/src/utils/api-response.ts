export enum ApiResponseCode {
  ok = "ok",
  path_not_found = "path_not_found",
  internal_server_error = "internal_server_error",
  resource_not_found = "resource_not_found",
}

export class ApiResponse {
  response_code: ApiResponseCode;
  message: string;
  data?: any;

  constructor(response: ApiResponse) {
    this.response_code = response.response_code;
    this.message = response.message;
    this.data = response.data;
  }
}
