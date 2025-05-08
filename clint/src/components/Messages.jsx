

import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useSidebar } from '../context/SidebarContext'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'

const Messages = () => {
  const { axiosInstance } = useContext(AuthContext)
  const { openMessages } = useSidebar()
  const [conversations, setConversations] = useState([])

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axiosInstance.get('/message/conversations')
        if (res.data.success) {
          setConversations(res.data.conversations)
        }
      } catch (error) {
        console.error('Failed to fetch conversations:', error)
      }
    }
    fetchConversations()
  }, [axiosInstance])

  return (
    <div className="p-4 text-yellow-400 flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-4">Chats</h2>
      <div className="flex-1 overflow-y-auto mb-4 border border-yellow-400 rounded p-2">
        {conversations.length === 0 ? (
          <p>No conversations found.</p>
        ) : (
          conversations.map(({ chatPartner }) => (
            chatPartner ? (
              <div
                key={chatPartner._id}
                className="mb-3 flex items-center gap-3 cursor-pointer hover:bg-yellow-700 rounded p-2"
                onClick={() => openMessages(chatPartner._id)}
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={chatPartner.profilePicture || chatPartner.avatar} alt={chatPartner.username} className="w-8 h-8 rounded-full object-cover" />
                  <AvatarFallback className="bg-yellow-400 text-black font-bold w-8 h-8 flex items-center justify-center rounded-full">
                    {chatPartner.username?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span>{chatPartner.username}</span>
              </div>
            ) : null
          ))
        )}
      </div>
    </div>
  )
}

export default Messages
