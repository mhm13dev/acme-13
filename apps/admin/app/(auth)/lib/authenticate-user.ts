import "server-only";
import { cookies } from "next/headers";
import * as jose from "jose";
import { IJwtPayload } from "@repo/shared-lib/api-response/users";
import { envServer } from "@/config/env/server";
import { ACCESS_TOKEN_COOKIE } from "./constants";

const accessTokenPublicKey = await jose.importSPKI(envServer.ACCESS_TOKEN_PUBLIC_KEY_PEM, envServer.JWT_ALGORITHM);

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
    const { payload } = await jose.jwtVerify<IJwtPayload>(accessToken.value, accessTokenPublicKey, {
      algorithms: [envServer.JWT_ALGORITHM],
    });

    return payload;
  } catch {
    return null;
  }
}
