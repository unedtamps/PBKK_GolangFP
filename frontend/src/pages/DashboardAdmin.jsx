import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

export default function DashboardAdmin() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'admin') {
      navigate(role === 'admin' ? '/dashboard' : '/login');
    }
  }, [navigate]);

  const menuItemsUser = [
    { title: "Dashboard", link: "/landing", img: "/public/vite.svg" },
    { title: "Daftar Buku", link: "/landing", img: "/public/vite.svg" },
  ];

  return (
    <div className="">
      <Sidebar menuItems={menuItemsUser}/>
      <div className="flex-1 p-4 pl-72">
          <h1 className="text-2xl font-bold">Welcome!</h1>
      </div>
    </div>
  );
}
