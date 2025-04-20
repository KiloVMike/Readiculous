import React, { useEffect, useState } from 'react';
import Loader from './Loader';
import axios from 'axios';
import { FiDownload } from 'react-icons/fi';

const OrderHistory = () => {
  const [orderhistory, setOrderHistory] = useState();
  const [loading, setLoading] = useState(false); // Loading state for download
  const [downloadError, setDownloadError] = useState(""); // Error state for download
  const [invoices, setInvoices] = useState([]);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/orderhistory`, { headers });

        // Log the response to check if invoices are returned
        console.log('Order history:', response.data);

        if (response.data.status === 'success') {
          setOrderHistory(response.data.data);
          setInvoices(response.data.invoices); // Assuming invoices are returned in the same response
        }
      } catch (error) {
        console.error('Error fetching order history:', error);
      }
    };

    fetchOrderHistory();
  }, []);

  const handleDownload = async (invoiceFileName) => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/invoice/${invoiceFileName}`, { responseType: 'blob' }); // API call to fetch the PDF
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = invoiceFileName; // Set the file name for download
      link.click();
      setLoading(false);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      setLoading(false);
      setDownloadError('There was an error downloading the invoice. Please try again.');
    }
  };

  return (
    <div className="bg-green-100 min-h-screen py-10 px-4 sm:px-8 flex flex-col items-center">
      {!orderhistory && (
        <div className="w-full h-screen flex items-center justify-center">
          <Loader />
        </div>
      )}

      <h1 className="text-4xl font-extrabold text-gray-800 mb-8">📚 My Order History</h1>

      <div className="overflow-x-auto w-full max-w-6xl bg-white shadow-xl rounded-xl border border-gray-200">
        <table className="w-full border-collapse text-sm sm:text-base">
          <thead>
            <tr className="bg-amber-100 text-gray-900 font-semibold uppercase tracking-wide">
              <th className="px-4 py-3 text-left">Sr No.</th>
              <th className="px-4 py-3 text-left">Book</th>
              <th className="px-4 py-3 text-left hidden sm:table-cell">Description</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Mode</th>
              <th className="px-4 py-3 text-left">Invoice</th>
            </tr>
          </thead>

          <tbody>
            {orderhistory?.map((item, index) => {
              // Find matching invoice for the current order
              const matchedInvoice = invoices.find((invoice) => invoice.orderId === item.orderId);

              return (
                <tr
                  key={index}
                  className={`border-b border-gray-300 ${index % 2 === 0 ? 'bg-green-50' : 'bg-white'} hover:bg-green-200/40 transition-all`}
                >
                  {item.book ? (
                    <>
                      <td className="px-4 py-4 font-medium text-gray-950">{index + 1}</td>
                      <td className="px-4 py-4 font-semibold text-gray-800">{item.book.title}</td>
                      <td className="px-4 py-4 text-gray-600 hidden sm:table-cell">{item.book.desc.slice(0, 50)}...</td>
                      <td className="px-4 py-4 font-bold text-green-700">₹ {item.book.price}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${item.status === 'delivered' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-800">
                        {item.paymentMethod === "cod"
                          ? "Cash on Delivery"
                          : item.paymentMethod === "razorpay"
                          ? "Razorpay"
                          : <span className="text-gray-400">Unknown</span>}
                      </td>
                      <td className="px-4 py-4">
                        {matchedInvoice ? (
                          <button
                            onClick={() => handleDownload(matchedInvoice.fileName)}
                            className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium px-3 py-1.5 rounded-md shadow-sm transition"
                            disabled={loading}
                          >
                            {loading ? <span>Loading...</span> : <FiDownload className="text-lg" />}
                            <span className="hidden sm:inline">Download</span>
                          </button>
                        ) : (
                          <span className="text-gray-400 italic">No invoice</span>
                        )}
                      </td>
                    </>
                  ) : (
                    <td colSpan="7" className="px-4 py-4 text-center text-gray-500 italic">
                      🚫 Book Deleted - Data Not Found
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {downloadError && (
        <div className="mt-4 text-red-500">{downloadError}</div>
      )}
    </div>
  );
};

export default OrderHistory;
