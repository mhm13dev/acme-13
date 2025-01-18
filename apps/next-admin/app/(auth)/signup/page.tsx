import React from "react";
import { signupUser } from "@/lib/actions/signup-user.action";
import { AuthHeading } from "../_components/auth-heading";
import { AuthForm } from "../_components/auth-form";
import { AuthFooter } from "../_components/auth-footer";

export default function SignupPage() {
  return (
    <>
      <AuthHeading>Create an account</AuthHeading>

      <AuthForm formType="signup" onSubmitAction={signupUser} />

      <AuthFooter formType="signup" />
    </>
  );
}
