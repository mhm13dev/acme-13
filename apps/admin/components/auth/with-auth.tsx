import { redirect } from "next/navigation";
import { AppRoutes } from "@/config/routes";
import { authenticateUser } from "@/lib/api/authenticate-user";

export function withAuth<P extends object>(Component: React.FC<P>) {
  return async function WithAuthComponent(props: P) {
    const authData = await authenticateUser();
    if (!authData) {
      redirect(AppRoutes.auth.login.path);
    }
    return <Component {...props} authData={authData} />;
  };
}
