import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import CardBook from "../../components/CardBook";
import { fetch } from "../../utils/fetch";
import { useNavigate } from "react-router-dom";

export default function BookListUser() {
  const [allBooks, setAllBooks] = useState([]);
  const menuItemsUser = [
    { title: "Dashboard", link: "/dashboarduser", img: "/public/vite.svg" },
    { title: "Daftar Buku", link: "/booklistuser", img: "/public/vite.svg" },
    { title: "My Books", link: "/mybook", img: "/public/vite.svg" },
  ];
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "user") {
      navigate("/login");
    }

    fetch.fetchAllBooks(setAllBooks);
  }, [navigate]);

  const borrowBook = async (bookId) => {
    try {
      const response = await axios.post(
        `http://localhost:8081/borrow/${bookId}`,
        {bookId},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Book borrowed successfully. Check your email for the PDF link.");
      }
    } catch (error) {
      console.error("Failed to borrow book", error);
      alert("Failed to borrow book. Please try again later.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar menuItems={menuItemsUser} />

      <div className="flex-1 pl-72 p-6">
        <h2 className="text-3xl font-semibold text-black">Daftar Buku</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <CardBook books={allBooks} borrowBook={borrowBook} />
        </div>
      </div>
    </div>
  );
}
