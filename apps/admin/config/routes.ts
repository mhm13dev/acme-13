import { AuthWrapperType } from "@/lib/auth/constants";

export const AppRoutes = {
  auth: {
    login: {
      title: "Login",
      path: "/login",
      auth: AuthWrapperType.publicOnly,
    },
    signup: {
      title: "Signup",
      path: "/signup",
      auth: AuthWrapperType.publicOnly,
    },
  },
  home: {
    title: "Home",
    path: "/",
    auth: AuthWrapperType.withAuth,
  },
  selectOrganization: {
    title: "Select Organization",
    path: "/select-organization",
    auth: AuthWrapperType.withAuth,
  },
} as const;
