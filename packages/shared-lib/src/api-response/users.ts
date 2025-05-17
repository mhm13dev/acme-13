import type { UserWithoutSensitiveFields } from "@repo/db";
import type { ApiResponse } from "./index.js";

export type SignupUserResponse = ApiResponse<{
  user: UserWithoutSensitiveFields;
}>;

export type LoginUserResponse = ApiResponse<{
  user: UserWithoutSensitiveFields;
}>;

export type TokenPayload = {
  userId: number;
  sessionId: string;
  expiresAt: Date;
};

export type AuthData = {
  tokenPayload: TokenPayload;
  user: UserWithoutSensitiveFields;
};

export type MeResponse = ApiResponse<AuthData>;

export const SESSION_TOKEN_COOKIE = "session_token";
