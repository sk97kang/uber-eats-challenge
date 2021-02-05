import React from "react";
import { render, waitFor } from "../../test-utils";
import { LoggedOutRouter } from "../logged-out-router";

jest.mock("../../pages/login", () => {
  return {
    Login: () => <span>login</span>,
  };
});

describe("<LoggedOutRouter />", () => {
  it("should render OK", () => {
    render(<LoggedOutRouter />);
  });
});
