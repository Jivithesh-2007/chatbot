
import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '../hooks/useChat';
import { Message as MessageType } from '../types';
import Composer from './Composer';
import Message from './Message';
import { EditIcon } from './icons/EditIcon';

const ChatArea: React.FC = () => {
  const { activeSession, renameSession } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(activeSession?.title || '');

  useEffect(() => {
    setTitle(activeSession?.title || 'New Chat');
  }, [activeSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleTitleSave = () => {
    if (activeSession && title.trim()) {
      renameSession(activeSession.id, title.trim());
    } else {
      setTitle(activeSession?.title || 'New Chat');
    }
    setIsEditingTitle(false);
  };

  if (!activeSession) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-semibold text-gray-500 dark:text-gray-400">Welcome to MindMingle</h2>
        <p className="mt-2 text-gray-400 dark:text-gray-500">Start a new chat from the sidebar to begin.</p>
      </div>
    );
  }

  const isAiTyping = activeSession.messages[activeSession.messages.length - 1]?.isTyping;

  return (
    <div className="flex-1 flex flex-col h-full">
      <header className="flex items-center p-4 bg-white/5 dark:bg-gray-900/30 backdrop-blur-sm border-b border-white/10 dark:border-gray-800 z-10">
        {isEditingTitle ? (
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            onBlur={handleTitleSave}
            onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
            className="bg-transparent text-lg font-semibold focus:outline-none border-b-2 border-brand-purple"
            autoFocus
          />
        ) : (
          <div className="flex items-center group">
            <h2 className="text-lg font-semibold">{activeSession.title}</h2>
            <button onClick={() => setIsEditingTitle(true)} className="ml-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
              <EditIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {activeSession.messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
        {isAiTyping && <Message message={{ id: 'typing', sender: 'ai', content: '', timestamp: '', isTyping: true }} />}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 md:p-6">
        <Composer />
      </footer>
    </div>
  );
};

export default ChatArea;
