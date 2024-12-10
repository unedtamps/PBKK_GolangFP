import React, { useEffect, useState } from "react";
import { Table, Button, IconButton, Link } from "@chakra-ui/react"
import Sidebar from "../../components/Sidebar";
import { fetch } from "../../utils/fetch";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../utils/constans";
import { EditBook } from "../../components/EditBook";
import axios from "axios";
import { LuSearch } from "react-icons/lu";
import { TextField } from "@mui/material";
import { CreateBook } from "../../components/CreateBoook";
import { FloatingAlert } from "../../components/FloatAlert";

export default function BookListAdmin() {

  const [message, setMessage] = useState("")
  const [status, setStatus] = useState("")
  const [title, setTitle] = useState("")
  const [bookName, setBookName] = useState()
  const [allBooks, setAllBooks] = useState([])
  const [editingBook, setEditingBook] = useState(null);
  const [crateBook, setCreateBook] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      navigate("/login");
      return
    }
    if (role != "admin") {
      navigate("/home");
      return
    }
    fetch.fetchAllBooks(setAllBooks);
  }, [navigate]);


  const menuItemsUser = [
    { title: "Dashboard", link: "/dashboard", img: "/public/open-book.svg" },
    { title: "Account List", link: "/accountlist", img: "/public/user.svg" },
    { title: "Book List", link: "/booklistadmin", img: "/public/book.svg" },
    { title: "Borrow History", link: "/borrow-history", img: "/public/borrow.svg" },
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
    setEditingBook(null);
    setCreateBook(true);
  };
  

  const handleCancelCreate = () => {
    fetch.fetchAllBooks(setAllBooks);
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
      setMessage("Success Deleted Book")
      setStatus("success")
      setTitle("Deleting Book")
    } catch (error) {
      setMessage(error.response.data.message)
      setStatus("error")
      setTitle(error.message)
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
      <h1 className="font-sans font-semibold text-2xl pl-72 p-6">
          Book List
      </h1>
    </div>

    <div className="bg-gray-200 pl-64 ml-5 pr-5 pb-64 py-5">
            {editingBook && (
              <EditBook id={editingBook.id} pdf_link={editingBook.pdf_url} sysnopsis={editingBook.synopsis} bookname={editingBook.name} on_cancel={handleCancelEdit} setTitle={setTitle} setMessage={setMessage} setStatus={setStatus} />
            )}

            {crateBook && (
                <CreateBook on_cancel={handleCancelCreate} setTitle={setTitle} setMessage={setMessage} setStatus={setStatus} />
            )}

            <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <IconButton className="bg-blue-600 text-white" aria-label="Search database">
                      <LuSearch />
                    </IconButton>
                    <TextField
                      size="small"
                      id="outlined-basic"
                      label="Enter Search Book"
                      onKeyDown={handleChange}
                      variant="outlined"
                    />
                  </div>
                  <Button
                    colorScheme="blue"
                    className="bg-blue-600 rounded-lg px-8 text-white"
                    onClick={handleCreate}
                  >
                    Create
                  </Button>
                </div>

            <Table.Root striped>
              <Table.Header>
                <Table.Row bg="blue.600">
                  <Table.ColumnHeader color="white">Name</Table.ColumnHeader>
                  <Table.ColumnHeader color="white">Author</Table.ColumnHeader>
                  <Table.ColumnHeader color="white">Genre</Table.ColumnHeader>
                  <Table.ColumnHeader color="white" className="text-center">Action</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {allBooks.map((item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell><Link href={`${API_URL}${item.picture_url}`}>{item.name}</Link></Table.Cell>
                    <Table.Cell>{item.author.name}</Table.Cell>
                    <Table.Cell>{item.genre.name}</Table.Cell>
                    <Table.Cell >
                      <div className="flex justify-center items-center space-x-2">
                        <Button colorScheme="blue" className="bg-yellow-300 rounded-lg px-2" size="sm" onClick={() => handleEdit(item)}>Edit</Button>
                        <Button colorScheme="blue" className="bg-red-700 rounded-lg px-2" size="sm" onClick={() => DeleteBook(item.id)}>Delete</Button>
                        <Link href={item.pdf_url}><Button colorScheme="blue" className="bg-green-500 rounded-lg px-2" size="sm">Access</Button></Link>
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