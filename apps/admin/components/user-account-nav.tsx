"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { AppRoutes } from "@/config/routes";
import { logoutUser } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";

interface UserAccountNavProps {
  userEmail: string;
}

export function UserAccountNav({ userEmail }: UserAccountNavProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const response = await logoutUser();

    if (response.response_code === "ok") {
      router.push(AppRoutes.auth.login.path);
    } else {
      console.error(response.message);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-muted-foreground">{userEmail}</span>
      <Button variant="outline" size="sm" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}
