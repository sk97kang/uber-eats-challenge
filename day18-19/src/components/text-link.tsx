import React from "react";
import { Link } from "react-router-dom";

interface ITextLinkProps {
  to: string;
  children: React.ReactNode;
}

export const TextLink: React.FC<ITextLinkProps> = ({ to, children }) => {
  return (
    <Link to={to} className="hover:underline text-blue-500">
      {children}
    </Link>
  );
};
