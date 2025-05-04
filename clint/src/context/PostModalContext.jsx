import React, { createContext, useState, useContext } from 'react';

const PostModalContext = createContext();

export const PostModalProvider = ({ children }) => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const openPostModal = () => {
    console.log('PostModalContext: openPostModal called');
    setIsPostModalOpen(true);
  };
  const closePostModal = () => {
    console.log('PostModalContext: closePostModal called');
    setIsPostModalOpen(false);
  };

  return (
    <PostModalContext.Provider value={{ isPostModalOpen, openPostModal, closePostModal }}>
      {children}
    </PostModalContext.Provider>
  );
};

export const usePostModal = () => {
  const context = useContext(PostModalContext);
  console.log('usePostModal context:', context);
  return context;
};
