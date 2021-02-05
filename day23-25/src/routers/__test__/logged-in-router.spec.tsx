import { MockedProvider } from "@apollo/client/testing";
import { waitFor } from "@testing-library/react";
import React from "react";
import { ME_QUERY } from "../../hooks/useMe";
import { render } from "../../test-utils";
import { LoggedInRouter } from "../logged-in-router";

describe("<LoggedInRouter />", () => {
  it("should render OK", async () => {
    await waitFor(() => {
      render(
        <MockedProvider
          mocks={[
            {
              request: { query: ME_QUERY },
              result: {
                data: {
                  me: {
                    id: 1,
                    email: "test",
                    role: "test",
                    verified: false,
                  },
                },
              },
            },
          ]}
        >
          <LoggedInRouter />
        </MockedProvider>
      );
    });
  });

  it("should render listener router", async () => {
    await waitFor(() => {
      render(
        <MockedProvider
          mocks={[
            {
              request: { query: ME_QUERY },
              result: {
                data: {
                  me: {
                    id: 1,
                    email: "test",
                    role: "Listener",
                    verified: false,
                  },
                },
              },
            },
          ]}
        >
          <LoggedInRouter />
        </MockedProvider>
      );
    });
  });
});
