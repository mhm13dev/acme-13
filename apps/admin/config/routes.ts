import { type AuthWrapperType } from "@/components/auth/types";

type RouteItem = {
  title: string;
  path: string;
  auth: AuthWrapperType;
};

type AppRoutesType = {
  [key: string]: RouteItem | { [key: string]: RouteItem };
};

export const AppRoutes = {
  auth: {
    login: {
      title: "Login",
      path: "/login",
      auth: "public-only",
    },
    signup: {
      title: "Signup",
      path: "/signup",
      auth: "public-only",
    },
  },
  home: {
    title: "Home",
    path: "/",
    auth: "with-auth",
  },
  organization: {
    select: {
      title: "Select Organization",
      path: "/organization/select",
      auth: "with-auth",
    },
  },
} satisfies AppRoutesType;
