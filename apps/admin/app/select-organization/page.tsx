import React from "react";
import Link from "next/link";
import { AppRoutes } from "@/config/routes";
import { AppWrapper } from "@/components/app-wrapper";
import { AuthWrapper } from "@/components/auth/wrapper";
import { TypographyH3 } from "@/components/ui/typography/h3";
import { Button } from "@/components/ui/button";

function SelectOrganizationPage() {
  return (
    <div className="bg-muted">
      <AppWrapper className="flex justify-center items-center h-screen">
        <section className="border rounded-md max-w-lg w-full bg-background p-8">
          {organizations.length > 0 && (
            <>
              <TypographyH3 className="text-center">Select Organization</TypographyH3>
              <div className="border rounded-md mt-4 overflow-hidden">
                {organizations.map((organization) => (
                  <Link
                    key={organization.id}
                    href={`/o/${organization.id}`}
                    className="flex items-center justify-between border-b last:border-b-0 p-3 hover:bg-muted focus:bg-muted focus:outline-hidden text-sm"
                  >
                    <span className="font-medium">{organization.name}</span>
                    <span className="text-muted-foreground font-normal">{organization.id}</span>
                  </Link>
                ))}
              </div>
            </>
          )}

          <div className="mt-4 space-y-4">
            <div className="text-center text-muted-foreground text-sm space-y-4">
              {organizations.length > 0 ? (
                <p>Don&apos;t see the organization you&apos;re looking for?</p>
              ) : (
                <p>
                  You don&apos;t have any organizations yet.
                  <br />
                  Create one to get started.
                </p>
              )}
            </div>

            <Button className="w-full">Create Organization</Button>
          </div>
        </section>
      </AppWrapper>
    </div>
  );
}

export default AuthWrapper(SelectOrganizationPage, AppRoutes.selectOrganization.auth);

const organizations = [
  {
    id: "org-1",
    name: "Organization 1",
  },
  {
    id: "org-2",
    name: "Organization 2",
  },
  {
    id: "org-3",
    name: "Organization 3",
  },
];
