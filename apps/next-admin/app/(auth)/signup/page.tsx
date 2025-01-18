import React from "react";
import { type AuthFormData } from "@repo/shared-lib/zod-schemas/auth.schema";
import { AuthHeading } from "../_components/auth-heading";
import { AuthForm } from "../_components/auth-form";
import { AuthFooter } from "../_components/auth-footer";

export default function SignupPage() {
  return (
    <>
      <AuthHeading>Create an account</AuthHeading>

      <AuthForm
        formType="signup"
        onSubmitAction={async (formData: AuthFormData) => {
          "use server";
          console.log({
            tag: "Signup form submitted",
            formData,
          });
        }}
      />

      <AuthFooter formType="signup" />
    </>
  );
}
