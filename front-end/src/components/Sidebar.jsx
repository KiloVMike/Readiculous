import React from 'react';
import { FaArrowRightFromBracket } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { changeRole, logout } from '../store/auth';

const Sidebar = (props) => {
  const role = useSelector((state) => state.auth.role);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutbtn = () => {
    dispatch(logout());
    dispatch(changeRole());
    localStorage.clear("id");
    localStorage.clear("token");
    localStorage.clear("role");
    navigate("/");
  };

  return (
    <>
      <div className='bg-green-300 py-6 px-6 rounded-xl shadow-lg flex flex-col items-center justify-between h-[85vh] w-64 sm:w-80 transition-all duration-500'>
        {/* User Info */}
        <div className='flex flex-col items-center'>
          <img src={props.data.avatar} alt="User Avatar" className='h-16 w-16 rounded-full border-4 border-white shadow-md' />
          <p className='mt-4 text-4xl sm:text-4xl text-gray-900 font-bold'>{props.data.username}</p>
          <p className='mt-1 text-2xl text-gray-700'>{props.data.email}</p>
          <hr className='mt-4 w-full border-gray-600' />
        </div>

        {/* Navigation Links */}
<div className='flex flex-col w-full space-y-3'>
  {role === "user" && (
    <Link to="/profile" className='text-gray-900 font-medium text-lg py-3 w-full text-center rounded-lg hover:bg-green-400 transition-all'>Favourites</Link>
  )}
  {role === "user" && (
    <Link to="/profile/orderhistory" className='text-gray-900 font-medium text-lg py-3 w-full text-center rounded-lg hover:bg-green-400 transition-all'>Order History</Link>
  )}
  {role === "admin" && (
    <Link to="/profile/addbooks" className='text-gray-900 font-medium text-lg py-3 w-full text-center rounded-lg hover:bg-green-400 transition-all'>Add Book</Link>
  )}
  {role === "admin" && (
    <Link to="/profile/allbook" className='text-gray-900 font-medium text-lg py-3 w-full text-center rounded-lg hover:bg-green-400 transition-all'>All Books</Link>
  )}
  {role === "admin" && (
    <Link to="/profile" className='text-gray-900 font-medium text-lg py-3 w-full text-center rounded-lg hover:bg-green-400 transition-all'>All Orders</Link>
  )}
  {role === "admin" && (
    <Link to="/profile/allusers" className='text-gray-900 font-medium text-lg py-3 w-full text-center rounded-lg hover:bg-green-400 transition-all'>All Users</Link>
  )}
  <Link to="/profile/setting" className='text-gray-900 font-medium text-lg py-3 w-full text-center rounded-lg hover:bg-green-400 transition-all'>Setting</Link>
</div>

        {/* Logout Button */}
        <button className='bg-blue-700 text-white font-semibold flex items-center justify-center w-full py-3 rounded-lg hover:bg-red-600 hover:scale-105 transition-all duration-300 shadow-md mt-2' onClick={logoutbtn}>
          Logout <FaArrowRightFromBracket className='ml-3' />
        </button>
      </div>
    </>
  );
};

export default Sidebar;
