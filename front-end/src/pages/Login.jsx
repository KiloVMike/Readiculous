import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login, changeRole } from '../store/auth';
import { auth, provider, signInWithPopup } from '../firebase'; // Import Firebase Auth
import axios from 'axios';

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
    try {
      if (!values.username || !values.password) {
        alert('All fields are required');
        return;
      }

      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/signin`, values);
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


  return (
    <div className="min-h-screen flex items-start justify-center bg-gradient-to-br from-gray-900 to-black px-4 pt-28">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-lg w-full sm:w-[400px] border border-white/20">
        <h2 className="text-2xl font-semibold text-white text-center mb-6">Welcome Back</h2>

        <div className="space-y-4">
          <form onSubmit={submit}> {/* Add form tag with onSubmit */}
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
                value={values.username}
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
                value={values.password}
                onChange={change}
              />
            </div>

            <button
  type="submit" // Change button type to submit
  className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition-all duration-300"
>
  Login
</button>
          </form>

          <p className="text-gray-400 text-sm text-center">or</p>

     

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
