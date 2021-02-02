/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ToggleSubscribeInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: toggleSubscribe
// ====================================================

export interface toggleSubscribe_toggleSubscribe {
  __typename: "ToggleSubscribeOutput";
  ok: boolean;
  error: string | null;
}

export interface toggleSubscribe {
  toggleSubscribe: toggleSubscribe_toggleSubscribe;
}

export interface toggleSubscribeVariables {
  input: ToggleSubscribeInput;
}
