import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as jose from "jose";
import { env } from "@/config/env";
import { REFRESH_TOKEN_COOKIE } from "./constants";

const refreshTokenPublicKey = await jose.importSPKI(
  env.REFRESH_TOKEN_PUBLIC_KEY_PEM,
  env.JWT_ALGORITHM
);

/**
 * Authenticate user by verifying the refresh token.
 * - If refresh token is invalid, redirect to login page.
 * - Access token is short-lived and can expire quickly.
 * It's almost safe to assume to use refresh token verification for protecting pages.
 */
export async function authenticateUser(): Promise<void> {
  const cookieStore = await cookies();

  try {
    const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE);

    if (!refreshToken?.value) {
      throw new Error("Refresh token not found");
    }

    // Verify refresh token
    await jose.jwtVerify(refreshToken.value, refreshTokenPublicKey, {
      algorithms: [env.JWT_ALGORITHM],
    });
  } catch (error) {
    console.error(error);
    // Redirect to login page if access token is invalid
    redirect("/login");
  }
}
