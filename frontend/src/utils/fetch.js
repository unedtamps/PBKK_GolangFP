import axios from "axios";

export const fetch = {
  fetchAllBooks: async (setAllBooks) => {
    try {
      const response = await axios.get("http://localhost:8081/book/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAllBooks(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch all books", error);
      alert("Failed to fetch all books. Please try again later.");
    }
  },

  fetchAllAccounts: async (setAllAccounts) => {
    try {
      const response = await axios.get("http://localhost:8081/account/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAllAccounts(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch all accounts", error);
      alert(error);
    }
  },

  fetchAllBorrows: async (setAllBorrows) => {
    try {
      const response = await axios.get("http://localhost:8081/borrow/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAllBorrows(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch all borrows", error);
      alert("Failed to fetch all borrows. Please try again later.");
    }
  },
};
