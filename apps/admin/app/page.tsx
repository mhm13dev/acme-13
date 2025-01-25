import React from "react";
import { AppWrapper } from "@/components/app-wrapper";
import { withAuth } from "@/lib/auth/with-auth";

function HomePage() {
  return (
    <AppWrapper>
      <h1 className="text-xl font-bold text-center">Acme 13 - Home</h1>
    </AppWrapper>
  );
}

export default withAuth(HomePage);
