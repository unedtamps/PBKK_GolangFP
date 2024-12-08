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

export default function Home() {
  const [allBooks, setAllBooks] = useState([]);
  const [bookName, setBookName] = useState()
  const navigate = useNavigate();
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState("")
  const [title, setTitle] = useState("")
  const username = localStorage.getItem("username");
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
    { title: "Home", link: "/home", img: "/public/open-book.svg" },
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

    <div className="flex min-h-screen bg-gray-100">
      <Sidebar menuItems={menuItemsUser} />
      <div className="flex-1 pl-72 p-6">

        {message && (
          <FloatingAlert
            message={message}
            status={status}
            title={title}
            onClose={() => { setMessage(""); setStatus(""); setTitle("") }} // Reset error message
          />
        )}
        <h2 className="text-3xl font-semibold text-black">
          Welcome Back {username}!
        </h2>

        <h2 className="text-xl py-6 font-semibold text-black">
          Check All of Our Book !!
        </h2>
        <div className="min-h-screen bg-gray-100">
          <IconButton className="bg-slate-800" aria-label="Search database">
            <LuSearch />
          </IconButton>
          <TextField size="small" id="outlined-basic" label="Enter Search Book" variant="outlined" onKeyDown={handleChange} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <CardBook books={allBooks} borrowBook={borrowBook} setAllBooks={setAllBooks} />
          </div>
        </div>
      </div>
    </div>
  );
}
