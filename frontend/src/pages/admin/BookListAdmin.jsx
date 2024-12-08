import React, { useEffect, useState } from "react";
import { Table, Text, Button, IconButton, Image, Link } from "@chakra-ui/react"
import Sidebar from "../../components/Sidebar";
import { fetch } from "../../utils/fetch";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../utils/constans";
import { EditBook } from "../../components/EditBook";
import axios from "axios";
import { LuSearch } from "react-icons/lu";
import { TextField } from "@mui/material";
import { CreateBook } from "../../components/CreateBoook";

export default function BookListAdmin() {

  const [errorMessage, setErrorMessage] = useState('')
  const [bookName, setBookName] = useState()
  const [allBooks, setAllBooks] = useState([])
  const [editingBook, setEditingBook] = useState(null);
  const [crateBook, setCreateBook] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      navigate("/login");
    }
    fetch.fetchAllBooks(setAllBooks);
  }, [navigate]);


  const menuItemsUser = [
    { title: "Dashboard", link: "/dashboard", img: "/public/open-book.svg" },
    { title: "Account List", link: "/accountlist", img: "/public/user.svg" },
    { title: "Book List", link: "/booklistadmin", img: "/public/book.svg" },
    { title: "Borrow List", link: "/borrowlist", img: "/public/borrow.svg" },
  ];

  const handleEdit = (book) => {
    setCreateBook(null)
    setEditingBook(book);
  };

  const handleCancelEdit = () => {
    fetch.fetchAllBooks(setAllBooks)
    setEditingBook(null);
  };

  const handleCreate = () => {
    setEditingBook(null)
    setCreateBook("true");
  };

  const handleCancelCreate = () => {
    fetch.fetchAllBooks(setAllBooks)
    setCreateBook(null);
  };

  const DeleteBook = async (id) => {
    try {
      await axios.delete(`${API_URL}/book/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetch.fetchAllBooks(setAllBooks)
    } catch (error) {
      alert(error)
    }
  }

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


        {editingBook && (
          <EditBook id={editingBook.id} pdf_link={editingBook.pdf_url} sysnopsis={editingBook.synopsis} bookname={editingBook.name} on_cancel={handleCancelEdit} />
        )}

        {crateBook && (
          <CreateBook on_cancel={handleCancelCreate} />
        )}

        <Text className="text-2xl font-bold mb-2" >Book List</Text>

        <div className="mb-4">
          <IconButton className="bg-slate-800" aria-label="Search database">
            <LuSearch />
          </IconButton>
          <TextField size="small" id="outlined-basic" label="Enter Search Book" onKeyDown={handleChange} variant="outlined" />
        </div>

        <Button colorScheme="blue" className="bg-yellow-400 rounded-lg px-8 mb-2 " onClick={() => handleCreate()}>Create</Button>

        <Table.Root size="sm" striped>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Name</Table.ColumnHeader>
              <Table.ColumnHeader>Author</Table.ColumnHeader>
              <Table.ColumnHeader>Genre</Table.ColumnHeader>
              <Table.ColumnHeader >Action</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {allBooks.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell><Link href={`${API_URL}${item.picture_url}`}>{item.name}</Link></Table.Cell>
                <Table.Cell>{item.author.name}</Table.Cell>
                <Table.Cell>{item.genre.name}</Table.Cell>
                <Table.Cell >
                  <div className="flex justify-between">
                    <Button colorScheme="blue" className="bg-blue-400 rounded-lg px-2" onClick={() => handleEdit(item)}>Edit</Button>
                    <Button colorScheme="blue" className="bg-red-400 rounded-lg px-2" size="sm" onClick={() => DeleteBook(item.id)}>Delete</Button>
                    <Button colorScheme="blue" className="bg-green-400 rounded-lg px-2" size="sm" onClick={() => navigate(`/editbook/${item.id}`)}>Access</Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>

      </div>
    </div>
  );
};
