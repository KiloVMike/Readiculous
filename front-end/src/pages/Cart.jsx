import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import { MdDelete } from "react-icons/md";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { cartCount } from '../store/cart';
import { useDispatch } from 'react-redux';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getusercart`, { headers });
      const cartData = response.data.data || [];
      setCart(cartData.reverse()); // ✅ Matches backend `.reverse()`
    } catch (error) {
      console.error("❌ Error fetching cart:", error);
      setCart([]); // Avoids crashing
    }
  };

  useEffect(() => {
    fetchCart();         
  }, []);

  const removeCart = async (bookId) => {
    try {
      await axios.put(`${process.env.REACT_APP_BASE_URL}/removetocart/${bookId}`, {}, { headers });

      // ✅ Update cart state after removal
      setCart(prevCart => prevCart.filter(item => item._id !== bookId));

      // ✅ Fetch updated cart count
      const cartValue = await axios.get(`${process.env.REACT_APP_BASE_URL}/getuserinfo`, { headers });
      dispatch(cartCount(cartValue.data.cart.length));

    } catch (error) {
      console.error("❌ Error removing item:", error);
      alert("Failed to remove item.");
    }
  };

  useEffect(() => {
    if (cart.length > 0) {
      setTotal(cart.reduce((sum, item) => sum + (item.price || 0), 0));
    } else {
      setTotal(0);
    }
  }, [cart]);

  const placeOrder = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/placeorder`, { order: cart }, { headers });

      // ✅ Reset cart after successful order
      setCart([]);
      dispatch(cartCount(0));

      alert(response.data.message);
      navigate('/profile/orderhistory');

    } catch (error) {
      console.error("❌ Error placing order:", error);
      alert("Failed to place order.");
    }
  };

  return (
    <div className='bg-zinc-900 py-4'>
      <p className='mx-4 text-3xl font-semibold text-zinc-200 p-2'>Your Cart</p>

      {!cart.length && (
        <div className='h-screen flex items-center justify-center'>
          {cart === null ? <Loader /> : <h1 className='text-2xl text-zinc-700 font-semibold'>Empty Cart</h1>}
        </div>
      )}

      {cart.length > 0 && (
        <>
          {cart.map((item, index) => (
            <div key={item._id || index} className='flex items-center justify-between bg-zinc-800 text-white m-2 rounded sm:px-12 sm:mx-12'>
              <div className='w-1/6'>
                <img src={item.url} alt="" className='h-[10vh] sm:h-[20vh] rounded p-2 object-cover' />
              </div>
              <div className='flex flex-col items-start w-4/6'>
                <p className='font-semibold text-md sm:text-xl'>{item.title}</p>
                <p className='text-zinc-500 text-xs sm:text-sm'>{item.desc}:"No description available"</p>
              </div>
              <div className='flex w-1/6 justify-around text-xs sm:text-lg'>
                <p>₹ {item.price}</p>
                <button onClick={() => removeCart(item._id)} className='sm:text-2xl'><MdDelete /></button>
              </div>
            </div>
          ))}

          <div className='flex justify-end px-2 sm:px-12'>
            <div className='bg-zinc-800 text-white px-4 py-1 sm:mx-12 sm:px-8 sm:py-4 rounded'>
              <p className='font-semibold text-lg sm:text-2xl text-zinc-600'>Total Amount</p>
              <div className='flex justify-around my-2 sm:my-4'>
                <p>{cart.length} books</p>
                <p>₹ {total}</p>
              </div>
              <div className='flex justify-center'>
                <button className='bg-white text-zinc-900 px-4 py-1 sm:px-8 sm:py-2 rounded font-semibold' onClick={placeOrder}>Place order</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
