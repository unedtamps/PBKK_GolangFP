import React from "react";
import { API_URL } from "../utils/constans";
import { Card, Image, Text, Badge, Button } from "@chakra-ui/react"
import axios from "axios";

const CardBook1 = ({ books, borrowBook }) => {
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
      ))}
    </>
  );
};


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

const CardBook = ({ books, borrowBook, setAllBooks }) => {
  return (
    <>
      {books.map((book) =>
        <Card.Root maxW="sm" overflow="hidden" className="bg-slate-300 p-2 sm:p-2 lg:p-3 border border-black ">
          <Image
            src={`${API_URL}${book.picture_url}` || "/default-book-image.jpg"}
            alt={book.name}
            objectFit="contain"
            maxH="300px"
          />
          <Card.Body gap="2" >
            <Card.Title className="text-black font-bold text-2xl" >{book.name}</Card.Title>
            <a className="hover:underline cursor-pointer" onClick={() => searchByGenre(book.genre.id, setAllBooks)}><Badge className=" flex justify-center w-13" colorPalette={randomPalate()}>{book.genre.name}</Badge></a>
            <Card.Description>
              <Text textStyle="sm" color="gray.500">
                {book.synopsis}
              </Text>
            </Card.Description>
            <a className="hover:underline cursor-pointer" onClick={() => searchByAuthor(book.author.id, setAllBooks)} ><Text className="font-bold text-sky-800 italic">{book.author.name}</Text></a>
          </Card.Body>
          <Card.Footer gap="2">
            <Button onClick={() => borrowBook(book.id)} size="md" variant="solid" colorPalette="green" className="bg-green-500 rounded-lg p-3 text-black">Borrow</Button>
          </Card.Footer>
        </Card.Root>
      )}
    </>
  )
}
export default CardBook;
