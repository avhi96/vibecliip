import React, { useContext } from 'react'
import {
  Heart, Home, MessageCircle,
  Search, TrendingUp, PlusSquare, LogOut
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AuthContext } from '../context/AuthContext'
import { ThemeContext } from '../context/ThemeContext'

const LeftSidebar = ({ onSelect }) => {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const { darkMode } = useContext(ThemeContext)

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
  const containerClass = `fixed top-0 z-10 left-0 px-4 border-r ${darkMode ? 'border-yellow-400 bg-gray-900 text-yellow-400' : 'border-gray-300 bg-white text-yellow-700'} w-[16%] h-screen flex flex-col justify-between overflow-y-auto`

  const handleSelect = (content) => {
    if (typeof onSelect === 'function') {
      onSelect(content)
    }
  }

  return (
    <div className={containerClass}>
      <div>
        <div className="flex items-center justify-around mt-4 mb-2">
          <img src="logo.png" alt=""  className='w-24'/>
          <h1 className={`${darkMode ? 'text-yellow-400' : 'text-yellow-700'} my-8 pr-14 font-bold text-2xl cursor-default`}>VibeClip</h1>
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
            onClick={() => handleSelect('explore')}
            className={`${baseClass} ${hoverClass}`}
          >
            <TrendingUp />
            <span>Explore</span>
          </div>
          <div
            onClick={() => navigate('/create-post')}
            className={`${baseClass} ${hoverClass}`}
          >
            <PlusSquare />
            <span>Post</span>
          </div>
          <div
            onClick={() => handleSelect('notifications')}
            className={`${baseClass} ${hoverClass}`}
          >
            <Heart />
            <span>Notifications</span>
          </div>
          <div
            onClick={() => {
              navigate('/messages');
              handleSelect('messages');
            }}
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
            <AvatarImage src={user?.avatar || user?.profilePicture || "https://imgs.search.brave.com/mDztPWayQWWrIPAy2Hm_FNfDjDVgayj73RTnUIZ15L0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzE1Lzg0LzQz/LzM2MF9GXzIxNTg0/NDMyNV90dFg5WWlJ/SXllYVI3TmU2RWFM/TGpNQW15NEd2UEM2/OS5qcGc"} alt={user?.username || "User"} className='rounded-full w-10 h-10 object-cover' />
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
