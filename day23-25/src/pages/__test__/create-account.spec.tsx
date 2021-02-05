import { render, waitFor, RenderResult } from "../../test-utils";
import React from "react";
import { ApolloProvider } from "@apollo/client";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { CreateAccount, CREATE_ACCOUNT_MUTATION } from "../create-account";
import userEvent from "@testing-library/user-event";
import { UserRole } from "../../__type_graphql__/globalTypes";

describe("<CreateAccount />", () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;
  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <CreateAccount />
        </ApolloProvider>
      );
    });
  });

  it("renders OK", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Create Account | Nuber-podcasts");
    });
  });

  it("should render validation errors", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/E-mail/i);
    const password = getByPlaceholderText(/password/i);
    const passwordConfirm = getByPlaceholderText(/confirm/i);
    await waitFor(() => {
      userEvent.type(email, "test@test");
    });
    let errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/Email address invalid/i);
    await waitFor(() => {
      userEvent.clear(email);
    });
    errorMessage = getByRole("alert");
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
      userEvent.type(password, "12345");
      userEvent.clear(password);
    });
    errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/Password is required!/i);
    await waitFor(() => {
      userEvent.type(password, "1234512345");
      userEvent.type(passwordConfirm, "12345");
    });
    errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/Password not matched/i);
  });

  it("should submit mutation with form values", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/E-mail/i);
    const password = getByPlaceholderText(/password/i);
    const passwordConfirm = getByPlaceholderText(/confirm/i);
    const submit = getByRole("button");
    const formData = {
      email: "test@test.com",
      password: "1234512345",
      passwordConfirm: "1234512345",
      role: UserRole.Host,
    };
    const mockedCreateAccountMutationResponse = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: true,
          error: "mutation-error",
        },
      },
    });
    mockedClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockedCreateAccountMutationResponse
    );
    jest.spyOn(window, "alert").mockImplementation(() => null);
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.type(passwordConfirm, formData.passwordConfirm);
      userEvent.click(submit);
    });

    expect(mockedCreateAccountMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedCreateAccountMutationResponse).toHaveBeenCalledWith({
      createAccountInput: {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      },
    });
    expect(window.alert).toHaveBeenCalledWith("Account Created! Log in now!");
  });
});
