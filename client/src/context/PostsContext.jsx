import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';

const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const { axiosInstance } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async (userId) => {
    setLoading(true);
    try {
      let res;
      if (userId) {
        res = await axiosInstance.get(`/post/user/${userId}`);
      } else {
        res = await axiosInstance.get('/post/all');
      }
      if (res.data.success) {
        const filteredPosts = res.data.posts.filter(post => post.author);
        filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(filteredPosts);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  }, [axiosInstance]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const addPost = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const removePost = (postId) => {
    setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
  };

  return (
    <PostsContext.Provider value={{ posts, loading, fetchPosts, addPost, removePost }}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
};
