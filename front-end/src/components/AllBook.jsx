import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from './Loader';
import { Link } from 'react-router-dom';

const AllBook = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    const headers = {
        id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    const fetchBooks = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getallbooks`, { headers });
            setBooks(response.data.data);
        } catch (error) {
            toast.error("Failed to fetch books. Please check the server.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const deleteBook = async (bookId) => {
        if (!window.confirm("Are you sure you want to delete this book?")) return;
        try {
            await axios.delete(`${process.env.REACT_APP_BASE_URL}/deletebook/${bookId}`, { headers });
            toast.success("Book deleted successfully");
            fetchBooks();
        } catch (error) {
            toast.error("Failed to delete book. Please try again.");
        }
    };

    return (
        <div className="bg-green-100 min-h-screen p-6">
            <p className="text-3xl font-bold text-gray-900 mb-6 text-center">All Books</p>
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />

            <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
                    <thead className="bg-gradient-to-r from-green-400 to-blue-500 text-white text-sm uppercase">
                        <tr className="text-left">
                            <th className="p-3 text-center">Sr.</th>
                            <th className="p-3">Image</th>
                            <th className="p-3 text-left">Title</th>
                            <th className="p-3 text-left">Author</th>
                            <th className="p-3 text-center">Genre</th>
                            <th className="p-3 text-center">Price</th>
                            <th className="p-3 text-center">Language</th> {/* Added Language column */}
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="8" className="p-6 text-center">
                                    <Loader />
                                </td>
                            </tr>
                        ) : books.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="p-6 text-center text-gray-600">
                                    No Books Found
                                </td>
                            </tr>
                        ) : (
                            books.map((book, index) => (
                                <tr key={book._id} className="border-b last:border-none hover:bg-gray-100 transition">
                                    <td className="p-4 text-center font-medium text-black">{index + 1}</td>
                                    <td className="p-4 text-center">
                                        <img
                                            src={book.url || '/path/to/default-image.jpg'}
                                            alt={book.title}
                                            className="w-24 h-32 object-cover rounded"
                                        />
                                    </td>
                                    <td className="p-4 text-black">{book.title}</td>
                                    <td className="p-4 text-black">{book.author}</td>
                                    <td className="p-4 text-center text-black">
                                        {book.genre || "N/A"}
                                    </td>
                                    <td className="p-4 text-center font-semibold text-gray-900">
                                        ₹ {book.price}
                                    </td>
                                    <td className="p-4 text-center text-black">
                                        {book.language || "N/A"} {/* Displaying Language */}
                                    </td>
                                    <td className="p-4 text-center space-x-4"> {/* Increased spacing between buttons */}
                                        <button
                                            className="bg-red-600 text-white px-5 py-2 rounded-full shadow-lg transition-transform transform hover:scale-105 focus:ring-4 focus:ring-red-300"
                                            onClick={() => deleteBook(book._id)}
                                        >
                                            Delete
                                        </button>
                                        <Link
                                            to={`/updatebook/${book._id}`}
                                            className="bg-blue-600 text-white px-5 py-2 rounded-full shadow-lg transition-transform transform hover:scale-105 focus:ring-4 focus:ring-blue-300"
                                        >
                                            Update
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllBook;
