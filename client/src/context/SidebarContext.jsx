import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const { user, axiosInstance } = useContext(AuthContext);

  const [selectedContent, setSelectedContent] = useState('messages');
  const [chatUserId, setChatUserId] = useState(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;
      try {
        const res = await axiosInstance.get('/message/conversations');
        if (
          res.data.success &&
          res.data.conversations.length > 0 &&
          res.data.conversations[0].chatPartner
        ) {
          setChatUserId(res.data.conversations[0].chatPartner._id);
          setSelectedContent('messages');
          setIsNotificationsOpen(false);
        }
      } catch (error) {
        console.error('Failed to fetch conversations in SidebarContext:', error);
      }
    };
    fetchConversations();
  }, [user, axiosInstance]);

  const openMessages = (userId) => {
    setChatUserId(userId);
    setSelectedContent('messages');
    setIsNotificationsOpen(false);
  };

  const openNotifications = () => {
    setIsNotificationsOpen(true);
    setSelectedContent(null);
    setChatUserId(null);
  };

  const closeNotifications = () => {
    setIsNotificationsOpen(false);
  };

  return (
    <SidebarContext.Provider
      value={{
        selectedContent,
        setSelectedContent,
        chatUserId,
        openMessages,
        isNotificationsOpen,
        openNotifications,
        closeNotifications,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
