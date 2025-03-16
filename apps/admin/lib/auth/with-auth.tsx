import { redirect } from "next/navigation";
import { AppRoutes } from "@/config/routes";
import { authenticateUser } from "./authenticate-user";

export function withAuth<P extends object>(Component: React.FC<P>) {
  return async function WithAuthComponent(props: P) {
    const authUser = await authenticateUser();
    if (!authUser) {
      redirect(AppRoutes.auth.login.path);
    }
    return <Component {...props} authUser={authUser} />;
  };
}
