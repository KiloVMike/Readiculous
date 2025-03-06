import React from "react";
import axios from "axios";

const PaymentGateway = () => {
  const handlePayment = async () => {
    try {
      // 1️⃣ Create an order on the backend
      const { data } = await axios.post("http://localhost:5000/api/payment/create-order", {
        amount: 500, // Amount in INR
        currency: "INR",
        receipt: "order_rcptid_11",
      });

      const { order } = data;

      // 2️⃣ Open Razorpay Checkout
      const options = {
        key: "your_razorpay_key_id", // Replace with your actual Key ID
        amount: order.amount,
        currency: order.currency,
        name: "HOMESAGE",
        description: "Real Estate Payment",
        order_id: order.id,
        handler: async (response) => {
          const verifyRes = await axios.post("http://localhost:5000/api/payment/verify-payment", response);
          if (verifyRes.data.success) {
            alert("Payment Successful!");
          } else {
            alert("Payment Failed!");
          }
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Payment Gateway</h2>
      <button
        className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
        onClick={handlePayment}
      >
        Pay Now ₹500
      </button>
    </div>
  );
};

export default PaymentGateway;
