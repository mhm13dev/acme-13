import { redirect } from "next/navigation";
import { AppRoutes } from "@/config/routes";
import { authenticateUser } from "@/lib/api/authenticate-user";

export function publicOnly<P extends object>(Component: React.FC<P>) {
  return async function PublicOnlyComponent(props: P) {
    const authData = await authenticateUser();
    if (authData) {
      redirect(AppRoutes.organization.select.path);
    }
    return <Component {...props} />;
  };
}
