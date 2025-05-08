import React, { createContext, useContext, useState, useCallback } from 'react';

const PostModalContext = createContext();

export const PostModalProvider = ({ children }) => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const openPostModal = useCallback(() => {
    console.log('openPostModal called');
    setIsPostModalOpen(true);
  }, []);

  const closePostModal = useCallback(() => {
    console.log('closePostModal called');
    setIsPostModalOpen(false);
  }, []);

  return (
    <PostModalContext.Provider value={{ isPostModalOpen, openPostModal, closePostModal }}>
      {children}
    </PostModalContext.Provider>
  );
};

export const usePostModal = () => {
  const context = useContext(PostModalContext);
  if (!context) {
    throw new Error('usePostModal must be used within a PostModalProvider');
  }
  return context;
};
