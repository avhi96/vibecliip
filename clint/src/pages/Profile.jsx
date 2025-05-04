import React, { useContext, useEffect, useState } from 'react'
import Posts from '../components/Posts'
import { Share2, Settings as SettingsIcon, MessageSquare } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { useParams, useNavigate } from 'react-router-dom'

const Profile = () => {
  const { user: currentUser, axiosInstance } = useContext(AuthContext)
  const { userId: paramUserId } = useParams()
  const navigate = useNavigate()

  const [profileUser, setProfileUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
  }, [userId, axiosInstance])

  const handleMessageClick = () => {
    navigate(`/chat/${userId}`)
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>
  if (!profileUser) return null

  const isOwnProfile = currentUser && currentUser._id === profileUser._id

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-yellow-400 rounded-lg shadow-lg mt-8">
      <div className="flex items-center gap-6 mb-6">
        <img
          src={profileUser.profilePicture || '/default-avatar.png'}
          alt={`${profileUser.username} avatar`}
          className="w-24 h-24 rounded-full object-cover border-2 border-yellow-400"
        />
        <div>
          <h1 className="text-3xl font-bold">{profileUser.username}</h1>
          <p className="text-yellow-300">{profileUser.bio || 'No bio available'}</p>
          <div className="flex items-center gap-4 mt-2">
            <span>{profileUser.followers?.length || 0} Followers</span>
            <span>{profileUser.following?.length || 0} Following</span>
          </div>
        </div>
        {!isOwnProfile && (
          <button
            onClick={handleMessageClick}
            className="ml-auto bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <MessageSquare size={20} />
            Message
          </button>
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
      <Posts userId={profileUser._id} />
    </div>
  )
}

export default Profile
