import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { io } from 'socket.io-client';

const Chat = ({ chatPartnerId }) => {
  const { user, axiosInstance } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatPartnerInfo, setChatPartnerInfo] = useState(null);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    if (!socketRef.current) {
      console.log('Connecting to socket.io server');
      // Connect to socket.io server
      socketRef.current = io('http://localhost:8000');

      // Join room for this user
      socketRef.current.emit('join', user._id);
    }

    return () => {
      if (socketRef.current) {
        console.log('Disconnecting from socket.io server');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user]);

  useEffect(() => {
    if (!chatPartnerId) return;

    const fetchChatPartnerInfo = async () => {
      try {
        const res = await axiosInstance.get(`/user/${chatPartnerId}`);
        if (res.data.success) {
          setChatPartnerInfo(res.data.user);
        }
      } catch (error) {
        console.error('Failed to fetch chat partner info:', error);
      }
    };

    fetchChatPartnerInfo();
  }, [chatPartnerId, axiosInstance]);

  useEffect(() => {
    if (!socketRef.current) return;

    const fetchMessages = async () => {
      if (!user || !chatPartnerId) return;
      try {
        const res = await axiosInstance.get(`/message/all/${chatPartnerId}`);
        if (res.data.success) {
          setMessages(res.data.messages || []);
          scrollToBottom();
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    const messageHandler = (message) => {
      setMessages((prev) => {
        if (prev.some((msg) => msg._id === message._id || msg.id === message.id)) {
          fetchMessages();
          return prev;
        }
        return [...prev, message];
      });
      scrollToBottom();
    };

    if (socketRef.current) {
      socketRef.current.on('message', messageHandler);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off('message', messageHandler);
      }
    };
  }, [chatPartnerId, user]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user || !chatPartnerId) return;
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/message/all/${chatPartnerId}`);
        if (res.data.success) {
          setMessages(res.data.messages || []);
          scrollToBottom();
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [chatPartnerId, user, axiosInstance]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '' || !user || !chatPartnerId) return;
    try {
      const res = await axiosInstance.post(`/message/send/${chatPartnerId}`, { message: input });
      if (res.data.success) {
        socketRef.current.emit('sendMessage', res.data.newMessage);
        setMessages((prev) => [...prev, res.data.newMessage]);
        setInput('');
        scrollToBottom();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className={`fixed top-0 right-0 w-[20%] h-screen flex flex-col p-4 border-l ${darkMode ? 'bg-gray-900 text-yellow-400 border-yellow-600' : 'bg-white text-gray-900 border-gray-300'}`}>
      <div className="flex justify-between items-center mb-4">
        {chatPartnerInfo ? (
          <div className="flex items-center gap-3">
            <img src={chatPartnerInfo.profilePicture || chatPartnerInfo.avatar} alt={chatPartnerInfo.username} className="w-10 h-10 rounded-full object-cover" />
            <h2 className="text-xl font-bold">{chatPartnerInfo.username}</h2>
          </div>
        ) : (
          <h2 className="text-xl font-bold">Chat</h2>
        )}
        <button
          onClick={async () => {
            if (!chatPartnerId) return;
            try {
              const res = await axiosInstance.delete(`/message/delete/${chatPartnerId}`);
              if (res.data.success) {
                setMessages([]);
                alert('Conversation deleted successfully');
              }
            } catch (error) {
              console.error('Failed to delete conversation:', error);
              alert('Failed to delete conversation');
            }
          }}
          className={`${darkMode ? 'bg-red-700 hover:bg-red-800' : 'bg-red-600 hover:bg-red-700'} text-white px-3 py-1 rounded`}
        >
          Delete Conversation
        </button>
      </div>
      <div className="flex-1 overflow-y-auto mb-4" ref={messagesEndRef}>
        {loading ? (
          <p>Loading messages...</p>
        ) : (
          <>
            {messages.map((msg, index) => (
              <div key={msg._id ? msg._id : msg.id ? msg.id : index} className={`mb-2 ${msg.senderId === user._id ? 'text-right' : 'text-left'}`}>
                <span className="block font-semibold">{msg.senderId === user._id ? 'You' : chatPartnerInfo?.username || 'Them'}</span>
                <span className={`${darkMode ? 'bg-yellow-700 text-black' : 'bg-gray-200 text-gray-900'} rounded px-3 py-1 inline-block max-w-xs break-words`}>
                  {msg.message}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className={`${darkMode ? 'bg-gray-800 text-yellow-400 placeholder-yellow-600' : 'bg-gray-100 text-gray-900 placeholder-gray-500'} flex-1 p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 transition`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className={`${darkMode ? 'bg-yellow-500 text-black hover:bg-yellow-400' : 'bg-yellow-400 text-black hover:bg-yellow-300'} px-4 rounded font-semibold transition`}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
