export const AuthWrapperType = {
  withAuth: "with-auth",
  publicOnly: "public-only",
} as const;

export type AuthWrapperType = (typeof AuthWrapperType)[keyof typeof AuthWrapperType];
