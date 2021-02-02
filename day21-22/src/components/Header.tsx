import React from "react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <div className="w-full p-4 bg-gray-500 text-white text-lg font-medium flex justify-between">
      <div>
        <Link to="/">Podcast</Link>
      </div>
      <div>
        <Link to="/logout">log out</Link>
      </div>
    </div>
  );
};
