import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`http://localhost:8000/api/v1/user/request-password-reset/${token}`, { newPassword });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/login');
      } else {
        toast.error(res.data.message || 'Failed to reset password');
      }
    } catch {
      toast.error('Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#020918] h-screen flex items-center justify-center px-4">
      <div className="bg-[#111827] p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-2xl text-[#FFA500] mb-6 text-center font-semibold">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col mb-6">
            <label htmlFor="newPassword" className="text-[#FFA500] font-semibold mb-1">New Password</label>
            <input
              type="password"
              id="newPassword"
              placeholder="Enter your new password"
              className="w-full p-3 rounded-lg bg-[#1f2937] text-white border border-[#FFA500] focus:outline-none focus:ring-2 focus:ring-[#FFA500] transition duration-300"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className={`bg-[#FFA500] text-[#020918] px-4 py-2 rounded-lg w-full font-bold transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#ff8c00]'
              }`}
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
