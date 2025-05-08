import LeftSidebar from './components/leftsidebar';
import RightSidebar from './components/rightsidebar';
import { useSidebar } from './context/SidebarContext';

export const DebugLeftSidebar = (props) => {
  console.log('DebugLeftSidebar props.openPostModal:', props.openPostModal);

  const handleSelect = (content) => {
    console.log('LeftSidebar onSelect called with:', content);
    if (props.onSelect) {
      props.onSelect(content);
    }
  };

  return <LeftSidebar {...props} onSelect={handleSelect} openPostModal={props.openPostModal} />;
};

export const DebugMainLayoutContent = () => {
  const { selectedContent, setSelectedContent, openMessages } = useSidebar();

  const handleSelect = (content) => {
    console.log('MainLayout handleSelect called with:', content);
    if (content === 'messages') {
      openMessages(null);
    } else {
      setSelectedContent(content);
    }
  };

  console.log('RightSidebar selectedContent:', selectedContent);

  return (
    <>
      <DebugLeftSidebar onSelect={handleSelect} />
      <RightSidebar selectedContent={selectedContent} />
    </>
  );
};
