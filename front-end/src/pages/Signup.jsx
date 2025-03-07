import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auth, provider, signInWithPopup } from '../firebase'; // Firebase Auth
import { toast, ToastContainer } from 'react-toastify'; // Corrected import of ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toastify styles

import img1 from '../asset/img1.png'; // Import image if it's in the 'src' directory

const Signup = () => {
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    address: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // Validation
    const { username, email, password, address } = values;

    if (!username || !email || !password || !address) {
      toast.error('All fields are required.');
      return;
    }

    // Username validation
    if (username.length < 3) {
      toast.error('Username must be at least 3 characters long.');
      return;
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    // Password validation
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    // Address validation
    if (address.length < 10) {
      toast.error('Address must be at least 10 characters long.');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/signup`,
        values
      );

      toast.success('Signup Successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      // Send user data to backend
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/google-auth`, {
        email: user.email,
        displayName: user.displayName,
        uid: user.uid,
      });
  
      // Save the token in localStorage
      localStorage.setItem('token', response.data.token);
  
      // Redirect to profile or home page
      window.location.href = '/profile';
    } catch (error) {
      console.error('Google Signup Error:', error);
      toast.error('Google Signup failed. Please try again!');
    }
  };
  
  
  
  
  
  return (
    <div className="h-screen flex items-start justify-center bg-green-200 px-6 pt-6">
      <div className="flex w-full max-w-screen-xl">
        {/* Form Section */}
        <div className="bg-white shadow-2xl rounded-xl p-8 w-full sm:w-[500px] transform transition-all duration-500 hover:scale-105 hover:shadow-xl mr-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8 animate__animated animate__fadeIn animate__delay-1s">
            Create an Account
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-medium">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter username"
                className="w-full p-3 bg-green-100 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300"
                value={values.username}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                className="w-full p-3 bg-green-100 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300"
                value={values.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                className="w-full p-3 bg-green-100 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300"
                value={values.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium">Address</label>
              <textarea
                name="address"
                placeholder="Enter address"
                className="w-full p-3 bg-green-100 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300"
                value={values.address}
                onChange={handleChange}
              ></textarea>
            </div>

            <button
              className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
              onClick={handleSubmit}
            >
              Sign Up
            </button>

            <p className="text-gray-700 text-sm text-center">or</p>

            <button
              className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold py-3 rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
              onClick={handleGoogleSignup}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
                alt="Google Logo"
                className="w-5 h-5"
              />
              Sign up with Google
            </button>

            <p className="text-gray-700 text-sm text-center">
              Already have an account?{' '}
              <Link to="/login" className="text-green-600 hover:text-green-700 transition-all duration-300">
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Image Section */}
        <div className="w-full sm:w-[900px] p-2 rounded-xl flex justify-end ml-40">
          <img
            src={img1} // Now using imported image
            alt="Signup Illustration"
            className="w-full h-auto max-w-full rounded-xl"
          />
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default Signup;
