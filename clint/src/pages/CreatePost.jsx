import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '../context/PostsContext';

const CreatePost = () => {
  const { axiosInstance } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const { addPost, fetchPosts } = usePosts();
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setError('Please select an image.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('caption', caption);
      formData.append('postImage', imageFile);

      const response = await axiosInstance.post('/post/addpost', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.success) {
        setSuccess('Post created successfully!');
        setTitle('');
        setCaption('');
        setImageFile(null);
        // Add the new post to global posts state
        addPost(response.data.post);
        // Refresh posts list to ensure latest data
        await fetchPosts();
        // Navigate to home page instead of profile
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to create post.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`max-w-lg mx-auto mt-12 p-8 rounded-lg shadow-lg ${darkMode ? 'bg-gray-900 text-yellow-400' : 'bg-white text-gray-900'}`}>
      <h2 className="text-3xl font-extrabold mb-6 text-center">Create New Post</h2>
      {error && <p className="text-red-600 mb-4 text-center font-semibold">{error}</p>}
      {success && <p className="text-green-600 mb-4 text-center font-semibold">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full p-3 rounded border focus:outline-none focus:ring-2 focus:ring-yellow-400 transition ${darkMode ? 'bg-gray-800 border-yellow-400 text-yellow-400 placeholder-yellow-500' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'}`}
          required
        />
        <label
          htmlFor="postImage"
          className={`block w-full h-48 border-4 border-dashed rounded cursor-pointer flex items-center justify-center text-center text-gray-500 hover:text-yellow-400 transition ${darkMode ? 'border-yellow-400' : 'border-gray-300'}`}
        >
          {imageFile ? (
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Selected"
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <span>Click or drag image here to upload</span>
          )}
          <input
            id="postImage"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            required
          />
        </label>
        <textarea
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={3}
          className={`w-full p-3 rounded border resize-vertical focus:outline-none focus:ring-2 focus:ring-yellow-400 transition ${darkMode ? 'bg-gray-800 border-yellow-400 text-yellow-400 placeholder-yellow-500' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'}`}
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded font-bold transition ${darkMode ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-yellow-400 text-black hover:bg-yellow-500'}`}
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
