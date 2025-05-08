import React from 'react';
import Post from './post';
import { usePosts } from '../context/PostsContext';

const Posts = ({ userId, onPostDeleted }) => {
  const { posts, loading } = usePosts();

  if (loading) {
    return <div>Loading posts...</div>;
  }

  const filteredPosts = userId ? posts.filter(post => post.author && post.author._id === userId) : posts;

  if (filteredPosts.length === 0) {
    return <div>No posts available.</div>;
  }

  return (
    <div>
      {filteredPosts.map((post) => (
        <Post
          key={post._id}
          post={post}
          showMenu={!!userId}
          profileUserId={userId}
          onPostDeleted={onPostDeleted}
        />
      ))}
    </div>
  );
};

export default Posts;
