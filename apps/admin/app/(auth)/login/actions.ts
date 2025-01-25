"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import * as jose from "jose";
import { AuthFormData } from "@repo/shared-lib/zod-schemas";
import { ApiResponse } from "@repo/shared-lib/api-response";
import { LoginUserResponse } from "@repo/shared-lib/api-response/users";
import { env } from "@/config/env";

/**
 * Login a user.
 */
export const loginUser = async (
  authFormData: AuthFormData
): Promise<ApiResponse | void> => {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/users/login`, {
    method: "POST",
    body: JSON.stringify(authFormData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return (await response.json()) as ApiResponse;
  }

  const { data }: LoginUserResponse = await response.json();

  const cookieStore = await cookies();

  cookieStore.set("accessToken", data.accessToken, {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "strict",
    expires: new Date(jose.decodeJwt(data.accessToken).exp! * 1000),
  });
  cookieStore.set("refreshToken", data.refreshToken, {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "strict",
    expires: new Date(jose.decodeJwt(data.refreshToken).exp! * 1000),
  });

  // Redirect to Home Page on successful login
  redirect("/");
};
