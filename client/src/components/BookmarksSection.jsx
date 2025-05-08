import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Post from './post';
import { toast } from 'react-toastify';

const BookmarksSection = () => {
  const { user, token } = useContext(AuthContext);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      // Assuming backend has an endpoint to get user's bookmarks
      const res = await axios.get(`http://localhost:8000/api/v1/user/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        setBookmarkedPosts(res.data.user.bookmarks || []);
      } else {
        toast.error('Failed to load bookmarks');
      }
    } catch {
      toast.error('Error loading bookmarks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchBookmarks();
    }
  }, [user, token]);

  const handleRemoveBookmark = async (postId) => {
    try {
      const res = await axios.put(`http://localhost:8000/api/v1/post/bookmark/${postId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        toast.success(res.data.message);
        // Refresh bookmarks
        fetchBookmarks();
      } else {
        toast.error('Failed to remove bookmark');
      }
    } catch {
      toast.error('Error removing bookmark');
    }
  };

  if (loading) {
    return <div>Loading bookmarks...</div>;
  }

  if (bookmarkedPosts.length === 0) {
    return <div>No bookmarks found.</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Bookmarked Posts</h2>
      <div className="space-y-4">
        {bookmarkedPosts.map((post) => (
          <div key={post._id} className="relative">
            <Post post={post} />
            <button
              onClick={() => handleRemoveBookmark(post._id)}
              className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
            >
              Remove Bookmark
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookmarksSection;
