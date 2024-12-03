import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from "../components/Sidebar";

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
                src={borrow.book.picture_url || "/default-book-image.jpg"}
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
      { title: "Dashboard", link: "/dashboarduser", img: "/public/vite.svg" },
      { title: "Daftar Buku", link: "/booklistuser", img: "/public/vite.svg" },
      { title: "My Books", link: "/mybook", img: "/public/vite.svg" },
    ];
  
    useEffect(() => {
      const fetchBorrowedBooks = async () => {
        try {
          const response = await axios.get("http://localhost:8081/borrow/list", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          setBorrowedBooks(response.data.data || []);
        } catch (error) {
          console.error("Failed to fetch borrowed books", error);
          alert("Failed to fetch borrowed books.");
        }
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