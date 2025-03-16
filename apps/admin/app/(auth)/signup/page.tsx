import React from "react";

import { AppRoutes } from "@/config/routes";
import { authWrapper } from "@/lib/auth/auth-wrapper";
import { TypographyH3 } from "@/components/ui/typography/h3";
import { AuthForm } from "../_components/auth-form";
import { AuthFooter } from "../_components/auth-footer";
import { signupUser } from "./actions";

export function SignupPage() {
  return (
    <>
      <TypographyH3 className="text-center">Create an account</TypographyH3>

      <AuthForm formType="signup" onSubmitAction={signupUser} />

      <AuthFooter formType="signup" />
    </>
  );
}

export default authWrapper(SignupPage, AppRoutes.auth.signup.auth);
