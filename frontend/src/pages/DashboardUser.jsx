import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserDashboard() {
  const [latestBooks, setLatestBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [showAllBooks, setShowAllBooks] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'user') {
      navigate(role === 'user' ? '/dashboarduser' : '/login');
    }
  }, [navigate]);

  const fetchAllBooks = async () => {
    try {
      const response = await axios.get("http://localhost:8081/book/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAllBooks(response.data.data);
      setShowAllBooks(true);
    } catch (error) {
      console.error("Failed to fetch all books", error);
    }
  };

  const borrowBook = async (bookId) => {
    try {
      await axios.post(
        "http://localhost:8081/borrow/{ bookId }",
        { book_id: bookId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Book borrowed successfully. Check your email for the PDF link.");
    } catch (error) {
      console.error("Failed to borrow book", error);
      alert("Failed to borrow book");
    }
  };

  const renderBooks = (books) => {
    return books.map((book) => (
      <div key={book.id} className="max-w-sm bg-white rounded-lg shadow-lg overflow-hidden">
        <img src={book.picture_url} alt={book.name} className="w-full h-48 object-cover"/>
        <div className="p-4">
          <h5 className="text-lg font-semibold text-gray-900">{book.name}</h5>
          <p className="text-sm text-gray-600 mt-2">{book.synopsis}</p>
          <button
            className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => borrowBook(book.id)}
          >
            Pinjam
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard User</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mt-6">Buku Terbaru</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {renderBooks(latestBooks)}
      </div>

      {showAllBooks ? (
        <>
          <h2 className="text-2xl font-semibold text-gray-800 mt-12">Semua Buku</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {renderBooks(allBooks)}
          </div>
        </>
      ) : (
        <button
          className="mt-6 px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          onClick={fetchAllBooks}
        >
          View All
        </button>
      )}
    </div>
  );
}