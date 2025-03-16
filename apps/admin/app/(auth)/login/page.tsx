import React from "react";
import { AppRoutes } from "@/config/routes";
import { authWrapper } from "@/lib/auth/auth-wrapper";
import { AuthHeading } from "../_components/auth-heading";
import { AuthForm } from "../_components/auth-form";
import { AuthFooter } from "../_components/auth-footer";
import { loginUser } from "./actions";

export function LoginPage() {
  return (
    <>
      <AuthHeading>Login to your account</AuthHeading>

      <AuthForm formType="login" onSubmitAction={loginUser} />

      <AuthFooter formType="login" />
    </>
  );
}

export default authWrapper(LoginPage, AppRoutes.auth.login.auth);
