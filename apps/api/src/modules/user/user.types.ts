import type { JWTPayload } from "jose";

export interface IJwtPayload extends JWTPayload {
  sub: string;
  email: string;
}
