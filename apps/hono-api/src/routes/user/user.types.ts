import type { JWTPayload } from "jose";

export interface IJwtPayload extends JWTPayload {
  sub: string;
  email: string;
  token_family: string;
}

export type TokenType = "access_token" | "refresh_token";
