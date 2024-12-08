import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import CardBook from "./CardBook";
import { API_URL } from "../utils/constans";
import { fetch } from "../utils/fetch";
import { LuSearch } from "react-icons/lu"
import { IconButton } from "@chakra-ui/react"

export default function BookListUser() {
  const [allBooks, setAllBooks] = useState([]);
  const [bookName, setBookName] = useState()
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
        `${API_URL}/borrow/${bookId}`,
        { bookId },
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

    <div className="min-h-screen bg-gray-100">
      <IconButton className="bg-slate-800" aria-label="Search database">
        <LuSearch />
      </IconButton>
      <TextField size="small" id="outlined-basic" label="Enter Search Book" variant="outlined" onKeyDown={handleChange} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <CardBook books={allBooks} borrowBook={borrowBook} setAllBooks={setAllBooks} />
      </div>
    </div>
  );
}
