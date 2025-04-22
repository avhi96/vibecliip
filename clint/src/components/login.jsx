import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [input, setInput] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:8000/api/v1/user/login', input, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        login(res.data.user); // update auth context
        navigate('/'); 
      }
    } catch (error) {
      console.log(error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-[#020918] h-screen flex items-center justify-center px-4'>
      <div className='flex flex-col md:flex-row items-center justify-between w-full max-w-6xl gap-12 p-6'>
        {/* Logo & Info */}
        <div className='flex flex-col items-center justify-center text-center md:text-left'>
          <img src="./logo.png" alt="VibeClip Logo" className='w-48 md:w-60 object-cover' />
          <h1 className='text-4xl md:text-5xl text-center bg-gradient-to-r from-[#FFA500] via-[#FF4500] to-[#FFA500] text-transparent bg-clip-text leading-tight pb-2'>
            VibeClip Login
          </h1>
          <p className='text-[#cccccc] text-lg md:text-xl text-center mt-3 max-w-lg'>
            Manage your account, check notifications, comment on videos, and more.
          </p>
        </div>

        {/* Login Form */}
        <div className='bg-[#111827] p-8 rounded-lg shadow-2xl w-full max-w-md'>
          <form onSubmit={loginHandler}>
            <div className="flex flex-col mb-6">
              <label htmlFor="email" className="text-[#FFA500] font-semibold mb-1">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full p-3 rounded-lg bg-[#1f2937] text-white border border-[#FFA500] focus:outline-none focus:ring-2 focus:ring-[#FFA500] transition duration-300"
                name='email'
                value={input.email}
                onChange={changeEventHandler}
                required
              />
            </div>

            <div className="flex flex-col mb-6">
              <label htmlFor="password" className="text-[#FFA500] font-semibold mb-1">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter your password"
                className="w-full p-3 rounded-lg bg-[#1f2937] text-white border border-[#FFA500] focus:outline-none focus:ring-2 focus:ring-[#FFA500] transition duration-300"
                value={input.password}
                name='password'
                onChange={changeEventHandler}
                required
              />
            </div>

            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="show-password"
                className="mr-2"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}

              />
              <label htmlFor="show-password" className="text-[#FFA500]">Show Password</label>
            </div>

            <button
              type="submit"
              className={`bg-[#FFA500] text-[#020918] px-4 py-2 rounded-lg w-full font-bold transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#ff8c00]'
                }`}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

          </form>

          <div className='mt-6 flex items-center justify-center text-[#FFA500]'>
            Doesn't have an account?
            <Link to='/register' className='text-sky-600 hover:underline ml-2'>
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
