import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import logo from '../assets/logo.png';

const Register = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    username: '',
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
    <div className='bg-[#020918] h-screen flex items-center justify-center px-4'>
      <div className='flex flex-col md:flex-row items-center justify-between w-full max-w-6xl gap-12 p-6'>

        {/* Logo & Info Section */}
        <div className='flex flex-col items-center justify-center text-center md:text-left'>
          <img src={logo} alt='vibeclip-logo' className='w-48 md:w-60 object-cover' />
          <h1 className='text-4xl md:text-5xl bg-gradient-to-r from-[#FFA500] via-[#FF4500] to-[#FFA500] text-transparent bg-clip-text leading-tight pb-2'>
            VibeClip Register
          </h1>
          <p className='text-[#cccccc] text-lg md:text-xl text-center mt-3 max-w-lg'>
            Create your account to manage your profile, check notifications, comment on videos, and more.
          </p>
        </div>

        {/* Registration Form */}
        <div className='bg-[#111827] p-8 rounded-lg shadow-2xl w-full max-w-md'>
          <form onSubmit={signUpHandler}>
            <div className='flex flex-col mb-6'>
              <label className='text-[#FFA500] font-semibold mb-1' htmlFor='username'>Username</label>
              <input
                type='text'
                id='username'
                placeholder='Enter your username'
                className='w-full p-3 rounded-lg bg-[#1f2937] text-white border border-[#FFA500]'
                name='username'
                value={input.username}
                onChange={changeEventHandler}
                required
              />
            </div>

            <div className='flex flex-col mb-6'>
              <label className='text-[#FFA500] font-semibold mb-1' htmlFor='email'>Email</label>
              <input
                type='email'
                id='email'
                placeholder='Enter your email'
                className='w-full p-3 rounded-lg bg-[#1f2937] text-white border border-[#FFA500]'
                value={input.email}
                onChange={changeEventHandler}
                name='email'
                required
              />
            </div>

            <div className='flex flex-col mb-6'>
              <label className='text-[#FFA500] font-semibold mb-1' htmlFor='password'>Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id='password'
                placeholder='Enter your password'
                className='w-full p-3 rounded-lg bg-[#1f2937] text-white border border-[#FFA500]'
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
              <label htmlFor="show-password" className="text-[#FFA500]">Show Password</label>
            </div>

            <button
              type='submit'
              className='bg-[#FFA500] text-[#020918] px-4 py-2 rounded-lg w-full font-bold hover:bg-[#ff8c00] transition duration-300'
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <div className='mt-6 flex items-center justify-center text-[#FFA500]'>
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
