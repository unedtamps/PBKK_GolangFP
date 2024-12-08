import React, { useState } from "react";
import { Textarea } from "@chakra-ui/react";
import { API_URL } from "../utils/constans";

export const EditBook = ({ id, bookname, pdf_link, sysnopsis, on_cancel }) => {
  const [name, setName] = useState(bookname);
  const [pdfLink, setPdfLink] = useState(pdf_link);
  const [synopsis, setSynopsis] = useState(sysnopsis);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/book/edit`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ "id": id, "name": name, "pdf_url": pdfLink, "sysnopsis": synopsis }),
      });

      if (!response.ok) {
        throw new Error("Failed to update the book");
      }

      alert("Book updated successfully!");
      on_cancel(); // Close the edit form
    } catch (error) {
      console.error(error.message);
      alert("Error updating the book.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-xl bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Edit Book
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="pdf_link"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Access Link
              </label>
              <input
                type="text"
                id="pdf_link"
                name="pdf_link"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={pdfLink}
                onChange={(e) => setPdfLink(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="synopsis"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Synopsis
              </label>
              <Textarea
                id="synopsis"
                name="synopsis"
                className="border-gray-300 rounded-lg"
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              disabled={loading}
            >
              {loading ? "Updating..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={on_cancel}
              className="w-full mt-2 text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-500 dark:hover:bg-gray-600 dark:focus:ring-gray-800"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
