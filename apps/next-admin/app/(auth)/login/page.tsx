import React from "react";
import { AuthHeading } from "../_components/auth-heading";
import { AuthForm } from "../_components/auth-form";
import { AuthFooter } from "../_components/auth-footer";
import { loginUser } from "./actions";

export default function LoginPage() {
  return (
    <>
      <AuthHeading>Login to your account</AuthHeading>

      <AuthForm formType="login" onSubmitAction={loginUser} />

      <AuthFooter formType="login" />
    </>
  );
}
