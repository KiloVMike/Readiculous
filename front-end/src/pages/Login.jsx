import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login, changeRole } from '../store/auth';
import { auth, provider, signInWithPopup } from '../firebase'; // Import Firebase Auth
import axios from 'axios';

const Login = () => {
  const [Values, setValue] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const change = (e) => {
    const { name, value } = e.target;
    setValue({ ...Values, [name]: value });
  };

  const submit = async () => {
    try {
      if (!Values.username || !Values.password) {
        alert('All fields are required');
        return;
      }

      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/signin`, Values);
      alert(response.data.message);
      navigate('/');

      dispatch(login());
      dispatch(changeRole(response.data.role));

      localStorage.setItem('id', response.data.id);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Google User:", user);

      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/google-auth`, {
        email: user.email,
        displayName: user.displayName,
        uid: user.uid,
      });

      alert(response.data.message);
      navigate('/');

      dispatch(login());
      dispatch(changeRole(response.data.role));

      localStorage.setItem('id', response.data.id);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      alert("Google Sign-In failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gradient-to-br from-gray-900 to-black px-4 pt-28">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-lg w-full sm:w-[400px] border border-white/20">
        <h2 className="text-2xl font-semibold text-white text-center mb-6">Welcome Back</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-gray-300 text-sm font-medium">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter username"
              className="w-full bg-gray-800 text-white p-3 rounded-lg outline-none border border-gray-600 focus:ring-2 focus:ring-blue-500"
              required
              value={Values.username}
              onChange={change}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-300 text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              className="w-full bg-gray-800 text-white p-3 rounded-lg outline-none border border-gray-600 focus:ring-2 focus:ring-blue-500"
              required
              value={Values.password}
              onChange={change}
            />
          </div>

          <button
            className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition-all duration-300"
            onClick={submit}
          >
            Login
          </button>

          <p className="text-gray-400 text-sm text-center">or</p>

          <button
            className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-200 transition-all duration-300"
            onClick={signInWithGoogle}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" alt="Google Logo" className="w-5 h-5" />
            Sign in with Google
          </button>

          <p className="text-gray-400 text-sm text-center">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-400 hover:text-blue-500 transition-all duration-300">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
