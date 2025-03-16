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
  selectOrganization: {
    title: "Select Organization",
    path: "/select-organization",
    auth: "with-auth",
  },
} as const;
