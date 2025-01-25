import { authenticateUser } from "./authenticate-user";

export function withAuth<T extends React.JSX.IntrinsicAttributes>(
  Component: React.FC<T>
) {
  return async function AuthComponent(props: T) {
    await authenticateUser();
    return <Component {...props} />;
  };
}
