import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auth, provider, signInWithPopup } from '../firebase'; // Firebase Auth

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
    try {
      if (!values.username || !values.email || !values.password || !values.address) {
        alert('All fields are required');
        return;
      }
  
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/signup`,
        values
      );
  
      alert('Signup Successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
      alert(error.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/google-auth`, {
        email: user.email,
        displayName: user.displayName,
        uid: user.uid,
      });

      alert('Signup Successful! Redirecting...');
      navigate('/');

    } catch (error) {
      console.error('Google Signup Error:', error);
      alert('Google Sign-Up failed. Please try again.');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black px-4">
      <div className="bg-zinc-800 shadow-lg rounded-xl p-8 w-full sm:w-[400px] border border-white/10">
        <h2 className="text-2xl font-semibold text-white text-center mb-6">Create an Account</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm font-medium">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              className="input-field"
              value={values.username}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              className="input-field"
              value={values.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              className="input-field"
              value={values.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-medium">Address</label>
            <textarea
              name="address"
              placeholder="Enter address"
              className="input-field"
              value={values.address}
              onChange={handleChange}
            ></textarea>
          </div>

          <button
            className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition-all duration-300"
            onClick={handleSubmit}
          >
            Sign Up
          </button>

          <p className="text-gray-400 text-sm text-center">or</p>

          <button
            className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-200 transition-all duration-300"
            onClick={handleGoogleSignup}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
              alt="Google Logo"
              className="w-5 h-5"
            />
            Sign up with Google
          </button>

          <p className="text-gray-400 text-sm text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-500 transition-all duration-300">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
 