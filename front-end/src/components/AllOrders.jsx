import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./Loader";

const AllOrders = () => {
  const [values, setValues] = useState();
  const [allorder, setallorder] = useState();
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const change = (e) => {
    const { value } = e.target;
    setValues({ status: value });
  };

  const fetch = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/allorders`,
        { headers }
      );
      setallorder(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="bg-green-100 min-h-screen p-6">
      <p className="text-3xl font-bold text-gray-900 mb-6 text-center">
        All Orders
      </p>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-green-400 to-blue-500 text-white text-sm uppercase">
            <tr className="text-left">
              <th className="p-3 text-center">Sr.</th>
              <th className="p-3">Username</th>
              <th className="p-3">Book Name</th>
              <th className="p-3 text-center">Price</th>
              <th className="p-3 text-center">Ordered On</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Update Status</th>
            </tr>
          </thead>
          <tbody>
            {!allorder && (
              <tr>
                <td colSpan="7" className="p-6 text-center">
                  <Loader />
                </td>
              </tr>
            )}

            {allorder && allorder.length === 0 && (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-600">
                  No Orders Found
                </td>
              </tr>
            )}

            {allorder &&
              allorder.map((item, index) => (
                <tr
                  key={index}
                  className="border-b last:border-none hover:bg-gray-100 transition"
                >
                  <td className="p-4 text-center font-medium text-black">
                    {index + 1}
                  </td>
                  <td
                    className={`p-4 font-medium ${
                      item.user ? "text-black" : "text-red-600"
                    }`}
                  >
                    {item.user ? item.user.username : "User Deleted"}
                  </td>
                  {item.book ? (
                    <>
                      <td className="p-4 text-black">{item.book.title}</td>
                      <td className="p-4 text-center font-semibold text-gray-900">
                        ₹ {item.book.price}
                      </td>
                      <td className="p-4 text-center text-gray-600">
                        {formatDate(item.createdAt)}
                      </td>

                      <td
                        className={`p-4 text-center font-semibold ${
                          item.status === "cancelled"
                            ? "text-red-600"
                            : item.status === "placed"
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {item.status}
                      </td>

                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <select
                            className="text-gray-900 font-normal rounded-lg p-2 border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-green-400"
                            onChange={change}
                          >
                            <option value={item.status}>{item.status}</option>
                            <option value="placed">Placed</option>
                            <option value="out for delivery">
                              Out for Delivery
                            </option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <button
                            className="bg-green-500 text-white px-4 py-1 rounded-lg transition hover:bg-green-600 focus:ring-2 focus:ring-green-400"
                            onClick={async () => {
                              const bookid = allorder[index]._id;
                              try {
                                await axios.put(
                                  `${process.env.REACT_APP_BASE_URL}/updatestatus/${bookid}`,
                                  values,
                                  { headers }
                                );
                                toast.success("Status updated successfully");
                                fetch();
                              } catch (error) {
                                toast.error("Failed to update status");
                              }
                            }}
                          >
                            Update
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <td
                      colSpan="5"
                      className="p-4 text-center text-red-600 font-medium"
                    >
                      Book Deleted - Data Not Found
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllOrders;
