import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login, changeRole } from '../store/auth';
import axios from 'axios';
import loginImage from '../asset/login.png'; // Adjust the path as necessary
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [values, setValues] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  useEffect(() => {
    axios
      .get('http://localhost:4000/api/v1/getuserinfo')
      .then((response) => {
        console.log('Fetched Data:', response.data);
      })
      .catch((error) => {
        console.error('Error fetching user info:', error);
      });
  }, []);

  const submit = async (e) => {
    e.preventDefault();  // Prevent default form submission

    // Client-side validation
    if (!values.username) {
      toast.error('Username is required');
      return;
    }
    if (!values.password) {
      toast.error('Password is required');
      return;
    }

    // Perform the login request
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/signin`, values);
      
      toast.success(response.data.message);  // Show success message
      navigate('/');

      dispatch(login());
      dispatch(changeRole(response.data.role));

      localStorage.setItem('id', response.data.id);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div
      className="min-h-screen flex items-start justify-center bg-white px-4 pt-12"
      style={{
        backgroundImage: `url(${loginImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 70%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="min-h-screen absolute inset-0 bg-black opacity-50"></div> {/* Darker overlay */}
      <div className="relative bg-transparent backdrop-blur-lg rounded-2xl p-8 shadow-lg w-full sm:w-[500px] border border-white/20">
        <h2 className="text-5xl font-extrabold bg-clip-text text-center mb-6 text-white">
          Welcome Back
        </h2>

        <div className="space-y-6">
          <form onSubmit={submit}>
            <div>
              <label htmlFor="username" className="block text-white text-sm font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter username"
                className="w-full bg-gray-100 text-gray-800 p-4 rounded-lg outline-none border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm"
                required
                value={values.username}
                onChange={change}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                className="w-full bg-gray-100 text-gray-800 p-4 rounded-lg outline-none border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm"
                required
                value={values.password}
                onChange={change}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition-all duration-300 mt-4 transform hover:scale-105"
            >
              Login
            </button>
          </form>

          <div className="flex justify-between items-center mt-6">
            <p className="text-white text-base">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-blue-200 hover:text-blue-300 hover:underline transition-all duration-300"
              >
                Sign up
              </Link>
            </p>

            <p className="text-white text-base">
              <Link
                to="/forgot-password"
                className="text-blue-200 hover:text-blue-300 hover:underline transition-all duration-300"
              >
                Forgot Password?
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Toast Container with dark background */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" // This applies dark theme to the Toastify container
      />
    </div>
  );
};

export default Login;
