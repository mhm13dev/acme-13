import type { UserWithoutSensitiveFields } from "../db/index.js";
import type { ApiResponse } from "./index.js";

export type SignupUserResponse = ApiResponse<{
  user: UserWithoutSensitiveFields;
}>;

export type LoginUserResponse = ApiResponse<{
  user: UserWithoutSensitiveFields;
  accessToken: string;
  refreshToken: string;
}>;

export type RefreshTokensResponse = ApiResponse<{
  accessToken: string;
  refreshToken: string;
}>;

export type MeResponse = ApiResponse<{
  user: UserWithoutSensitiveFields;
}>;
