export enum ApiResponseCode {
  ok = "ok",
  path_not_found = "path_not_found",
  internal_server_error = "internal_server_error",
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
