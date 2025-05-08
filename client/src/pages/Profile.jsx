import React, { useContext, useEffect, useState } from 'react'
import Posts from '../components/Posts'
import { Share2, Settings as SettingsIcon, MessageSquare } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { ThemeContext } from '../context/ThemeContext'
import { useParams, useNavigate } from 'react-router-dom'
import { useSidebar } from '../context/SidebarContext'
import { usePosts } from '../context/PostsContext'

const Profile = () => {
  const { user: currentUser, axiosInstance } = useContext(AuthContext)
  const { darkMode } = useContext(ThemeContext)
  const { userId: paramUserId } = useParams()
  const navigate = useNavigate()
  const { fetchPosts } = usePosts()

  const [profileUser, setProfileUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)

  // Use paramUserId if present, else currentUser._id
  const userId = paramUserId || (currentUser && currentUser._id)

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      setError(null)
      try {
        if (!userId || userId.length !== 24) {
          setError('Invalid user ID')
          setLoading(false)
          return
        }
        const response = await axiosInstance.get(`/user/${userId}`)
        if (response.data && response.data.success) {
          setProfileUser(response.data.user)
          // Check if currentUser is following profileUser
          if (currentUser && response.data.user.followers) {
            setIsFollowing(response.data.user.followers.some(followerId => followerId === currentUser._id))
          }
        } else {
          setError('User not found')
        }
      } catch (error) {
        setError('Error fetching user profile')
        console.error('Error fetching user profile:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [userId, axiosInstance, currentUser])

  useEffect(() => {
    if (userId) {
      fetchPosts(userId)
    }
  }, [userId, fetchPosts])

  const { openMessages } = useSidebar();

  const handleMessageClick = () => {
    openMessages(userId);
  }

  const handleFollowToggle = async () => {
    if (followLoading) return
    setFollowLoading(true)
    try {
      const response = await axiosInstance.put(`/user/follow/${userId}`)
      if (response.data && response.data.success) {
        if (isFollowing) {
          // Unfollowed
          setProfileUser(prev => ({
            ...prev,
            followers: prev.followers.filter(id => id !== currentUser._id)
          }))
          setIsFollowing(false)
        } else {
          // Followed
          setProfileUser(prev => ({
            ...prev,
            followers: [...(prev.followers || []), currentUser._id]
          }))
          setIsFollowing(true)
        }
      } else {
        alert('Failed to update follow status')
      }
    } catch (error) {
      console.error('Error toggling follow:', error)
      alert('Error updating follow status')
    } finally {
      setFollowLoading(false)
    }
  }

  const handlePostDeleted = () => {
    fetchPosts(userId)
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>
  if (!profileUser) return null

  const isOwnProfile = currentUser && currentUser._id === profileUser._id

  return (
    <div className={`max-w-4xl mx-auto p-6 rounded-lg shadow-lg mt-8 ${darkMode ? 'bg-gray-900 text-yellow-400' : 'bg-white text-gray-900'}`}>
      <div className="flex items-center gap-6 mb-6">
        <img
          src={profileUser.profilePicture || 'https://imgs.search.brave.com/mDztPWayQWWrIPAy2Hm_FNfDjDVgayj73RTnUIZ15L0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzE1Lzg0LzQz/LzM2MF9GXzIxNTg0/NDMyNV90dFg5WWlJ/SXllYVI3TmU2RWFM/TGpNQW15NEd2UEM2/OS5qcGc'}
          alt={`${profileUser.username} avatar`}
          className={`w-24 h-24 rounded-full object-cover border-2 ${darkMode ? 'border-yellow-400' : 'border-gray-300'}`}
        />
        <div>
          <h1 className="text-3xl font-bold">{profileUser.username}</h1>
          <p className={darkMode ? 'text-yellow-300' : 'text-gray-700'}>{profileUser.bio || 'No bio available'}</p>
          <div className={`flex items-center gap-4 mt-2 ${darkMode ? 'text-yellow-300' : 'text-gray-700'}`}>
            <span>{profileUser.followers?.length || 0} Followers</span>
            <span>{profileUser.following?.length || 0} Following</span>
          </div>
        </div>
        {!isOwnProfile && (
          <>
            <button
              onClick={handleFollowToggle}
              disabled={followLoading}
              className={`ml-auto px-4 py-2 rounded-lg font-semibold text-black ${
                isFollowing ? 'bg-gray-400 hover:bg-gray-500' : 'bg-yellow-500 hover:bg-yellow-400'
              } transition flex items-center gap-2`}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
            <button
              onClick={handleMessageClick}
              className="ml-2 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <MessageSquare size={20} />
              Message
            </button>
          </>
        )}
        {isOwnProfile && (
          <button
            onClick={() => navigate('/settings')}
            className="ml-auto bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <SettingsIcon size={20} />
            Settings
          </button>
        )}
      </div>
      <Posts userId={profileUser._id} onPostDeleted={handlePostDeleted} />
    </div>
  )
}

export default Profile
