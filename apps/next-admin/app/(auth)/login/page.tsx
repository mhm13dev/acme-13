import React from "react";
import { loginUser } from "@/lib/actions/login-user.action";
import { AuthHeading } from "../_components/auth-heading";
import { AuthForm } from "../_components/auth-form";
import { AuthFooter } from "../_components/auth-footer";

export default function LoginPage() {
  return (
    <>
      <AuthHeading>Login to your account</AuthHeading>

      <AuthForm formType="login" onSubmitAction={loginUser} />

      <AuthFooter formType="login" />
    </>
  );
}
