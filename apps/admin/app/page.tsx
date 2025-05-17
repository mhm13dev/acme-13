import React from "react";
import { type AuthData } from "@repo/shared-lib/api-response/users";
import { AppRoutes } from "@/config/routes";
import { AuthWrapper } from "@/components/auth/wrapper";
import { AppWrapper } from "@/components/app-wrapper";

function HomePage({ authData }: { authData: AuthData }) {
  return (
    <AppWrapper>
      <h1 className="text-xl font-bold text-center">Acme 13 - Home</h1>
      <h3 className="text-center mt-4">
        Welcome{" "}
        <span className="font-medium text-purple-500">
          {authData.user.email} ({authData.user.id})
        </span>
      </h3>
    </AppWrapper>
  );
}

export default AuthWrapper(HomePage, AppRoutes.home.auth);
