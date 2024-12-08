import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from "../../components/Sidebar";
import { API_URL } from '../../utils/constans';
import { useNavigate } from 'react-router-dom';

const CardBookBaru = ({ books }) => {
  return (
    <>
      {books.map((borrow) => {
        return (
          <div
            key={borrow.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <img
              src={`${API_URL}${borrow.book.picture_url}` || "/default-book-image.jpg"}
              alt={borrow.book.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h5 className="text-lg font-semibold text-gray-900">{borrow.book.name}</h5>
              <p className="text-sm text-gray-600 mt-2">{borrow.book.synopsis}</p>
            </div>
          </div>
        );
      })}
    </>
  );
};


export default function MyBooks() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const menuItemsUser = [
    { title: "Home", link: "/home", img: "/public/open-book.svg" },
    { title: "My Books", link: "/mybook", img: "/public/user.svg" },
  ];

  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      navigate("/login");
      return
    }

    if (role != "user") {
      navigate("/dashboard")
      return
    }

    const fetchBorrowedBooks = async () => {
      const response = await axios.get(`${API_URL}/borrow/list`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBorrowedBooks(response.data.data || []);
    };

    fetchBorrowedBooks();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar menuItems={menuItemsUser} />

      <div className="flex-1 pl-72 p-6">
        <h2 className="text-3xl font-semibold text-black">My Borrowed Books</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {
            borrowedBooks.length === 0 ? (
              <p>No borrowed books found.</p>
            ) : (
              <CardBookBaru books={borrowedBooks} />
            )
          }
        </div>
      </div>
    </div>
  );
}  
