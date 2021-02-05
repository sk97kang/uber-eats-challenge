import { render, waitFor } from "../../test-utils";
import React from "react";
import { ApolloProvider } from "@apollo/client";
import { RenderResult } from "@testing-library/react";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { Login, LOGIN_MUTATION } from "../login";
import userEvent from "@testing-library/user-event";

describe("<Login />", () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;
  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <Login />
        </ApolloProvider>
      );
    });
  });
  it("renders OK", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Log In | Nuber-podcasts");
    });
  });

  it("should render validation errors", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/E-mail/i);
    const password = getByPlaceholderText(/password/i);
    await waitFor(() => {
      userEvent.type(email, "test@test");
      userEvent.clear(email);
    });
    let errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/Email is required!/i);
    await waitFor(() => {
      userEvent.type(email, "test@test.com");
      userEvent.type(password, "12345");
    });
    errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(
      /Password must be more than 10 characters/i
    );
    await waitFor(() => {
      userEvent.clear(password);
    });
    errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/Password is required!/i);
  });

  it("should submit mutation with form values", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/E-mail/i);
    const password = getByPlaceholderText(/password/i);
    const submit = getByRole("button");
    const formData = {
      email: "test@test.com",
      password: "1234512345",
    };
    const mockedLoginMutationResponse = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: true,
          error: "mutation-error",
          token: "token",
        },
      },
    });
    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedLoginMutationResponse);
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(submit);
    });
    expect(mockedLoginMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedLoginMutationResponse).toHaveBeenCalledWith({
      loginInput: {
        email: formData.email,
        password: formData.password,
      },
    });
  });
});
