import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Post from '../components/post';

const Explore = () => {
  const { axiosInstance } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPosts([]);
      return;
    }

    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get('/post/all');
        if (res.data && res.data.success) {
          setPosts(res.data.posts);
          setHasFetched(true);
        } else {
          setError('Failed to load posts');
        }
      } catch (err) {
        setError('Error loading posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (!hasFetched) {
      fetchPosts();
    } else {
      const lowerSearch = searchTerm.toLowerCase();
      setFilteredPosts(posts.filter(post =>
        post.title?.toLowerCase().includes(lowerSearch)
      ));
    }
  }, [searchTerm, axiosInstance, posts, hasFetched]);

  useEffect(() => {
    if (hasFetched && searchTerm.trim() !== '') {
      const lowerSearch = searchTerm.toLowerCase();
      setFilteredPosts(posts.filter(post =>
        post.title?.toLowerCase().includes(lowerSearch)
      ));
    }
  }, [posts, searchTerm, hasFetched]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-yellow-400 mb-4">Explore</h1>
      <input
        type="text"
        placeholder="Search posts by title..."
        className="w-full p-2 mb-6 rounded border border-yellow-400 bg-gray-900 text-yellow-400 focus:outline-none"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {loading && <p className="text-white">Loading posts...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && filteredPosts.length === 0 && searchTerm.trim() !== '' && (
        <p className="text-white">No posts found.</p>
      )}
      <div className="space-y-8">
        {filteredPosts.map((post) => (
          <Post key={post._id || post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Explore;
