import type { JWTPayload } from "jose";
import type { UserWithoutSensitiveFields } from "../db/index.js";
import type { ApiResponse } from "./index.js";

export type SignupUserResponse = ApiResponse<{
  user: UserWithoutSensitiveFields;
}>;

export type LoginUserResponse = ApiResponse<{
  user: UserWithoutSensitiveFields;
  accessToken: string;
}>;

export type MeResponse = ApiResponse<{
  user: UserWithoutSensitiveFields;
}>;

export interface IJwtPayload extends JWTPayload {
  sub: string;
  email: string;
}
