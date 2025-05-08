import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './leftsidebar'
import RightSidebar from './rightsidebar'
import { ThemeContext } from '../context/ThemeContext'
import PostModal from './PostModal'
import { SidebarProvider, useSidebar } from '../context/SidebarContext'
import { PostModalProvider, usePostModal } from '../context/PostModalContext'
import { DebugLeftSidebar, DebugMainLayoutContent } from '../debugSidebarLogs';

const MainLayoutContent = () => {
  const { selectedContent, setSelectedContent, openMessages } = useSidebar()
  const { darkMode } = useContext(ThemeContext)
  const { isPostModalOpen, closePostModal, openPostModal } = usePostModal()

  const handleSelect = (content) => {
    if (content === 'messages') {
      openMessages(null)
    } else {
      setSelectedContent(content)
    }
  }

  return (
    <div className={`flex min-h-screen ${darkMode ? 'bg-gray-900 text-yellow-400' : 'bg-white text-gray-900'}`}>
      <PostModal isOpen={isPostModalOpen} onClose={closePostModal} />
      <DebugLeftSidebar onSelect={handleSelect} openPostModal={openPostModal} />
      <main className='flex-1 max-w-5xl mx-auto p-6'>
        <Outlet />
      </main>
      <DebugMainLayoutContent />
      <RightSidebar selectedContent={selectedContent} />
    </div>
  )
}

const MainLayout = () => (
  <SidebarProvider>
    <PostModalProvider>
      <MainLayoutContent />
    </PostModalProvider>
  </SidebarProvider>
)

export default MainLayout
