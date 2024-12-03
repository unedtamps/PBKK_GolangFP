import React from "react";
import { useLocation } from "react-router-dom";

const SidebarMenu = ({ link, img, title }) => {
  const location = useLocation();

  const isActive = location.pathname === link;

  return (
    <li className="w-full">
      <a
        href={link}
        className={`flex items-center p-2 text-normal font-normal group ${
          isActive
            ? "bg-white text-blue-600"
            : "text-white hover:bg-blue-700"
        }`}
      >
        <img
          src={img}
          alt={`${title} icon`}
          className={`w-6 h-6 mr-3 ${
            isActive
              ? "text-white"
              : "text-gray-400 dark:text-gray-400 group-hover:text-white"
          }`}
        />
        <span>{title}</span>
      </a>
    </li>
  );
};

export default SidebarMenu;