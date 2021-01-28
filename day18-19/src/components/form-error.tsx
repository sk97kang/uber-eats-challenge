import React from "react";

interface IFormErrorProps {
  error: string;
}

export const FormError: React.FC<IFormErrorProps> = ({ error }) => (
  <span className="text-red-500">{error}</span>
);
