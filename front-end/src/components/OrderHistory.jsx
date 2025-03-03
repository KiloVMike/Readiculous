import React, { useEffect, useState } from 'react';
import Loader from './Loader';
import axios from 'axios';

const OrderHistory = () => {
  const [orderhistory, setOrderHistory] = useState();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const fetch = async () => {
    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/orderhistory`, { headers });
    setOrderHistory(response.data.data);
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div className="bg-green-200 min-h-screen py-8 px-6 flex flex-col items-center">
      {/* Loader */}
      {!orderhistory && (
        <div className="w-full h-screen flex items-center justify-center">
          <Loader />
        </div>
      )}

      {/* Title */}
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8">📚 My Order History</h1>

      {/* Order Table Container */}
      <div className="overflow-x-auto w-full max-w-6xl bg-white/70 backdrop-blur-lg shadow-lg rounded-lg p-4 border border-gray-300">
        <table className="w-full border-collapse">
          {/* Table Header */}
          <thead>
            <tr className="bg-amber-100 text-gray-900 text-sm sm:text-base font-semibold uppercase tracking-wide border-b border-gray-400">
              <th className="px-4 py-3 text-left">Sr No.</th>
              <th className="px-4 py-3 text-left">Book</th>
              <th className="px-4 py-3 text-left hidden sm:table-cell">Description</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Mode</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {orderhistory && orderhistory.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-600 text-lg italic">
                  No orders found 🚫
                </td>
              </tr>
            ) : (
              orderhistory?.map((item, index) => (
                <tr
                  key={index}
                  className={`text-gray-800 text-sm sm:text-base border-b border-gray-300 ${
                    index % 2 === 0 ? 'bg-green-100/50' : 'bg-green-50/50'
                  } hover:bg-green-200 transition-all`}
                >
                  {item.book ? (
                    <>
                      <td className="px-4 py-4 font-medium">{index + 1}</td>
                      <td className="px-4 py-4 font-semibold">{item.book.title}</td>
                      <td className="px-4 py-4 hidden sm:table-cell">{item.book.desc.slice(0, 50)}...</td>
                      <td className="px-4 py-4 font-bold text-green-700">₹ {item.book.price}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
                            item.status === 'delivered' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-900">COD</td>
                    </>
                  ) : (
                    <td colSpan="6" className="px-4 py-4 text-center text-gray-500 italic">
                      🚫 Book Deleted - Data Not Found
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderHistory;
