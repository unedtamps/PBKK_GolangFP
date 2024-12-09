import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table, Box, HStack, Input, Button
} from "@chakra-ui/react";
import Sidebar from "../../components/Sidebar";
import { API_URL } from "../../utils/constans";

export default function BorrowHistory() {
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
    <div className="flex min-h-screen bg-gray-100">
        <Sidebar menuItems={menuItemsUser} />
        <div className="flex-1 pl-72 p-6">
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
                <Button colorScheme="blue" className="bg-blue-600 rounded-lg px-8" onClick={handleFilter}>
                Filter
                </Button>
            </HStack>

            <Table.Root variant="striped" colorScheme="gray">
                <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader>Name</Table.ColumnHeader>
                    <Table.ColumnHeader>Author</Table.ColumnHeader>
                    <Table.ColumnHeader>Genre</Table.ColumnHeader>
                    <Table.ColumnHeader>Action</Table.ColumnHeader>
                </Table.Row>
                </Table.Header>
                <Table.Body>
                {borrowHistory.map((item) => (
                    <Table.Row key={item.id}>
                    <Table.Cell>{item.account.username}</Table.Cell>
                    <Table.Cell>{item.book.author.name}</Table.Cell>
                    <Table.Cell>{item.book.genre.name}</Table.Cell>
                    <Table.Cell>
                        <HStack spacing={2}>
                        <Button
                            colorScheme="blue"
                            size="sm"
                            onClick={() => console.log("Edit clicked", item)}
                        >
                            Edit
                        </Button>
                        <Button
                            colorScheme="red"
                            size="sm"
                            onClick={() => console.log("Delete clicked", item.id)}
                        >
                            Delete
                        </Button>
                        <a href={item.book.pdf_url} target="_blank" rel="noopener noreferrer">
                            <Button colorScheme="green" size="sm">
                            Access
                            </Button>
                        </a>
                        </HStack>
                    </Table.Cell>
                    </Table.Row>
                ))}
                </Table.Body>
            </Table.Root>
            </Box>
        </div>
    </div>
  );
}