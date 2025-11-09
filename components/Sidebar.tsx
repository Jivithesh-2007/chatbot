
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useChat } from '../hooks/useChat';
import { ChatSession } from '../types';
import ThemeToggle from './ThemeToggle';
import { PlusIcon } from './icons/PlusIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { UploadIcon } from './icons/UploadIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { EditIcon } from './icons/EditIcon';
import { DeleteIcon } from './icons/DeleteIcon';
import { SearchIcon } from './icons/SearchIcon';
import { XIcon } from './icons/XIcon';

interface SidebarProps {
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ closeSidebar }) => {
  const { logout } = useAuth();
  const { sessions, activeSessionId, createNewSession, switchSession, deleteSession, renameSession, importChats, exportChats } = useChat();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const handleRename = (session: ChatSession) => {
    setEditingId(session.id);
    setEditingTitle(session.title);
  };

  const handleSaveRename = (sessionId: string) => {
    if (editingTitle.trim()) {
      renameSession(sessionId, editingTitle.trim());
    }
    setEditingId(null);
  };

  const filteredSessions = sessions.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleImportClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        importChats(file);
      }
    };
    fileInput.click();
  };

  return (
    <div className="h-full w-full md:w-64 lg:w-72 bg-white/5 dark:bg-gray-900/30 backdrop-blur-xl border-r border-white/10 dark:border-gray-800 flex flex-col text-gray-300">
      <div className="flex items-center justify-between p-4 border-b border-white/10 dark:border-gray-800">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">MindMingle</h1>
        <button onClick={closeSidebar} className="md:hidden p-1 text-gray-400 hover:text-white">
          <XIcon className="h-6 w-6" />
        </button>
      </div>
      
      <div className="p-2 space-y-2">
        <button onClick={createNewSession} className="flex items-center w-full p-3 rounded-lg text-sm font-semibold bg-white/10 hover:bg-white/20 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors">
          <PlusIcon className="h-5 w-5 mr-3 text-brand-purple" />
          New Chat
        </button>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 dark:bg-gray-800/40 pl-10 pr-4 py-2 rounded-lg border border-transparent focus:border-brand-purple focus:ring-0 focus:outline-none text-sm"
          />
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-2 space-y-1">
        {filteredSessions.map(session => (
          <div key={session.id} className={`group relative p-3 rounded-lg cursor-pointer ${activeSessionId === session.id ? 'bg-brand-purple/20 text-white' : 'hover:bg-white/10 dark:hover:bg-gray-800/60'}`} onClick={() => switchSession(session.id)}>
            {editingId === session.id ? (
              <input
                type="text"
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                onBlur={() => handleSaveRename(session.id)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(session.id)}
                className="w-full bg-transparent text-sm focus:outline-none border-b border-brand-purple"
                autoFocus
              />
            ) : (
              <p className="text-sm truncate">{session.title}</p>
            )}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={(e) => { e.stopPropagation(); handleRename(session); }} className="p-1 hover:text-brand-purple"><EditIcon className="h-4 w-4" /></button>
              <button onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }} className="p-1 hover:text-red-500"><DeleteIcon className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-2 border-t border-white/10 dark:border-gray-800 space-y-1">
        <div className="flex items-center justify-between p-2">
            <span className="text-sm">Theme</span>
            <ThemeToggle />
        </div>
        <button onClick={exportChats} className="flex items-center w-full p-3 rounded-lg text-sm hover:bg-white/10 dark:hover:bg-gray-800/60 transition-colors"><DownloadIcon className="h-5 w-5 mr-3"/>Export Chats</button>
        <button onClick={handleImportClick} className="flex items-center w-full p-3 rounded-lg text-sm hover:bg-white/10 dark:hover:bg-gray-800/60 transition-colors"><UploadIcon className="h-5 w-5 mr-3"/>Import Chats</button>
        <button onClick={logout} className="flex items-center w-full p-3 rounded-lg text-sm hover:bg-white/10 dark:hover:bg-gray-800/60 transition-colors"><LogoutIcon className="h-5 w-5 mr-3"/>Log Out</button>
      </div>
    </div>
  );
};

export default Sidebar;
