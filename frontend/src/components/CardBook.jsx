import React from "react";
import { API_URL } from "../utils/constans";
import { Card, Image, Text, Badge, Button } from "@chakra-ui/react"
import axios from "axios";

const randomPalate = () => {
  const colorPalettes = ["green", "blue", "red", "yellow", "purple"];
  const randomColorPalette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
  return randomColorPalette
}

const searchByGenre = async (genreId, setAllBooks) => {
  try {
    const response = await axios.get(`${API_URL}/book/genre/${genreId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
    setAllBooks(response.data.data)
  } catch (error) {
    console.log("Failed to search book by genre", error)
  }
}

const searchByAuthor = async (authorId, setAllBooks) => {
  try {
    const response = await axios.get(`${API_URL}/book/author/${authorId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
    setAllBooks(response.data.data)
  } catch (error) {
    console.log("Failed to search book by genre", error)
  }
}

const CardBook = ({ books, borrowBook, onDetailClick, setAllBooks }) => {
  return (
    <>
      {books.map((book) => (
        <div
          key={book.id}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <img
            src={`${API_URL}${book.picture_url}` || "/default-book-image.jpg"}
            alt={book.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h5 className="text-lg font-semibold text-gray-900 truncate">{book.name}</h5>
            <a className="hover:underline cursor-pointer" onClick={() => searchByGenre(book.genre.id, setAllBooks)}><Badge className=" mt-2 flex justify-center w-13" colorPalette={randomPalate()}>{book.genre.name}</Badge></a>
            <a className="hover:underline cursor-pointer" onClick={() => searchByAuthor(book.author.id, setAllBooks)} ><Text className="mt-2 italic">{book.author.name}</Text></a>
            <button
              className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => borrowBook(book)}
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

export default CardBook;
