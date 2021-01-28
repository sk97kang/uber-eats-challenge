import React from "react";

interface ILayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const Layout: React.FC<ILayoutProps> = ({ children, title }) => {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-800">
      {title && <h2 className="text-3xl mb-9 text-white">{title}</h2>}
      {children}
    </div>
  );
};
