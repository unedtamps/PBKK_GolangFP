import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../utils/constans";
import Sidebar from "../../components/Sidebar";
import { FloatingAlert } from "../../components/FloatAlert";
import { Text, Badge } from "@chakra-ui/react";

const randomPalate = () => {
  const colorPalettes = ["green", "blue", "red", "yellow", "purple"];
  const randomColorPalette =
    colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
  return randomColorPalette;
};

const CardBook = ({ books, borrowBook, onDetailClick }) => {
  return (
    <>
      {books.map((book) => (
        <div
          key={book.book_id}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <img
            src={`${API_URL}${book.picture_url}` || "/default-book-image.jpg"}
            alt={book.book_name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h5 className="text-lg font-semibold text-gray-900 truncate">
              {book.book_name}
            </h5>
            <a
              className="hover:underline cursor-pointer"
              onClick={() => searchByGenre(book.genre_id, setAllBooks)}
            >
              <Badge
                className=" mt-2 flex justify-center w-13"
                colorPalette={randomPalate()}
              >
                {book.genre}
              </Badge>
            </a>
            <a
              className="hover:underline cursor-pointer"
              onClick={() => searchByAuthor(book.author_id, setAllBooks)}
            >
              <Text className="mt-2 italic">{book.author}</Text>
            </a>
            <button
              className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => borrowBook(book.id)}
            >
              Borrow
            </button>

            <button
              className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => onDetailClick(book)}
            >
              See detail
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

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
          alt={book.book_name}
          className="w-full h-64 object-cover mb-4"
        />
        <h2 className="text-xl font-bold mb-2">{book.book_name}</h2>
        <p>
          <strong>Genre:</strong> {book.genre}
        </p>
        <p>
          <strong>Author:</strong> {book.author}
        </p>
        <p>
          <strong>Synopsis:</strong> {book.synopsis}
        </p>
        <button
          className="w-full mt-6 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => borrowBook(book.book_id)}
        >
          Borrow
        </button>
      </div>
    </div>
  );
};

export default function Home() {
  const [topBooks, setMostBorrowedBooks] = useState([]);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [title, setTitle] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const username = localStorage.getItem("username");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      navigate("/login");
      return;
    }

    if (role !== "user") {
      navigate("/dashboard");
      return;
    }

    const fetchMostBorrowedBooks = async () => {
      const response = await axios.get(`${API_URL}/borrow/getTopBooks`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMostBorrowedBooks(response.data.data || []);
    };

    fetchMostBorrowedBooks();
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
        setMessage(
          "Book borrowed successfully. Check your email for the PDF link."
        );
        setStatus("success");
        setTitle("Borrowing Book");
      }
    } catch (error) {
      setMessage(error.response.data.message);
      setStatus("error");
      setTitle(error.message);
    }
  };

  return (
    <div>
      <Sidebar menuItems={menuItemsUser} />

      {message && (
        <FloatingAlert
          message={message}
          status={status}
          title={title}
          onClose={() => {
            setMessage("");
            setStatus("");
            setTitle("");
          }}
        />
      )}

      <div className="bg-white">
        <h1 className="font-sans font-semibold text-2xl pl-72 p-6">
          Welcome Back, {username}
        </h1>
      </div>

      <div className="bg-gray-200 pl-64 ml-5 py-5">
        <div className="rounded-lg bg-white mx-3 mr-6 mt-3 mb-5 relative">
          <h1 className="font-sans text-xl ml-5 mt-3 pt-3">Recommended</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-5 my-3 mx-5">
            <CardBook
              books={topBooks}
              borrowBook={borrowBook}
              onDetailClick={(book) => setSelectedBook(book)}
            />
          </div>

          <button
            className="absolute top-0 right-0 mt-3 mr-5 bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => navigate("/allbook")}
          >
            See All
          </button>
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