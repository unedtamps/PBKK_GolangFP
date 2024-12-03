import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

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
    { title: "Dashboard", link: "/dashboarduser", img: "/public/vite.svg" },
    { title: "Daftar Buku", link: "/booklistuser", img: "/public/vite.svg" },
    { title: "My Books", link: "/mybook", img: "/public/vite.svg" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar menuItems={menuItemsUser} />

      <div className="flex-1 pl-72 p-6">
        <h2 className="text-3xl font-semibold text-black">
          Welcome Back {username}!
        </h2>

        <button
          className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => navigate("/booklistuser")}
        >
          View All
        </button>
      </div>
    </div>
  );
}