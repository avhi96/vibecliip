import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { ThemeContext } from '../context/ThemeContext';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
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
      const res = await axios.post(`${API_BASE_URL}/auth/login`, input, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.data.success) {
        toast.success(res.data.message);
        login(res.data.user, res.data.token);
        navigate('/', { replace: true });
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

  const googleLoginHandler = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const res = await axios.post(`${API_BASE_URL}/auth/login`, { idToken }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.data.success) {
        toast.success(res.data.message);
        login(res.data.user, res.data.token);
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error(error);
      toast.error('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900' : 'bg-gray-100'} h-screen flex items-center justify-center px-4 relative transition-colors duration-500`}>
      <button
        onClick={() => toggleTheme()}
        aria-label="Toggle Theme"
        className="absolute top-4 right-4 p-2 rounded-full border border-yellow-500 text-gray-900  shadow-lg transition duration-300 z-50"
        title="Switch light/dark theme"
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
      <div className='flex flex-col md:flex-row items-center justify-between w-full max-w-6xl gap-12 p-6'>
        <div className='flex flex-col items-center justify-center text-center md:text-left'>
          <img src="./logo.png" alt="VibeClip Logo" className='w-48 md:w-60 object-cover' />
          <h1 className='text-4xl md:text-5xl text-center bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 text-transparent bg-clip-text leading-tight pb-2'>
            VibeClip Login
          </h1>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-lg md:text-xl text-center mt-3 max-w-lg`}>
            Manage your account, check notifications, comment on videos, and more.
          </p>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-8 rounded-lg shadow-2xl w-full max-w-md transition-colors duration-500`}>
          <form onSubmit={loginHandler}>
            <div className="flex flex-col mb-6">
              <label htmlFor="email" className={`${darkMode ? 'text-yellow-400' : 'text-yellow-600'} font-semibold mb-1`}>Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className={`${darkMode ? 'bg-gray-700 text-white border-yellow-400 focus:ring-yellow-400' : 'bg-gray-100 text-gray-900 border-yellow-600 focus:ring-yellow-600'} w-full p-3 rounded-lg border focus:outline-none transition duration-300`}
                name='email'
                value={input.email}
                onChange={changeEventHandler}
                required
              />
            </div>

            <div className="flex flex-col mb-6">
              <label htmlFor="password" className={`${darkMode ? 'text-yellow-400' : 'text-yellow-600'} font-semibold mb-1`}>Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter your password"
                className={`${darkMode ? 'bg-gray-700 text-white border-yellow-400 focus:ring-yellow-400' : 'bg-gray-100 text-gray-900 border-yellow-600 focus:ring-yellow-600'} w-full p-3 rounded-lg border focus:outline-none transition duration-300`}
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
              <label htmlFor="show-password" className={`${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>Show Password</label>
            </div>

            <button
              type="submit"
              className={`px-4 py-2 rounded-lg w-full font-bold transition duration-300 ${darkMode ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500' : 'bg-yellow-500 text-gray-900 hover:bg-yellow-600'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className={`mt-4 text-center`}>
            <button
              onClick={googleLoginHandler}
              className={`${darkMode ? 'bg-transparent border flex justify-center border-blue-600 text-white font-bold py-2 px-4 m-auto rounded mt-7' : 'bg-transparent border flex justify-center border-[#357ae8] text-black font-bold py-2 px-4 m-auto rounded mt-7'}`}
              disabled={loading}
            >
              <img src="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s48-fcrop64=1,00000000ffffffff-rw" alt="google logo" className='w-5 h-5 me-3' />
              {loading ? 'Loading...' : 'Login with Google'}
            </button>
          </div>

          <div className='mt-4 text-center'>
            <Link to='/forget-password' className={`${darkMode ? 'text-yellow-400 hover:underline' : 'text-yellow-400 hover:underline'}`}>
              Forgot Password?
            </Link>
          </div>

          <div className={`mt-6 flex items-center justify-center ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
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
