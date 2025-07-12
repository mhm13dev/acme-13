import "server-only";
import { cookies } from "next/headers";
import { envServer } from "@repo/env/admin/server";
import type { AuthData, MeResponse } from "@repo/shared-lib/api-response/users";
import { SESSION_TOKEN_COOKIE } from "@repo/shared-lib/api-response/users";

/**
 * Authenticate user by verifying the session.
 */
export async function authenticateUser(): Promise<AuthData | null> {
  const cookieStore = await cookies();

  try {
    const sessionTokenCookie = cookieStore.get(SESSION_TOKEN_COOKIE);

    if (!sessionTokenCookie?.value) {
      throw new Error("Unauthorized");
    }

    const response = await fetch(`${envServer.NEXT_PUBLIC_API_URL}/users/me`, {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: `${sessionTokenCookie.name}=${sessionTokenCookie.value}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Unauthorized");
    }

    const { data } = (await response.json()) as MeResponse;

    return data;
  } catch {
    return null;
  }
}
