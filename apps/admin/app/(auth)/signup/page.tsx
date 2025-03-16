import React from "react";
import { AppRoutes } from "@/config/routes";
import { authWrapper } from "@/lib/auth/auth-wrapper";
import { AuthHeading } from "../_components/auth-heading";
import { AuthForm } from "../_components/auth-form";
import { AuthFooter } from "../_components/auth-footer";
import { signupUser } from "./actions";

export function SignupPage() {
  return (
    <>
      <AuthHeading>Create an account</AuthHeading>

      <AuthForm formType="signup" onSubmitAction={signupUser} />

      <AuthFooter formType="signup" />
    </>
  );
}

export default authWrapper(SignupPage, AppRoutes.auth.signup.auth);
