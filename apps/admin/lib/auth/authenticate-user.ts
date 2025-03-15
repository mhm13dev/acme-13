import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as jose from "jose";
import { env } from "@/config/env";
import { ACCESS_TOKEN_COOKIE } from "./constants";

const accessTokenPublicKey = await jose.importSPKI(
  env.ACCESS_TOKEN_PUBLIC_KEY_PEM,
  env.JWT_ALGORITHM
);

/**
 * Authenticate user by verifying the access token.
 * - If access token is invalid, redirect to login page.
 */
export async function authenticateUser(): Promise<void> {
  const cookieStore = await cookies();

  try {
    const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE);

    if (!accessToken?.value) {
      throw new Error("Access token not found");
    }

    // Verify access token
    await jose.jwtVerify(accessToken.value, accessTokenPublicKey, {
      algorithms: [env.JWT_ALGORITHM],
    });
  } catch (error) {
    console.error(error);
    // Redirect to login page if access token is invalid
    redirect("/login");
  }
}
