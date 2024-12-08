import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { Table, Text, Button, IconButton } from "@chakra-ui/react"
import axios from "axios";
import { API_URL } from "../../utils/constans";
import { fetch } from "../../utils/fetch";
import { FloatingAlert } from "../../components/FloatAlert";
import { LuSearch } from "react-icons/lu";
import { TextField } from "@mui/material";



export default function AccountList() {
  const [allAccounts, setAllAccounts] = useState([]);
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState("")
  const [title, setTitle] = useState("")
  const navigate = useNavigate();

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

    fetch.fetchAllAccounts(setAllAccounts);
  }, [navigate]);

  const menuItemsUser = [
    { title: "Dashboard", link: "/dashboard", img: "/public/open-book.svg" },
    { title: "Account List", link: "/accountlist", img: "/public/user.svg" },
    { title: "Book List", link: "/booklistadmin", img: "/public/book.svg" },
    { title: "Borrow History", link: "/borrow-history", img: "/public/borrow.svg" },
  ];

  const DeleteAccount = async (id) => {
    try {
      await axios.delete(`${API_URL}/account/id/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetch.fetchAllAccounts(setAllAccounts)
      setMessage("Success Deleted Account")
      setStatus("success")
      setTitle("Deleting Account")
    } catch (error) {
      setMessage(error.response.data.message)
      setStatus("error")
      setTitle(error.message)
    }
  }

  const handleGetAccount = async (event) => {
    const response = await axios.get(`${API_URL}/account/username/${event.target.value}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (event.target.value === "") { fetch.fetchAllAccounts(setAllAccounts); return }
    setAllAccounts(response.data.data || [])
  }

  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <Sidebar menuItems={menuItemsUser} />
      <div className="flex-1 pl-72 p-2 ">

        {message && (
          <FloatingAlert
            message={message}
            status={status}
            title={title}
            onClose={() => { setMessage(""); setStatus(""); setTitle("") }} // Reset error message
          />
        )}
        <Text className="text-2xl font-bold mb-2" > Account List</Text>
        <div className="mb-4">
          <IconButton className="bg-slate-800" aria-label="Search database">
            <LuSearch />
          </IconButton>
          <TextField size="small" id="outlined-basic" label="Enter Search Account" onKeyDown={handleGetAccount} variant="outlined" />
        </div>

        <Table.Root size="md" colorPalette="" variant="line" className=" border-black border-2 rounded-lg" striped >
          <Table.Header bg="black">
            <Table.Row>
              <Table.ColumnHeader >Username</Table.ColumnHeader>
              <Table.ColumnHeader >Email</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">Action</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {allAccounts.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.username}</Table.Cell>
                <Table.Cell>{item.email}</Table.Cell>
                <Table.Cell textAlign="end"><Button onClick={() => DeleteAccount(item.id)} className="bg-red-500 rounded-lg p-1 text-white border border-black" size="sm">Delete</Button></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </div>
    </div>
  );
}
