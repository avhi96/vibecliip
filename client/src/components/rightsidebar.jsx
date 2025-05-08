import React, { useContext } from 'react'
import Messages from './Messages'
import Chat from './chat'
import Notifications from './Notifications'
import Explore from '../pages/Explore'
import { useSidebar } from '../context/SidebarContext'
import { ThemeContext } from '../context/ThemeContext'

const RightSidebar = () => {
  const { selectedContent, chatUserId, isNotificationsOpen } = useSidebar()
  const { darkMode } = useContext(ThemeContext)

  const renderContent = () => {
    if (isNotificationsOpen) {
      return <Notifications />
    }
    if (chatUserId) {
      return <Chat chatPartnerId={chatUserId} />
    }
    switch (selectedContent) {
      case 'messages':
        return <Messages />
      case 'notifications':
        return <Notifications />
      case 'explore':
        return <Explore />
      // other cases...
      default:
        return <div className="p-4 text-white">Select an item from the left sidebar</div>
    }
  }

  return (
    <div className={`fixed top-0 right-0 w-[20%] h-screen overflow-y-auto border-l ${
      darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
    }`}>
      {renderContent()}
    </div>
  )
}

export default RightSidebar
