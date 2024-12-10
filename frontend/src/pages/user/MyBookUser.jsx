import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from "../../components/Sidebar";
import { API_URL } from '../../utils/constans';
import { useNavigate } from 'react-router-dom';
import { Text, Badge } from "@chakra-ui/react"

const randomPalate = () => {
  const colorPalettes = ["green", "blue", "red", "yellow", "purple"];
  const randomColorPalette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
  return randomColorPalette
}

const CardBook = ({ books, onDetailClick }) => {
  return (
    <>
      {books.map((borrow) => (
        <div
          key={borrow.book.id}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <img
            src={`${API_URL}${borrow.book.picture_url}` || "/default-book-image.jpg"}
            alt={borrow.book.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h5 className="text-lg font-semibold text-gray-900 truncate">{borrow.book.name}</h5>
            <Badge className=" mt-2 flex justify-center w-13" colorPalette={randomPalate()}>{borrow.book.genre.name}</Badge>
            <Text className="mt-2 italic">{borrow.book.author.name}</Text>

            <button
              className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => onDetailClick(borrow)}
            >
              See detail
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

const BookDetailSidebar = ({ borrow, onClose}) => {
  if (!borrow) return null;

  const handleOutsideClick = (event) => {
    const sidebarElement = document.querySelector('.fixed.top-0.right-0');
    if (sidebarElement && !sidebarElement.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div className="fixed top-0 right-0 w-1/5 h-full bg-white shadow-lg z-50">
      <div className="p-6">
        <img
          src={`${API_URL}${borrow.book.picture_url}` || "/default-book-image.jpg"}
          alt={borrow.book.name}
          className="w-full h-64 object-cover mb-4"
        />
        <h2 className="text-xl font-bold mb-2">{borrow.book.name}</h2>
        <p>
          <strong>Genre:</strong> {borrow.book.genre.name}
        </p>
        <p>
          <strong>Author:</strong> {borrow.book.author.name}
        </p>
        <p>
          <strong>Synopsis:</strong> {borrow.book.synopsis}
        </p>
      </div>
    </div>
  );
};

export default function MyBooks() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const menuItemsUser = [
    { title: "Home", link: "/home", img: "/public/home.svg" },
    { title: "Discover", link: "/allbook", img: "/public/open-book.svg" },
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
      console.log(response.data.data)
    };

    fetchBorrowedBooks();
  }, []);

  return (
    <div>
    <Sidebar menuItems={menuItemsUser} />
  
    <div className="bg-white">
      <h1 className="font-sans font-semibold text-2xl pl-72 p-6">My Books</h1>
    </div>
  
    <div className="bg-gray-200 pl-64 ml-5 py-5">
      <div className="rounded-lg bg-white mx-3 mr-6 mt-3 relative mb-52">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 py-5 my-3 mx-5">
          {
            borrowedBooks.length === 0 ? (
              <p className='text-2xl'>No borrowed books found.</p>
            ) : (
              <CardBook books={borrowedBooks} onDetailClick={(borrow) => setSelectedBook(borrow)} />
            )
          }
        </div>
      </div>
    </div>
    {selectedBook && (
        <BookDetailSidebar
          borrow={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
  </div>
  );
}  