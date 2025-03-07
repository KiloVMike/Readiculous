import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader.jsx';
import { GrLanguage } from 'react-icons/gr';
import { useNavigate, useParams } from 'react-router-dom';
import { FaHeart, FaEdit } from 'react-icons/fa';
import { FaCartShopping } from 'react-icons/fa6';
import { MdDelete } from 'react-icons/md';
import { useSelector, useDispatch } from 'react-redux';
import { cartCount } from '../store/cart';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

const ViewBookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const role = useSelector(state => state.auth.role);
  const dispatch = useDispatch();

  const headers = {
    id: localStorage.getItem('id'),
    authorization: `Bearer ${localStorage.getItem('token')}`,
    bookid: id,
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchBook = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getbook/${id}`);
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    };
    fetchBook();
  }, [id]);

  // Handle Add to Favorites
  const handleFav = async () => {
    if (!isLoggedIn) {
      toast.error("Please log in to add to favorites!", { position: "top-right", theme: "dark" });
      return;
    }

    try {
      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/addfav`, {}, { headers });
      toast.success(response.data.message || "Added to favorites successfully!", { position: "top-right", theme: "dark" });
    } catch (error) {
      toast.error("Failed to add to favorites. Please try again.", { position: "top-right", theme: "dark" });
    }
  };

  // Handle Add to Cart
  const handleCart = async (bookId) => {
    if (!isLoggedIn) {
      toast.error("Please log in to add to cart!", { position: "top-right", theme: "dark" });
      return;
    }

    try {
      const userId = localStorage.getItem("id");
      if (!userId) {
        throw new Error("User ID not found in local storage.");
      }

      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/addtocart`,
        { userId, bookId, quantity: 1 },
        { headers }
      );

      const cartValueResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/getuserinfo`, { headers });
      const cartValue = cartValueResponse.data;

      if (cartValue && cartValue.cart) {
        dispatch(cartCount(cartValue.cart.length));
      } else {
        throw new Error("Invalid cart data received.");
      }

      toast.success(response.data.message || "Added to cart successfully.", { position: "top-right", theme: "dark" });
    } catch (error) {
      console.error("🔴 Error adding to cart:", error);

      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.message || "Something went wrong.";
        toast.warning(errorMessage, { position: "top-right", theme: "dark" });
      } else {
        toast.error(error.message || "Failed to add to cart. Please try again.", { position: "top-right", theme: "dark" });
      }
    }
  };

  // Delete Book Logic
  const deleteBook = async () => {
    if (prompt("Type 'confirm' to delete") === 'confirm') {
      try {
        const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/deletebook/${id}`, { headers });
        toast.success(response.data.message || "Book deleted successfully!", { position: "top-right", theme: "dark" });
        navigate('/allbooks');
      } catch (error) {
        toast.error('Failed to delete book.', { position: "top-right", theme: "dark" });
      }
    } else {
      toast.info('Delete cancelled.', { position: "top-right", theme: "dark" });
    }
  };

  const updateBook = () => navigate(`/updatebook/${id}`);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className='min-h-screen bg-green-100 text-gray-900 flex flex-col items-center justify-center p-6'
    >
      {!data ? (
        <Loader />
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className='w-full max-w-screen-xl bg-green-200 rounded-lg shadow-lg p-10 grid grid-cols-1 sm:grid-cols-2 gap-12'
        >
          <div className='flex flex-col items-center w-full'>
            <img src={data.url} alt={data.title} className='h-[85vh] w-auto rounded-lg shadow-md' />
            {isLoggedIn && (
              <div className='flex space-x-6 mt-6'>
                {role === 'user' && (
                  <>
                    <button className='py-4 px-8 bg-red-500 hover:bg-red-600 rounded-lg transition flex items-center space-x-3' onClick={handleFav}>
                      <FaHeart className='text-white text-2xl' />
                      <span className='text-white font-semibold text-lg'>Add to Favorites</span>
                    </button>
                    <button 
                      className="py-4 px-8 bg-blue-500 hover:bg-blue-600 rounded-lg transition flex items-center space-x-3" 
                      onClick={() => handleCart(data._id)} // ✅ Use `data._id`
                    >
                      <FaCartShopping className="text-white text-2xl" />
                      <span className="text-white font-semibold text-lg">Add to Cart</span>
                    </button>
                  </>
                )}
                {role === 'admin' && (
                  <>
                    <button className='py-4 px-8 bg-red-700 hover:bg-red-800 rounded-lg transition flex items-center space-x-3' onClick={deleteBook}>
                      <MdDelete className='text-white text-2xl' />
                      <span className='text-white font-semibold text-lg'>Delete Book</span>
                    </button>
                    <button className='py-4 px-8 bg-yellow-500 hover:bg-yellow-600 rounded-lg transition flex items-center space-x-3' onClick={updateBook}>
                      <FaEdit className='text-white text-2xl' />
                      <span className='text-white font-semibold text-lg'>Edit Book</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <div className='flex flex-col justify-start w-full'>
            <div>
              <h1 className='text-5xl font-bold'>{data.title}</h1>
              <div className='flex items-center text-2xl mt-2 text-gray-400 uppercase tracking-wide font-semibold'>
                <span className='mr-2'>By :</span>
                <p className='text-gray-700 italic'>{data.author}</p>
                
              </div>
              <p className='text-2xl font-semibold text-blue-700 italic uppercase'>{data.genre}</p>
              <p className='flex items-center text-gray-700 mt-3 text-xl'>
                <GrLanguage className='mr-3' /> {data.language}
              </p>
              <p className='text-4xl font-semibold text-gray-900 mt-6'>₹ {data.price}</p>
              <div className='bg-green-300 p-8 rounded-lg mt-8'>
                <h2 className='text-2xl font-semibold text-gray-900'>Description</h2>
                <p className='text-gray-800 mt-3 text-lg'>{data.desc}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ViewBookDetails;
