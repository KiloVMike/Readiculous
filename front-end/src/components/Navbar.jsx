     
import React, { useState, useEffect } from 'react';
import logo from '../asset/logo.png';
import { FiMenu } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { cartCount } from '../store/cart';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineHeart, HiOutlineShoppingBag } from "react-icons/hi2";

// Custom hook for debouncing
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const currentUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const cartcount = useSelector((state) => state.cart.cart);
  const [books, setBooks] = useState([]); // All books data

  const debouncedSearchQuery = useDebounce(searchQuery, 500); // debounce after 500ms

  // Sidebar toggle function
  const Sidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  // Fetch cart count
  const fetch = async () => {
    try {
      const cartValue = await axios.get(`${process.env.REACT_APP_BASE_URL}/getuserinfo`, { headers });
      dispatch(cartCount(cartValue.data.cart.length));
    } catch (error) {
      console.log("Cart not found, please login!");
    }
  };

  // Fetch all books
  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getallbooks`);
      setBooks(response.data.data);  // Set all books data
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // Run fetchBooks on component mount
  useEffect(() => {
    fetch();
    fetchBooks();
  }, []);

  // Handle search input and filter books based on the query
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  // Update search results whenever the debounced query changes
  useEffect(() => {
    if (debouncedSearchQuery) {
      const filteredResults = books.filter(book =>
        book.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchQuery]);

  // Function to clear search results and input when a result is clicked
  const handleSearchResultClick = () => {
    setSearchQuery(''); // Clear search query
    setSearchResults([]); // Clear search results
  };

  return (
    <div className='sticky top-0 left-0 w-full bg-white/50 backdrop-blur-md shadow-md py-6 px-8 flex items-center justify-between z-50 border-b-2 border-green-300'>
      <Link to='/'>
        <div className="flex items-center space-x-3">
          <img src={logo} alt="logo" className="h-16" />
          <h1 className='text-3xl font-bold text-[#2F4F2F] tracking-wide'>Readiculous</h1>
        </div>
      </Link>

      {/* Search Panel - Centered */}
      <div className="flex-1 flex justify-center">
        <div className="relative w-1/2 max-w-lg">
          <input
            type="text"
            className="w-full py-3 px-5 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 shadow-md hover:ring-2 hover:ring-green-600"
            placeholder="Search for books..."
            value={searchQuery}
            onChange={handleSearch}
          />
          {searchQuery && searchResults.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white border border-gray-300 mt-2 rounded-lg shadow-md max-h-60 overflow-y-auto z-10">
              {searchResults.map((book) => (
                <Link
                  key={book._id}
                  to={`/getdetails/${book._id}`}
                  onClick={handleSearchResultClick} // Clear search on click
                  className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {/* Left Side - Book Image */}
                  <div className="flex items-center">
                    <img
                      src={book.url || "https://via.placeholder.com/50"}
                      alt={book.title}
                      className="w-16 h-20 object-cover rounded-lg mr-4"
                    />
                    <div className="flex-1">
                      {/* Book Title - More prominent */}
                      <div className="font-bold text-xl text-gray-900">{book.title}</div>

                      {/* Author - Subtle and smaller */}
                      <div className="text-sm text-gray-500">{book.author}</div>
                    </div>
                  </div>

                  {/* Right Side - Genre with different color */}
                  <div className="text-sm text-green-600 font-semibold">
                    {book.genre}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center">
        <ul className="flex gap-10 items-center text-xl font-semibold text-gray-800">
          <li className="relative group">
            <Link to="/" className="transition-all duration-300 text-gray-800 font-extrabold tracking-wide group-hover:text-green-800">
              Home
              <span className="block h-[3px] w-0 bg-green-700 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </li>
          <li className="relative group">
            <Link to="/allbooks" className="transition-all duration-300 text-gray-800 font-extrabold tracking-wide group-hover:text-green-800">
              All Books
              <span className="block h-[3px] w-0 bg-green-700 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </li>
          <li className="relative group">
            <Link to="/aboutus" className="transition-all duration-300 text-gray-800 font-extrabold tracking-wide group-hover:text-green-800">
              About Us
              <span className="block h-[3px] w-0 bg-green-700 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </li>
          {isLoggedIn && (
            <>
              <li className='hover:text-green-600 transition-all duration-300 flex items-center'>
  <Link to='/favourites'>
    <HiOutlineHeart 
      className='text-red-500 text-3xl hover:text-red-600 transition-colors duration-300 hover:scale-110 transition-transform duration-300'
      style={{ fill: 'currentColor' }} // Ensure fill property changes with the text color
    />
  </Link>
</li>
              <li className='hover:text-green-600 transition-all duration-300 flex items-center relative'>
                <Link to='/cart'>
                  <HiOutlineShoppingBag className='text-3xl hover:text-blue-600 hover:scale-110 transition-transform duration-300' />
                </Link>
                {cartcount > 0 && (
                  <p className='absolute -top-2 -right-2 bg-red-500 text-white text-sm rounded-full px-2 py-1'>{cartcount}</p>
                )}
              </li>
            </>
          )}
        </ul>
        {isLoggedIn ? (
          <Link to="/profile" className="ml-10 flex items-center">
          <img
  className="rounded-full h-12 w-12 object-cover border-2 border-green-500 hover:border-green-700 transition duration-300"
  src={
    currentUser?.avatar && currentUser.avatar.trim() !== ""
      ? currentUser.avatar
      : "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
  }
  onError={(e) => (e.target.src = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png")}
  alt="profile"
/>

            <span className="ml-3 text-lg font-semibold">{currentUser?.username}</span>
          </Link>
        ) : (
          <Link to="/login" className="ml-10">
            <button className="bg-pink-500 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 text-lg">
              Log In
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;





