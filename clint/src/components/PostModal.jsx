import React, { useState, useContext, useRef } from 'react';

import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const PostModal = ({ isOpen, onClose }) => {
  const { axiosInstance } = useContext(AuthContext);
  const [caption, setCaption] = useState('');
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleBoxClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error('Please select an image to upload.');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('caption', caption);
      formData.append('postImage', image);

      const res = await axiosInstance.post('/post/addpost', formData, {

        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success('Post uploaded successfully!');
        setCaption('');
        setImage(null);
        onClose();
      } else {
        toast.error(res.data.message || 'Failed to upload post.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'An error occurred during upload.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-yellow-400 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create a New Post</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Title"
            
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 rounded bg-gray-800 text-yellow-400 focus:outline-none"
          />

          <div
            onClick={handleBoxClick}
            className="border-2 border-yellow-400 rounded-lg p-10 text-center cursor-pointer hover:bg-yellow-500 hover:text-gray-900 transition"
          >
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="Selected"
                className="mx-auto max-h-48 object-contain"
              />
            ) : (
              <p>Click here to upload an image</p>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="hidden"
          />

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-400 text-gray-900 px-4 py-2 rounded font-semibold hover:bg-yellow-500 transition"
            >
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostModal;
