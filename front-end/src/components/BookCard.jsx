import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const BookCard = (props) => {
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const removeFav = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/removefav`,
        { bookid: props.data._id },
        { headers }
      );
      toast.success(response.data.message, {
        theme: "dark",
        position: "top-right",
        autoClose: 3000,
      });
      alert(response.data.message);
      props.update();
    } catch (error) {
      toast.error("Failed to remove favorite 📚", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Link to={`/getdetails/${props.data._id}`} className="w-80">
        <div className="relative group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition w-80 h-auto border border-gray-300 transform hover:-translate-y-2 duration-300 flex flex-col items-center backdrop-blur-md">
          <img src={props.data.url} alt={props.data.title} className="w-full h-auto max-h-80 object-contain rounded-lg shadow-md" />
          <div className="mt-5 text-center w-full">
            <p className="text-gray-900 text-xl font-semibold truncate">{props.data.title}</p>
            <p className="text-gray-600 text-lg italic">
              By: <span className="font-medium">{props.data.author}</span>
            </p>
            <p className="text-blue-700 text-lg font-bold uppercase mt-2">
              {props.data.genre}
            </p>
            <p className="text-green-700 text-2xl font-bold mt-2">₹{props.data.price}</p>
          </div>
        </div>
      </Link>

      {props.fav && (
        <button
          onClick={removeFav}
           className="mt-4 w-80 rounded-lg px-4 py-3 bg-red-500 text-white font-semibold text-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-red-600"
        >
          Remove
        </button>
      )}
    </div>
  );
};

export default BookCard;
