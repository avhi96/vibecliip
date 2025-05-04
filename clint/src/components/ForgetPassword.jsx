import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:8000/api/v1/user/request-password-reset', { email });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/reset-password');
      } else {
        toast.error(res.data.message || 'Failed to send reset link');
      }
    } catch {
      toast.error('Error sending reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#020918] h-screen flex items-center justify-center px-4">
      <div className="bg-[#111827] p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-2xl text-[#FFA500] mb-6 text-center font-semibold">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col mb-6">
            <label htmlFor="email" className="text-[#FFA500] font-semibold mb-1">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full p-3 rounded-lg bg-[#1f2937] text-white border border-[#FFA500] focus:outline-none focus:ring-2 focus:ring-[#FFA500] transition duration-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className={`bg-[#FFA500] text-[#020918] px-4 py-2 rounded-lg w-full font-bold transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#ff8c00]'
              }`}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
