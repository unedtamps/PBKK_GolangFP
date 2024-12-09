import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import CardBook from "../../components/CardBook";
import { API_URL } from "../../utils/constans";
import { fetch } from "../../utils/fetch";
import { LuSearch } from "react-icons/lu"
import { IconButton } from "@chakra-ui/react"
import Sidebar from "../../components/Sidebar";
import { FloatingAlert } from "../../components/FloatAlert";


const BookDetailSidebar = ({ book, onClose, borrowBook }) => {
  if (!book) return null;

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
          src={`${API_URL}${book.picture_url}` || "/default-book-image.jpg"}
          alt={book.name}
          className="w-full h-64 object-cover mb-4"
        />
        <h2 className="text-xl font-bold mb-2">{book.name}</h2>
        <p>
          <strong>Genre:</strong> {book.genre.name}
        </p>
        <p>
          <strong>Author:</strong> {book.author.name}
        </p>
        <p>
          <strong>Synopsis:</strong> {book.synopsis}
        </p>
        <button
          className="w-full mt-6 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => borrowBook(book.id)}
        >
          Borrow
        </button>
      </div>
    </div>
  );
};

export default function BookListUser() {
  const [allBooks, setAllBooks] = useState([]);
  const [bookName, setBookName] = useState()
  const navigate = useNavigate();
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState("")
  const [title, setTitle] = useState("")
  const [selectedBook, setSelectedBook] = useState(null);
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
    fetch.fetchAllBooks(setAllBooks);
  }, [navigate]);

  const menuItemsUser = [
    { title: "Home", link: "/home", img: "/public/home.svg" },
    { title: "Discover", link: "/allbook", img: "/public/open-book.svg" },
    { title: "My Books", link: "/mybook", img: "/public/user.svg" },
  ];

  const borrowBook = async (bookId) => {
    try {
      const response = await axios.post(
        `${API_URL}/borrow/${bookId}`,
        { bookId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setMessage("Book borrowed successfully. Check your email for the PDF link.");
        setStatus("success")
        setTitle("Borrowing Book")
      }
    } catch (error) {
      setMessage(error.response.data.message)
      setStatus("error")
      setTitle(error.message)
    }
  };

  const searchBook = async () => {
    if (bookName === "") {
      fetch.fetchAllBooks(setAllBooks)
      return
    }
    const response = await axios.get(`${API_URL}/book/name/${bookName}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
    setAllBooks(response.data.data || null)
  }

  const handleChange = async (event) => {
    const query = event.target.value
    setBookName(query)
    searchBook()
  }

  return (
<div>
    <Sidebar menuItems={menuItemsUser} />

        {message && (
          <FloatingAlert
            message={message}
            status={status}
            title={title}
            onClose={() => { setMessage(""); setStatus(""); setTitle("") }} // Reset error message
          />
        )}
  
    <div className="bg-white">
      <h1 className="font-sans font-semibold text-2xl pl-72 p-6">Discover All of Our Book !!</h1>
    </div>
  
    <div className="bg-gray-200 pl-64 ml-5 py-5">
        <IconButton className="bg-blue-600 ml-4 mb-2" aria-label="Search database">
            <LuSearch />
        </IconButton>
        <TextField size="small" id="outlined-basic" label="Enter Search Book" variant="outlined" onKeyDown={handleChange} />
      <div className="rounded-lg bg-white mx-3 mr-6 mt-3 mb-5 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 py-5 my-3 mx-5">
          <CardBook books={allBooks} borrowBook={borrowBook} onDetailClick={(book) => setSelectedBook(book)} />
        </div>
      </div>
    </div>
    {selectedBook && (
        <BookDetailSidebar
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          borrowBook={borrowBook}
        />
      )}
  </div>
  );
}
          