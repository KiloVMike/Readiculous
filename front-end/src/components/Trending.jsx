import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Trending() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getallbooks`);
                console.log("Fetched Data:", response.data);
                setBooks(response.data.data);
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        };
        fetchBooks();
    }, []);

    return (
        <div className=' p-12 my-12 mx-auto w-full  bg-amber-50 border-green-700 border-4 rounded-2xl relative '>
           
            <p className='relative text-5xl font-bold text-gray-900 tracking-wide mb-10 text-center'>Trending Books</p>
            <div className='relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 p-8 justify-center'>
                {books.length > 0 ? (
                    books.slice(0, 4).map((book) => (
                        <Link to={`/getdetails/${book._id}`} key={book._id} className='block'>
                            <div className='relative group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition w-80 h-auto mx-auto border border-gray-300 transform hover:-translate-y-2 duration-300 flex flex-col items-center backdrop-blur-md'>
                <img src={book.url} alt={book.title} className='w-full h-auto max-h-80 object-contain rounded-lg shadow-md' />
                <div className='mt-5 text-center w-full'>
                  <p className='text-gray-900 text-xl font-semibold truncate'>{book.title}</p>
                  <p className='text-gray-600 text-lg italic'>By: <span className='font-medium'>{book.author}</span></p>
                  <p className='text-blue-700 text-xl font-semibold uppercase'>{book.genre}</p>
                  <p className='text-green-700 text-2xl font-bold mt-2'>₹{book.price}</p>
                </div>
              </div>
                        </Link>
                    ))
                ) : (
                    <p className='text-gray-700 text-center text-lg'>Loading...</p>
                )}
            </div>
        </div>
    ); 
}

export default Trending;

