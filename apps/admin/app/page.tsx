import React from "react";
import type { IJwtPayload } from "@repo/shared-lib/api-response/users";
import { AppWrapper } from "@/components/app-wrapper";
import { withAuth } from "@/lib/auth/with-auth";

function HomePage({ authUser }: { authUser: IJwtPayload }) {
  return (
    <AppWrapper>
      <h1 className="text-xl font-bold text-center">Acme 13 - Home</h1>
      <h3 className="text-center mt-4">
        Welcome{" "}
        <span className="font-medium text-purple-500">
          {authUser.email} ({authUser.sub})
        </span>
      </h3>
    </AppWrapper>
  );
}

export default withAuth(HomePage);
