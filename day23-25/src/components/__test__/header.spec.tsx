import { MockedProvider } from "@apollo/client/testing";
import { render } from "../../test-utils";
import React from "react";
import { Header } from "../header";
import { ME_QUERY } from "../../hooks/useMe";
import { waitFor } from "@testing-library/react";

describe("<Header />", () => {
  it("should render OK", async () => {
    await waitFor(async () => {
      const { getByText } = render(
        <MockedProvider
          mocks={[
            {
              request: {
                query: ME_QUERY,
              },
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
          <Header />
        </MockedProvider>
      );
      getByText("test");
    });
  });
});
