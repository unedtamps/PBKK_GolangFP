import React from "react";
import Sidebar from "../../components/Sidebar";

export default function BookListAdmin() {
  
  const menuItemsUser = [
    { title: "Dashboard", link: "/dashboard", img: "/public/vite.svg" },
    { title: "Account List", link: "/accountlist", img: "/public/vite.svg" },
    { title: "Book List", link: "/booklistadmin", img: "/public/vite.svg" },
    { title: "Borrow List", link: "/borrowlist", img: "/public/vite.svg" },
  ];

  return (
    <div className="p-6">
      <Sidebar menuItems={menuItemsUser} />
      <div className="flex-1 pl-72 p-6">
        
      </div>
    </div>
  );
};
