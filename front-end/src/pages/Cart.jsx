import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import { MdDelete } from "react-icons/md";
import { FaMoneyBillWave, FaCreditCard, FaShoppingCart } from "react-icons/fa";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { cartCount } from '../store/cart';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart = () => {
  const [cart, setCart] = useState();
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const fetch = async () => {
    const [cartRes, userRes] = await Promise.all([
      axios.get(`${process.env.REACT_APP_BASE_URL}/getusercart`, { headers }),
      axios.get(`${process.env.REACT_APP_BASE_URL}/getuserinfo`, { headers })
    ]);

    setCart(cartRes.data.data);
    setUser(userRes.data);
  };

  useEffect(() => {
    fetch();
  }, []);

  const removeCart = async (book) => {
    const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/removetocart/${book}`, {}, { headers });
    const cartValue = await axios.get(`${process.env.REACT_APP_BASE_URL}/getuserinfo`, { headers });
    dispatch(cartCount(cartValue.data.cart.length));
    alert(response.data.message);
    fetch();
  };

  useEffect(() => {
    if (cart && cart.length > 0) {
      let totalAmount = cart.reduce((acc, item) => acc + item.price, 0);
      setTotal(totalAmount);
    }
  }, [cart]);

  const handlePayment = () => {
    if (!paymentMethod) {
      toast.error("Please choose a payment method", { position: "top-right", theme: "dark" });
      return;
    }
    setLoading(true);
    paymentMethod === "cod" ? placeOrder() : initiateRazorpayPayment();
  };

  const handlePaymentSuccess = async () => {
    try {
      await placeOrder();
      toast.success("Payment successful!");
    } catch (error) {
      toast.error("Payment verification failed");
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initiateRazorpayPayment = async () => {
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      toast.error("Failed to load Razorpay.");
      return;
    }

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/create-order`,
        { amount: total, currency: "INR" }
      );

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "READICULOUS",
        description: "Book Payment",
        order_id: data.order.id,
        handler: handlePaymentSuccess,
        prefill: {
          name: "User",
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: { color: "#3399cc" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error("Payment initiation failed");
    }
  };

  const placeOrder = async () => {
    try {
      if (!cart || cart.length === 0) {
        toast.error("Your cart is empty");
        return;
      }

      const orderData = cart.map((item) => ({ _id: item._id }));
      const orderResponse = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/placeorder`,
        { order: orderData, paymentMethod },
        { headers }
      );

      toast.success("Order placed successfully!");

      const invoiceResponse = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/generate-invoice`,
        { order: cart },
        { headers }
      );

      if (invoiceResponse.data.invoiceId) {
        toast.success("Invoice generated!");
        window.open(`${process.env.REACT_APP_BASE_URL}/invoice/${invoiceResponse.data.invoiceId}`, '_blank');
      }

      const cartValue = await axios.get(`${process.env.REACT_APP_BASE_URL}/getuserinfo`, { headers });
      dispatch(cartCount(cartValue.data.cart.length));
      navigate('/profile/orderhistory');
    } catch (error) {
      toast.error("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-green-100 min-h-screen py-10 px-4 sm:px-12 flex flex-col items-center'>
      {loading && <Loader />}
      <p className='text-4xl font-bold text-gray-800 mb-8 flex items-center'>
        <FaShoppingCart className='mr-3 text-green-700 text-5xl' /> Your Cart
      </p>

      {!cart ? (
        <div className='h-screen flex items-center justify-center'></div>
      ) : cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <FaShoppingCart className="text-gray-400 text-7xl animate-bounce mb-6" />
          <h1 className="text-3xl font-semibold text-gray-700 mb-3">Oops! Your Cart is Empty</h1>
          <p className="text-gray-500 text-center max-w-md mb-6">
            Looks like you haven’t added anything to your cart yet. Explore our collection and find your next favorite read!
          </p>
          <button
            onClick={() => navigate('/allbooks')}
            className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-full shadow-lg hover:bg-purple-800 transition-all duration-300"
          >
            Browse Books
          </button>
        </div>
      ) : (
        <div className='w-full max-w-4xl space-y-6'>

         

          {/* Cart Items */}
          {cart.map((item, index) => (
            <div key={index} className='flex items-center justify-between bg-white p-6 rounded-xl shadow-xl'>
              <img src={item.url} alt={item.title} className='w-24 h-32 object-cover rounded-lg shadow-md' />
              <div className='flex-1 ml-6'>
                <p className='font-bold text-xl text-gray-900'>{item.title}</p>
                <p className='text-gray-700 text-sm'>{item.desc.slice(0, 80)}...</p>
              </div>
              <div className='flex flex-col items-center'>
                <p className='text-gray-900 font-semibold text-lg'>₹ {item.price}</p>
                <button onClick={() => removeCart(item._id)} className='text-red-500 text-3xl hover:text-red-700 transition-all mt-2'>
                  <MdDelete />
                </button>
              </div>
            </div>
          ))}

{/* Shipping Address Section */}
{user?.address && (
  <div className='bg-white p-6 rounded-xl shadow-md text-left'>
    <h2 className='text-xl font-bold text-gray-800 mb-2'>Your Shipping Address</h2>
    <p className='text-gray-700'>{user.address}</p>
    <div className='flex items-center justify-center mt-6'>
    <hr className='my-4 border-t border-black' />
    
    <p className=' text-sm text-gray-500 mt-1'>
  You can change your shipping address in <Link to="/profile/setting" className='underline hover:text-blue-300'>Settings</Link>.
</p>

</div>
  </div>
)}




          {/* Total and Payment */}
          <div className='bg-white text-gray-900 p-6 rounded-xl shadow-xl text-center'>
            <p className='text-3xl font-extrabold mb-2 text-gray-800'>Total Amount</p>
            <div className='flex justify-between font-bold text-2xl my-4 border-t border-gray-300 pt-4 text-gray-800'>
              <p>{cart.length} items</p>
              <p className='text-blue-600'>₹ {total}</p>
            </div>
            <div className='flex flex-col space-y-3'>
              <p className='text-lg font-semibold'>Choose Payment Method:</p>
              <div className='flex justify-center space-x-4'>
                <button
                  onClick={() => setPaymentMethod("razorpay")}
                  className={`flex items-center px-6 py-2 rounded-lg font-semibold border border-gray-400 transition-all duration-300 hover:bg-green-200 ${paymentMethod === "razorpay" ? "bg-green-700 text-white" : "bg-white text-gray-700"}`}>
                  <FaCreditCard className='mr-2' /> Razorpay
                </button>
                <button
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex items-center px-6 py-2 rounded-lg font-semibold border border-gray-400 transition-all duration-300 hover:bg-green-200 ${paymentMethod === "cod" ? "bg-green-700 text-white" : "bg-white text-gray-700"}`}>
                  <FaMoneyBillWave className='mr-2' /> Cash on Delivery
                </button>
              </div>
              <button
                className='bg-green-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-600 transition-all duration-300 w-full mt-4'
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? "Processing..." : paymentMethod === "cod" ? "Complete Order" : "Proceed to Payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
