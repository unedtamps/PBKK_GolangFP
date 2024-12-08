import React, { useState, useEffect } from "react";
import { Textarea, Input } from "@chakra-ui/react";
import { API_URL } from "../utils/constans";
import axios from "axios";

export const CreateBook = ({ on_cancel }) => {
  const [name, setName] = useState("");
  const [pdfLink, setPdfLink] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [genreId, setGenreId] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [pictureURL, setPictureURL] = useState("");
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch genres and authors
  useEffect(() => {
    const fetchData = async () => {
      try {
        const genresResponse = await axios.get(`${API_URL}/book/genres`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        });
        const authorsResponse = await axios.get(`${API_URL}/book/authors`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        });
        setGenres(genresResponse.data.data || []);
        setAuthors(authorsResponse.data.data || []);
      } catch (error) {
        console.error("Error fetching genres/authors:", error);
      }
    };

    fetchData();
  }, []);

  // Handle picture upload
  const handleUploadPicture = async (e) => {
    const pictureFile = e.target.files[0]
    if (!pictureFile) {
      alert("Please select a picture to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", pictureFile);

    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set the appropriate content type for file uploads
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPictureURL(response.data.data.filename);
      alert("Picture uploaded successfully!");
    } catch (error) {
      console.error("Error uploading picture:", error);
      alert(error.message);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log(name, pdfLink, synopsis, genreId, authorId, pictureURL)
      await fetch(`${API_URL}/book/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name,
          pdf_url: pdfLink,
          synopsis: synopsis,
          genre_id: genreId,
          author_id: authorId,
          pic_url: pictureURL,
        }),
      });

      on_cancel();
    } catch (error) {
      console.error(error.message);
      alert("Error creating the book.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center  bg-gray-50 dark:bg-gray-900 p-4">
        <div className="w-full max-w-xl bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create Book
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Name
                </label>
                <Input
                  type="text"
                  id="name"
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
                <Input
                  type="text"
                  id="pdf_link"
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
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="genre"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Genre
                </label>
                <select
                  id="genre"
                  value={genreId}
                  onChange={(e) => setGenreId(e.target.value)}
                  className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  required
                >
                  <option value="">Select genre</option>
                  {genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="author"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Author
                </label>
                <select
                  id="author"
                  value={authorId}
                  onChange={(e) => setAuthorId(e.target.value)}
                  className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  required
                >
                  <option value="">Select author</option>
                  {authors.map((author) => (
                    <option key={author.id} value={author.id}>
                      {author.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="picture"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Upload Picture
                </label>
                <Input
                  type="file"
                  id="picture"
                  onChange={(e) => handleUploadPicture(e)}
                  required
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
    </>
  );
};
