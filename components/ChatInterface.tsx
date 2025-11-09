
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import { MenuIcon } from './icons/MenuIcon';

const ChatInterface: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-gray-100 dark:bg-black overflow-hidden">
      <div className={`fixed inset-y-0 left-0 z-30 transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:w-64 lg:w-72`}>
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col w-full">
        <div className="md:hidden flex items-center p-2 bg-white/5 dark:bg-gray-900/30 backdrop-blur-sm border-b border-white/10 dark:border-gray-800">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700">
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
        <ChatArea />
      </div>
      
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-20 md:hidden" onClick={() => setSidebarOpen(false)}></div>}
    </div>
  );
};

export default ChatInterface;
