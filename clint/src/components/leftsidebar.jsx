import React, { useContext } from 'react'
import {
  Heart, Home, MessageCircle,
  Search, TrendingUp, PlusSquare, LogOut, Sun, Moon
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ThemeContext } from '../context/ThemeContext'
import { AuthContext } from '../context/AuthContext'

const LeftSidebar = ({ onSelect, openPostModal }) => {
  console.log('LeftSidebar openPostModal prop:', openPostModal, 'type:', typeof openPostModal)
  const navigate = useNavigate()
  const { darkMode, toggleTheme } = useContext(ThemeContext)
  const { user } = useContext(AuthContext)

  const logoutHandler = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/auth/logout', {
        withCredentials: true,
      });
      if (res.data.success) {
        navigate('/login');
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Logout failed');
    }
  };

  const baseClass = 'flex items-center gap-4 relative cursor-pointer rounded-lg p-3 my-3 transition'
  const hoverClass = darkMode ? 'hover:bg-yellow-700 text-yellow-400' : 'hover:bg-yellow-300 text-yellow-700'
  const containerClass = darkMode ? 'fixed top-0 z-10 left-0 px-4 border-r border-yellow-400 w-[16%] h-screen bg-gray-900 flex flex-col justify-between overflow-y-auto' : 'fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen bg-white flex flex-col justify-between overflow-y-auto'

  return (
    <div className={containerClass}>
      <div>
        <div className="flex items-center justify-around mt-4 mb-2">
          <h1 className={`my-8 pl-3 font-bold text-2xl cursor-default ${darkMode ? 'text-yellow-400' : 'text-gray-900'}`}>VibeClip</h1>
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-2 px-3 py-2 rounded-md border border-yellow-400 mx-3 hover:bg-yellow-400 hover:text-gray-900 transition ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        <div>
          <div
            onClick={() => {
              navigate('/');
            }}
            className={`${baseClass} ${hoverClass}`}
          >
            <Home />
            <span>Home</span>
          </div>
          <div
            onClick={() => navigate('/search')}
            className={`${baseClass} ${hoverClass}`}
          >
            <Search />
            <span>Search</span>
          </div>
          <div
            onClick={() => onSelect('explore')}
            className={`${baseClass} ${hoverClass}`}
          >
            <TrendingUp />
            <span>Explore</span>
          </div>
          <div
            onClick={() => {
              console.log('Post button clicked')
              if (typeof openPostModal === 'function') {
                openPostModal()
              } else {
                console.error('openPostModal is not a function')
              }
            }}
            className={`${baseClass} ${hoverClass}`}
          >
            <PlusSquare />
            <span>Post</span>
          </div>
          <div
            onClick={() => onSelect('likes')}
            className={`${baseClass} ${hoverClass}`}
          >
            <Heart />
            <span>Likes</span>
          </div>
          <div
            onClick={() => onSelect('messages')}
            className={`${baseClass} ${hoverClass}`}
          >
            <MessageCircle />
            <span>Messages</span>
          </div>
        </div>
      </div>
      <div className="mb-8">
        <div
          onClick={() => navigate('/profile')}
          className={`${baseClass} ${hoverClass} flex items-center gap-4 mx-3 rounded-md justify-center cursor-pointer`}
        >
          <Avatar className='w-10 h-10'>
            <AvatarImage src={user?.avatar || user?.profilePicture || "https://github.com/shadcn.png"} alt={user?.username || "User"} className='rounded-full w-10 h-10 object-cover' />
            <AvatarFallback className='w-10 h-10 flex items-center justify-center rounded-full bg-yellow-400 text-black font-bold'>
              {user?.username?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <span>Profile</span>
        </div>
        <div
          onClick={logoutHandler}
          className={`${baseClass} ${hoverClass} mx-3 rounded-md justify-center cursor-pointer`}
        >
          <LogOut />
          <span>Logout</span>
        </div>
      </div>
    </div>
  )
}

export default LeftSidebar
