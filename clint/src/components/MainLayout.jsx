import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './leftsidebar'
import RightSidebar from './rightsidebar'
import { ThemeContext } from '../context/ThemeContext'
import PostModal from './PostModal'
import { PostModalProvider, usePostModal } from '../context/PostModalContext'

const MainLayoutContent = () => {
  const [selectedContent, setSelectedContent] = React.useState('home')
  const { darkMode } = useContext(ThemeContext)
  const { isPostModalOpen, openPostModal, closePostModal } = usePostModal()

  React.useEffect(() => {
    console.log('Post modal open state:', isPostModalOpen)
  }, [isPostModalOpen])

  return (
    <div className={`flex min-h-screen ${darkMode ? 'bg-gray-900 text-yellow-400' : 'bg-white text-gray-900'}`}>
      {isPostModalOpen && <PostModal onClose={closePostModal} />}
      <PostModal isOpen={isPostModalOpen} onClose={closePostModal} />

      <LeftSidebar onSelect={setSelectedContent} openPostModal={openPostModal} />
      <main className='flex-1 max-w-5xl mx-auto p-6'>
        <Outlet />
      </main>
      <RightSidebar selectedContent={selectedContent} openPostModal={openPostModal} />
    </div>
  )
}

const MainLayout = () => (
  <PostModalProvider>
    <MainLayoutContent />
  </PostModalProvider>
)

export default MainLayout
