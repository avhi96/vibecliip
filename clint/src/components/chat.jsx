import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Chat = ({ chatPartnerId }) => {
  const { user, axiosInstance } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch messages when chatPartnerId or user changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user || !chatPartnerId) return;
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/api/v1/message/all/${chatPartnerId}`);
        if (res.data.success) {
          setMessages(res.data.messages || []);
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [chatPartnerId, user, axiosInstance]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '' || !user || !chatPartnerId) return;
    try {
      const res = await axiosInstance.post(`/api/v1/message/send/${chatPartnerId}`, { message: input });
      if (res.data.success) {
        setMessages((prev) => [...prev, res.data.newMessage]);
        setInput('');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="fixed top-0 right-0 w-[20%] h-screen bg-gray-900 text-white flex flex-col p-4 border-l border-gray-700">
      <h2 className="text-xl font-bold mb-4">Chat</h2>
      <div className="flex-1 overflow-y-auto mb-4">
        {loading ? (
          <p>Loading messages...</p>
        ) : (
          messages.map((msg) => (
            <div key={msg._id || msg.id} className={`mb-2 ${msg.senderId === user._id ? 'text-right' : 'text-left'}`}>
              <span className="block font-semibold">{msg.senderId === user._id ? 'You' : 'Them'}</span>
              <span className="block bg-gray-700 rounded px-3 py-1 inline-block max-w-xs break-words">{msg.message}</span>
            </div>
          ))
        )}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-2 rounded bg-gray-700 text-white focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="bg-yellow-500 px-4 rounded font-semibold hover:bg-yellow-600 transition">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
