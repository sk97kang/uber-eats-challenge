import React from "react";
import { TextLink } from "../components/text-link";

export const NotFound = () => {
  return (
    <div className="h-screen flex justify-center items-center flex-col">
      <h2 className="text-semibold text-2xl mb-3">Page Not Found</h2>
      <TextLink to="/">{"< Go Home"}</TextLink>
    </div>
  );
};
