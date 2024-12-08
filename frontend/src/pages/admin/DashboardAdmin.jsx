import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import { fetch } from "../../utils/fetch";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DashboardAdmin() {
  const [allBooks, setAllBooks] = useState([]);
  const [allAccounts, setAllAccounts] = useState([]);
  const [allBorrows, setAllBorrows] = useState([]);
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      navigate("/login");
      return
    }
    if (role != "admin") {
      navigate("/home");
      return
    }

    fetch.fetchAllBooks(setAllBooks);
    fetch.fetchAllAccounts(setAllAccounts);
    fetch.fetchAllBorrows(setAllBorrows);
  }, [navigate]);

  const menuItemsUser = [
    { title: "Dashboard", link: "/dashboard", img: "/public/open-book.svg" },
    { title: "Account List", link: "/accountlist", img: "/public/user.svg" },
    { title: "Book List", link: "/booklistadmin", img: "/public/book.svg" },
    { title: "Borrow History", link: "/borrow-history", img: "/public/borrow.svg" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar menuItems={menuItemsUser} />
      <div className="flex-1 pl-72 p-6">
        <h2 className="text-3xl font-semibold text-black">
          Welcome Back {username}!
        </h2>

        {/* Kotak Statistik */}
        <div className="grid grid-cols-3 gap-6 my-6">
          <div className="bg-white shadow-md p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold">Total Akun</h3>
            <p className="text-2xl text-blue-600">{allAccounts.length}</p>
          </div>
          <div className="bg-white shadow-md p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold">Total Buku</h3>
            <p className="text-2xl text-green-600">{allBooks.length}</p>
          </div>
          <div className="bg-white shadow-md p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold">Total Peminjaman</h3>
            <p className="text-2xl text-red-600">{allBorrows.length}</p>
          </div>
        </div>

        {/* Dua Kotak di Bawah */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-center">My Library</h3>
          </div>
          <div className="bg-white shadow-md p-6 rounded-lg flex flex-col items-center">
            <h3 className="text-lg font-semibold text-center mb-4">
              Genre Distribution
            </h3>
            <div className="w-64 h-64">
              {/* <Pie data={pieData} options={{ maintainAspectRatio: false }} /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
