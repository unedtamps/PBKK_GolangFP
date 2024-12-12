import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../utils/constans";
import { fetch } from "../../utils/fetch";
import { Bar } from "react-chartjs-2";
import { FloatingAlert } from "../../components/FloatAlert";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DashboardAdmin() {
  const [allBooks, setAllBooks] = useState([]);
  const [allAccounts, setAllAccounts] = useState([]);
  const [allBorrows, setAllBorrows] = useState([]);
  const navigate = useNavigate();
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState("")
  const [title, setTitle] = useState("")
  const username = localStorage.getItem("username");
  const [data, setData] = useState({
    labels: [],
    datasets: [],
  });

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

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

    const fetchBorrowStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/borrows/stats`);
        const stats = response.data.data;

        const labels = stats.map(stat => {
          const date = new Date(stat.year, stat.month - 1);
          return date.toLocaleString("en-US", { month: "short" });
        });
        const counts = stats.map(stat => stat.count);

        setData({
          labels,
          datasets: [
            {
              data: counts,
              backgroundColor: labels.map(() => getRandomColor()),
              barPercentage: 0.5,
            },
          ],
        });
      } catch (error) {
        console.error("Failed to fetch borrow stats:", error);
      }
    };

    fetchBorrowStats();
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

      {message && (
        <FloatingAlert
          message={message}
          status={status}
          title={title}
          onClose={() => { setMessage(""); setStatus(""); setTitle("") }} // Reset error message
        />
      )}

      <div className="flex-1 pl-72 p-6">
        <h2 className="text-3xl font-semibold text-black">
          Welcome Back {username}!
        </h2>

        {/* Kotak Statistik */}
        <div className="grid grid-cols-3 gap-6 my-6">
          <div className="bg-white shadow-md p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold">Total Member</h3>
            <p className="text-2xl text-blue-600">{allAccounts.length}</p>
          </div>
          <div className="bg-white shadow-md p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold">Total Book</h3>
            <p className="text-2xl text-green-600">{allBooks.length}</p>
          </div>
          <div className="bg-white shadow-md p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold">Total Transaction</h3>
            <p className="text-2xl text-red-600">{allBorrows.length}</p>
          </div>
        </div>

        {/* Dua Kotak di Bawah */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white shadow-md px-6 pt-6 rounded-lg">
            <h3 className="text-lg font-semibold text-center">Transaction in a Months</h3>
            <Bar
              data={data}
              options={{
                aspectRatio: 1.7,
                responsive: true,
                plugins: {
                  legend: { display: false },
                  title: { display: true, text: "" },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
