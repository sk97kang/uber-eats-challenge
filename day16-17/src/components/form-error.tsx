import React from "react";

interface IFormErrorProps {
  message: string;
}

export const FormError: React.FC<IFormErrorProps> = ({ message }) => {
  return <div className="text-red-500 font-medium text-sm">{message}</div>;
};
