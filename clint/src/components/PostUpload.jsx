import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const PostUpload = () => {
  const { axiosInstance } = useContext(AuthContext);
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
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
      formData.append('caption', caption);
      formData.append('postImage', image);

      const res = await axiosInstance.post('/post/addpost', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        toast.success('Post uploaded successfully!');
        setCaption('');
        setImage(null);
      } else {
        toast.error('Failed to upload post.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('An error occurred during upload.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 text-yellow-400">
      <h2 className="text-xl font-bold mb-4">Create a New Post</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="text-yellow-400"
        />
        <input
          type="text"
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="p-2 rounded bg-gray-800 text-yellow-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-yellow-400 text-gray-900 px-4 py-2 rounded font-semibold hover:bg-yellow-500 transition"
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
};

export default PostUpload;
