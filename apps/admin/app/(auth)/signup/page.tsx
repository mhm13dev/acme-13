import React from "react";
import { publicOnly } from "@/lib/auth/public-only";
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

export default publicOnly(SignupPage);
