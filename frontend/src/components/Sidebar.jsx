import React from "react";
import SidebarMenu from "./SidebarMenu";

const Sidebar = ({ menuItems }) => {
  return (
    <aside
      className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform bg-blue-600 border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 sm:block"
      aria-label="Sidenav"
    >
      <div className="flex items-center justify-center py-2 mt-4">
          <img
            src="/public/vite.svg"
            alt="judul"
            className="w-12"
          />
      </div>

      <div className="overflow-y-auto py-5 px-3 h-full">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <SidebarMenu
              key={index}
              link={item.link}
              img={item.img}
              title={item.title}
            />
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;