import React from "react";

const CardBook = ({ books, borrowBook }) => {
  return (
    <>
      {books.map((book) => (
        <div
          key={book.id}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <img
            src={book.picture_url || "/default-book-image.jpg"}
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

export default CardBook;