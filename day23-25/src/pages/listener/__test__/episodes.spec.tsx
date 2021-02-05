import { render, waitFor } from "../../../test-utils";
import React from "react";
import { Episodes, GET_EPISODES_QUERY } from "../episodes";
import { ApolloProvider } from "@apollo/client";
import { RenderResult } from "@testing-library/react";
import { createMockClient, MockApolloClient } from "mock-apollo-client";

const Result = {
  data: {
    getPodcast: {
      ok: true,
      error: null,
      podcast: [
        {
          __typename: "Podcast",
          id: 1,
          title: "pdcast",
          category: "podcast category",
          thumbnailUrl: "png",
          description: "description",
          rating: 4,
        },
      ],
    },
    getEpisodes: {
      ok: true,
      error: null,
      episodes: [
        {
          __typename: "Podcast",
          title: "episode title",
          description: "episode description",
        },
      ],
    },
  },
};

jest.mock("react-router-dom", () => {
  const realModule = jest.requireActual("react-router-dom");
  return {
    ...realModule,
    useParams: () => {
      return {
        id: 1,
      };
    },
  };
});

describe("<Episodes />", () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;
  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      mockedClient.setRequestHandler(GET_EPISODES_QUERY, () =>
        Promise.resolve(Result)
      );
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <Episodes />
        </ApolloProvider>
      );
    });
  });

  it("renders OK", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Episode List | Nuber-podcasts");
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
