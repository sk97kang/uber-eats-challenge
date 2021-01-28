import { useReactiveVar } from "@apollo/client";
import { LoggedInRouter } from "./routers/logged-in-router";
import { LoggedOutRouter } from "./routers/logged-out-router";
import { isLoggedInVar } from "./apollo";

export default function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  return isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />;
}
