import { authenticateUser } from "./authenticate-user";

export function withAuth<P extends object>(Component: React.FC<P>) {
  return async function AuthComponent(props: P) {
    const authUser = await authenticateUser();
    return <Component {...props} authUser={authUser} />;
  };
}
