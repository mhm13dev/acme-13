import { withAuth } from "./with-auth";
import { publicOnly } from "./public-only";
import { type AuthWrapperType } from "./constants";

export function authWrapper<P extends object>(
  Component: React.FC<P>,
  wrapperType: AuthWrapperType,
) {
  return async function AuthWrapperComponent(props: P) {
    switch (wrapperType) {
      case "with-auth":
        return withAuth(Component)(props);
      case "public-only":
        return publicOnly(Component)(props);
      default:
        return <Component {...props} />;
    }
  };
}
