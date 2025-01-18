import React from "react";
import { AuthHeading } from "../_components/auth-heading";
import { AuthForm } from "../_components/auth-form";
import { AuthFooter } from "../_components/auth-footer";

export default function LoginPage() {
  return (
    <>
      <AuthHeading>Login to your account</AuthHeading>

      <AuthForm
        formType="login"
        onSubmitAction={async (formData: FormData) => {
          "use server";
          console.log({
            tag: "Login form submitted",
            formData,
          });
        }}
      />

      <AuthFooter formType="login" />
    </>
  );
}
