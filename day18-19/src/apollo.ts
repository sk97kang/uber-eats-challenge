import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";
import { LS_TOKEN } from "./constants";

const token = localStorage.getItem(LS_TOKEN);
export const isLoggedInVar = makeVar(Boolean(token));
export const authTokenVar = makeVar(token);

export const client = new ApolloClient({
  uri: "https://my-podcast-backend.herokuapp.com/graphql",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVar();
            },
          },
          token: {
            read() {
              return authTokenVar();
            },
          },
        },
      },
    },
  }),
});
