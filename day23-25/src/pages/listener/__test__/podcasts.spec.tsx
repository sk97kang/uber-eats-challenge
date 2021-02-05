import { render, waitFor } from "../../../test-utils";
import React from "react";
import { ApolloProvider } from "@apollo/client";
import { RenderResult } from "@testing-library/react";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { ALLPODCASTS_QUERY, Podcasts } from "../podcasts";

describe("<Podcasts />", () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;
  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      mockedClient.setRequestHandler(ALLPODCASTS_QUERY, () =>
        Promise.resolve({
          data: {
            getAllPodcasts: {
              ok: true,
              error: null,
              podcasts: [
                {
                  __typename: "Podcast",
                  id: 1,
                  title: "test",
                  category: "test",
                  thumbnailUrl: "test",
                  description: "teset",
                  rating: 0,
                },
              ],
            },
          },
        })
      );
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <Podcasts />
        </ApolloProvider>
      );
    });
  });

  it("renders OK", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Home | Nuber-podcasts");
    });
  });
});
