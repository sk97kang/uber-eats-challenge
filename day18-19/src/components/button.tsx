import React from "react";

interface IButtonProps {
  isValid: boolean;
  loading: boolean;
  text: string;
  onClick?: () => void;
}

export const Button: React.FC<IButtonProps> = ({
  isValid,
  loading,
  text,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`text-white py-3 focus:outline-none hover:bg-blue-400 transition-colors duration-500 ${
      isValid && !loading ? "bg-blue-500" : "bg-gray-300 pointer-events-none"
    }`}
    disabled={loading ? true : false}
  >
    {loading ? "Loading..." : text}
  </button>
);
