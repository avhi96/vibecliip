import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ThemeContext } from '../context/ThemeContext';

const Register = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [input, setInput] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const signUpHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:8000/api/v1/user/register', input, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/login'); // Redirect after success
      }
    } catch (error) {
      console.log(error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900' : 'bg-gray-100'} h-screen flex items-center justify-center px-4 relative transition-colors duration-500`}>
      <button
        onClick={() => toggleTheme()}
        aria-label="Toggle Theme"
        className="absolute top-4 right-4 p-2 rounded-full bg-yellow-400 text-gray-900 hover:bg-yellow-500 shadow-lg transition duration-300 z-50"
        title="Switch light/dark theme"
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
      <div className='flex flex-col md:flex-row items-center justify-between w-full max-w-6xl gap-12 p-6'>

        {/* Logo & Info Section */}
        <div className='flex flex-col items-center justify-center text-center md:text-left'>
          <img src="./logo.png" alt='vibeclip-logo' className='w-48 md:w-60 object-cover' />
          <h1 className='text-4xl md:text-5xl bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 text-transparent bg-clip-text leading-tight pb-2'>
            VibeClip Register
          </h1>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-lg md:text-xl text-center mt-3 max-w-lg`}>
            Create your account to manage your profile, check notifications, comment on videos, and more.
          </p>
        </div>

        {/* Registration Form */}
        <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-8 rounded-lg shadow-2xl w-full max-w-md transition-colors duration-500`}>
          <form onSubmit={signUpHandler}>
            <div className='flex flex-col mb-6'>
              <label className={`${darkMode ? 'text-yellow-400' : 'text-yellow-600'} font-semibold mb-1`} htmlFor='username'>Username</label>
              <input
                type='text'
                id='username'
                placeholder='Enter your username'
                className={`${darkMode ? 'bg-gray-700 text-white border-yellow-400 focus:ring-yellow-400' : 'bg-gray-100 text-gray-900 border-yellow-600'} w-full p-3 rounded-lg border focus:outline-none transition duration-300`}
                name='username'
                value={input.username}
                onChange={changeEventHandler}
                required
              />
            </div>

            <div className='flex flex-col mb-6'>
              <label className={`${darkMode ? 'text-yellow-400' : 'text-yellow-600'} font-semibold mb-1`} htmlFor='email'>Email</label>
              <input
                type='email'
                id='email'
                placeholder='Enter your email'
                className={`${darkMode ? 'bg-gray-700 text-white border-yellow-400 focus:ring-yellow-400' : 'bg-gray-100 text-gray-900 border-yellow-600'} w-full p-3 rounded-lg border focus:outline-none transition duration-300`}
                value={input.email}
                onChange={changeEventHandler}
                name='email'
                required
              />
            </div>

            <div className='flex flex-col mb-6'>
              <label className={`${darkMode ? 'text-yellow-400' : 'text-yellow-600'} font-semibold mb-1`} htmlFor='password'>Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id='password'
                placeholder='Enter your password'
                className={`${darkMode ? 'bg-gray-700 text-white border-yellow-400 focus:ring-yellow-400' : 'bg-gray-100 text-gray-900 border-yellow-600'} w-full p-3 rounded-lg border focus:outline-none transition duration-300`}
                value={input.password}
                onChange={changeEventHandler}
                name='password'
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
              <label htmlFor="show-password" className={`${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>Show Password</label>
            </div>

            <button
              type='submit'
              className={`px-4 py-2 rounded-lg w-full font-bold transition duration-300 ${darkMode ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500' : 'bg-yellow-500 text-gray-900 hover:bg-yellow-600'}`}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <div className={`mt-6 flex items-center justify-center ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
            Already have an account?
            <Link to='/login' className='text-sky-600 hover:underline ml-2'>
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
