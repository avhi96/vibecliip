import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const FollowButton = ({ authorId, axiosInstance }) => {
  const { followedUserIds, addFollowedUserId, removeFollowedUserId } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const isFollowing = followedUserIds.includes(authorId);

  const handleFollowToggle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.put(`/user/follow/${authorId}`);
      if (response.data && response.data.success) {
        if (isFollowing) {
          removeFollowedUserId(authorId);
        } else {
          addFollowedUserId(authorId);
        }
      } else {
        alert('Failed to update follow status');
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      alert('Error updating follow status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollowToggle}
      disabled={loading}
      className={`ml-4 px-3 py-1 rounded-lg font-semibold transition ${
        isFollowing ? 'bg-gray-400 text-black hover:bg-gray-500' : 'bg-yellow-500 text-black hover:bg-yellow-400'
      }`}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
};

export default FollowButton;
