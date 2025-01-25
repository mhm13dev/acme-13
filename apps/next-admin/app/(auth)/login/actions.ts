"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AuthFormData } from "@repo/shared-lib/zod-schemas/auth.schema";
import { env } from "@/config/env";

interface LoginUserErrorResponse {
  response_code: string;
  message: string;
}

export type LoginUserResponse = LoginUserErrorResponse;

/**
 * Login a user.
 */
export const loginUser = async (
  authFormData: AuthFormData
): Promise<LoginUserErrorResponse | void> => {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/users/login`, {
    method: "POST",
    body: JSON.stringify(authFormData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    return data;
  }

  const cookieStore = await cookies();

  // FIXME: should be taken from JWT payload
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

  cookieStore.set("accessToken", data.data.accessToken, {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "strict",
    expires,
  });
  cookieStore.set("refreshToken", data.data.refreshToken, {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "strict",
    expires,
  });

  // Redirect to Home Page on successful login
  redirect("/");
};
