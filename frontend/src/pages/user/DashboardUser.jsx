import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import BookListUser from "../../components/BookListUser";

export default function DashboardUser() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "user") {
      navigate("/login");
    }
  }, [navigate]);

  const menuItemsUser = [
    { title: "List Books", link: "/dashboarduser", img: "/public/open-book.svg" },
    { title: "My Books", link: "/mybook", img: "/public/user.svg" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar menuItems={menuItemsUser} />

      <div className="flex-1 pl-72 p-6">
        <h2 className="text-3xl font-semibold text-black">
          Welcome Back {username}!
        </h2>

        <h2 className="text-xl py-6 font-semibold text-black">
          Check All of Our Book !!
        </h2>
        <BookListUser />
      </div>
    </div>
  );
}
