import React, { useState, useEffect } from 'react';
import logo from '../asset/logo.png';
import { FiMenu } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { cartCount } from '../store/cart';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineHeart, HiOutlineShoppingBag } from "react-icons/hi2";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const currentUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const cartcount = useSelector((state) => state.cart.cart);

  const Sidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const fetch = async () => {
    try {
      const cartValue = await axios.get(`${process.env.REACT_APP_BASE_URL}/getuserinfo`, { headers });
      dispatch(cartCount(cartValue.data.cart.length));
    } catch (error) {
      console.log("Cart not found, please login!");
    }
  };
  
  useEffect(() => {
    fetch();
  }, []);

  return (
    <>
      <div className='sticky fixed top-0 left-0 w-full bg-white/50 backdrop-blur-md shadow-md py-6 px-8 flex items-center justify-between z-50 border-b-2 border-green-300'>
        <Link to='/'>
          <div className="flex items-center space-x-3">
            <img src={logo} alt="logo" className="h-16" />
            <h1 className='text-3xl font-bold text-[#2F4F2F] tracking-wide'>Readiculous</h1>
          </div>
        </Link>
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
            {isLoggedIn && (
              <>
                <li className='hover:text-green-600 transition-all duration-300 flex items-center'>
                  <Link to='/favourites'>
                    <HiOutlineHeart className='text-3xl hover:text-red-600 transition-colors duration-300 hover:scale-110 transition-transform duration-300' />
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
          <Link to="/profile" className="ml-10">
            {isLoggedIn ? (
              <img
              className="rounded-full h-12 w-12 object-cover border-2 border-green-500 hover:border-green-700 transition duration-300"
              src={currentUser?.avatar || "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"}
              onError={(e) => (e.target.src = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png")}
              alt="profile"
            />
            
            ) : (
              <button className="bg-green-500 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 text-lg">
                Log In
              </button>
            )}
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
