import { redirect } from "next/navigation";
import { AppRoutes } from "@/config/routes";
import { authenticateUser } from "./authenticate-user";

export function publicOnly<P extends object>(Component: React.FC<P>) {
  return async function PublicOnlyComponent(props: P) {
    const authUser = await authenticateUser();
    if (authUser) {
      redirect(AppRoutes.selectOrganization.path);
    }
    return <Component {...props} />;
  };
}
