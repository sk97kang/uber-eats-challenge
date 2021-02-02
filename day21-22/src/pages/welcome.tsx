import React from "react";
import { HelmetOnlyTitle } from "../components/HelmetOnlyTitle";
import { useMe } from "../hooks/useMe";

export const WelcomePage = () => {
  const { loading, data } = useMe();
  return (
    <div>
      {loading ? (
        "Loading..."
      ) : (
        <>
          <HelmetOnlyTitle title={`Hello, ${data?.me?.email}`} />
          <p>{`Welcome, ${data?.me?.email}, you're a ${data?.me?.role}`}</p>
        </>
      )}
    </div>
  );
};
