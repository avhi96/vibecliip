import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const ProfileEdit = ({ user, onProfileUpdated }) => {
  const { axiosInstance } = useContext(AuthContext);
  const [bio, setBio] = useState(user.bio || '');
  const [gender, setGender] = useState(user.gender || '');
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(user.profilePicture || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (profilePicture) {
      const objectUrl = URL.createObjectURL(profilePicture);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [profilePicture]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('bio', bio);
      formData.append('gender', gender);
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }

      const res = await axiosInstance.put('/user/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      

      if (res.data.success) {
        onProfileUpdated(res.data.user);
      } else {
        setError('Failed to update profile');
      }
    } catch (err) {
      setError('Error updating profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-yellow-400">Edit Profile</h3>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="mb-4">
        <label className="block mb-1 text-gray-700 dark:text-yellow-300">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-yellow-300"
          rows={3}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-gray-700 dark:text-yellow-300">Gender</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-yellow-300"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-gray-700 dark:text-yellow-300">Profile Picture</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && (
          <img src={preview} alt="Profile Preview" className="mt-2 w-24 h-24 rounded-full object-cover" />
        )}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded font-semibold transition disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
};

export default ProfileEdit;
