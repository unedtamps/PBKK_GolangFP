import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table, Box, HStack, Input, Button, Link
} from "@chakra-ui/react";
import Sidebar from "../../components/Sidebar";
import { FloatingAlert } from "../../components/FloatAlert";
import { API_URL } from "../../utils/constans";


export default function BorrowHistory() {
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState("")
  const [title, setTitle] = useState("")
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchBorrowHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/borrow/filter`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params : { start_date: startDate, end_date: endDate },
      });
      setBorrowHistory(response.data.data);
    } catch (error) {
      console.error("Error fetching borrow history:", error);
    }
  };

  const handleFilter = () => {
    setBorrowHistory([]);
    fetchBorrowHistory(setBorrowHistory);
  };

  useEffect(() => {
    fetchBorrowHistory(setBorrowHistory);
  }, []);

  const menuItemsUser = [
    { title: "Dashboard", link: "/dashboard", img: "/public/open-book.svg" },
    { title: "Account List", link: "/accountlist", img: "/public/user.svg" },
    { title: "Book List", link: "/booklistadmin", img: "/public/book.svg" },
    { title: "Borrow History", link: "/borrow-history", img: "/public/borrow.svg" },
  ];

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
          Borrow List
      </h1>
    </div>

    <div className="bg-gray-200 pl-64 ml-5 pr-5 pb-64 py-5">
        <Box p={4}>
            <HStack spacing={4} mb={4}>
                <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Start Date"
                />
                <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="End Date"
                />
                <Button colorScheme="blue" className="bg-blue-600 rounded-lg px-8 text-white" onClick={handleFilter}>
                Filter
                </Button>
            </HStack>

            <Table.Root striped>
                <Table.Header>
                <Table.Row bg="blue.600">
                    <Table.ColumnHeader color="white">Username</Table.ColumnHeader>
                    <Table.ColumnHeader color="white">Book</Table.ColumnHeader>
                    <Table.ColumnHeader color="white">Author</Table.ColumnHeader>
                    <Table.ColumnHeader color="white">Genre</Table.ColumnHeader>
                    {/* <Table.ColumnHeader color="white">Date Borrowed</Table.ColumnHeader> */}
                </Table.Row>
                </Table.Header>
                <Table.Body>
                {borrowHistory.map((borrow) => (
                    <Table.Row key={borrow.id}>
                    <Table.Cell>{borrow.account.username}</Table.Cell>
                    <Table.Cell>{borrow.book.name}</Table.Cell>
                    <Table.Cell>{borrow.book.author.name}</Table.Cell>
                    <Table.Cell>{borrow.book.genre.name}</Table.Cell>
                    {/* <Table.Cell>{borrow.created_at}</Table.Cell> */}
                    </Table.Row>
                ))}
                </Table.Body>
            </Table.Root>
        </Box>
    </div>
  </div>
  );
}