import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as jose from "jose";
import { IJwtPayload } from "@repo/shared-lib/api-response/users";
import { env } from "@/config/env";
import { ACCESS_TOKEN_COOKIE } from "./constants";

const accessTokenPublicKey = await jose.importSPKI(
  env.ACCESS_TOKEN_PUBLIC_KEY_PEM,
  env.JWT_ALGORITHM
);

/**
 * Authenticate user by verifying the access token.
 */
export async function authenticateUser(): Promise<IJwtPayload | null> {
  const cookieStore = await cookies();

  try {
    const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE);

    if (!accessToken?.value) {
      throw new Error("Access token not found");
    }

    // Verify access token
    const { payload } = await jose.jwtVerify<IJwtPayload>(
      accessToken.value,
      accessTokenPublicKey,
      {
        algorithms: [env.JWT_ALGORITHM],
      }
    );

    return payload;
  } catch (error) {
    return null;
  }
}
