import React, { useState, useEffect, useContext } from 'react';
import Post from './post';
import { AuthContext } from '../context/AuthContext';

const Posts = ({ userId }) => {
  const { axiosInstance } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let res;
        if (userId) {
          res = await axiosInstance.get(`/post/user/${userId}`);
        } else {
          res = await axiosInstance.get('/post/all');
        }
        if (res.data.success) {
          // Filter out posts without authors
          const filteredPosts = res.data.posts.filter(post => post.author);
          setPosts(filteredPosts);
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [axiosInstance, userId]);

  if (loading) {
    return <div>Loading posts...</div>;
  }
  return (
    <div>
      {posts.length === 0 ? (
        <div>No posts available.</div>
      ) : (
        posts.map((post) => <Post key={post._id} post={post} showMenu={!!userId} />)
      )}
    </div>
  );
};

export default Posts;