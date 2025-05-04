import React from 'react'

const RightSidebar = ({ selectedContent, openPostModal }) => {

  const renderContent = () => {
    switch (selectedContent) {
      case 'messages':
        return <div className="p-4 text-white">Messages content here</div>
      case 'notifications':
        return <div className="p-4 text-white">Notifications content here</div>
      case 'explore':
        return <div className="p-4 text-white">Explore content here</div>
      case 'profile':
        return <div className="p-4 text-white">Profile content here</div>
      case 'home':
        return <div className="p-4 text-white">Home content here</div>
      case 'search':
        return <div className="p-4 text-white">Search content here</div>
      case 'create':
        return (
          <div className="p-4 text-white">
            <button
              onClick={openPostModal}
              className="bg-yellow-400 text-gray-900 px-4 py-2 rounded font-semibold hover:bg-yellow-500 transition"
            >
              Create Post
            </button>
          </div>
        )
      case 'likes':
        return <div className="p-4 text-white">Likes content here</div>
      default:
        return <div className="p-4 text-white">Select an item from the left sidebar</div>
    }
  }

  return (
    <div className="fixed top-0 right-0 w-[20%] h-screen bg-gray-900 border-l border-gray-700 overflow-y-auto">
      {renderContent()}
    </div>
  )
}

export default RightSidebar
