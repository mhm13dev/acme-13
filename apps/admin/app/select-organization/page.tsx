import React from "react";
import Link from "next/link";
import { AppRoutes } from "@/config/routes";
import { authWrapper } from "@/lib/auth/auth-wrapper";
import { AppWrapper } from "@/components/app-wrapper";

function SelectOrganizationPage() {
  return (
    <AppWrapper className="flex justify-center items-center h-screen">
      <section className="rounded-lg max-w-md w-full">
        {organizations.length > 0 ? (
          <>
            <h1 className="text-xl font-bold text-center">
              Select Organization
            </h1>
            <div className="border rounded-lg mt-4">
              {organizations.map((organization) => (
                <Link
                  key={organization.id}
                  href={`/o/${organization.id}`}
                  className="flex items-center justify-between gap-2 border-b last:border-b-0 py-3 px-4 hover:bg-gray-50"
                >
                  <h2 className="text-base font-medium">{organization.name}</h2>
                  <span className="text-sm text-gray-500 font-medium">
                    {organization.id}
                  </span>
                </Link>
              ))}
            </div>
          </>
        ) : null}

        <div className="mt-4">
          {organizations.length > 0 ? (
            <p className="text-sm text-gray-500 text-center">
              Don&apos;t see the organization you&apos;re looking for?
            </p>
          ) : (
            <div className="text-center">
              <p className="text-base font-medium text-gray-500">
                You don&apos;t have any organizations yet.
              </p>
              <p className="mt-4 text-sm text-gray-500">
                Create an organization to get started.
              </p>
            </div>
          )}
          <button className="mt-4 bg-black text-white py-2 px-4 rounded-md font-medium block w-full focus:outline-none focus:border-none focus:ring-2 focus:ring-black">
            Create Organization
          </button>
        </div>
      </section>
    </AppWrapper>
  );
}

export default authWrapper(
  SelectOrganizationPage,
  AppRoutes.selectOrganization.auth
);

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
