import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import Feed from '../components/feed'
import RightSidebar from '../components/rightsidebar'
import LeftSidebar from '../components/leftsidebar'
import { usePostModal } from '../context/PostModalContext'

const Home = () => {
  const { openPostModal } = usePostModal()

  return (
    <div className='flex'>
      <LeftSidebar openPostModal={openPostModal} />
      <div className='flex-grow'>
        <Feed />
        <Outlet />
      </div>
      <RightSidebar selectedContent="messages" openPostModal={openPostModal} />
    </div>
  )
}

export default Home
