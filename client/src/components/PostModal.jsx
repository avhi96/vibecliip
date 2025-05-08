import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const PostModal = ({ isOpen, onClose }) => {
  const { axiosInstance } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

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
        setTitle('');
        setCaption('');
        setImageFile(null);
        onClose();
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
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      color: 'white',
      fontSize: '16px',
    }}>
      <div style={{
        backgroundColor: '#222',
        padding: '20px',
        borderRadius: '8px',
        minWidth: '320px',
        maxWidth: '90%',
        textAlign: 'center',
      }}>
        <h2 style={{ marginBottom: '10px' }}>Create New Post</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: 'none' }}
          />
          <textarea
            placeholder="Caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
            style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: 'none', resize: 'vertical' }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginBottom: '10px' }}
          />
          {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                backgroundColor: '#555',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                backgroundColor: '#fbbf24',
                color: 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              disabled={loading}
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostModal;
