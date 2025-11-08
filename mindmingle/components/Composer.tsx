
import React, { useState, KeyboardEvent } from 'react';
import { useChat } from '../hooks/useChat';
import { SendIcon } from './icons/SendIcon';

const Composer: React.FC = () => {
  const [message, setMessage] = useState('');
  const { sendMessage } = useChat();

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className="relative">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Ask MindMingle anything..."
        className="w-full h-12 p-3 pr-14 text-sm resize-none bg-white/10 dark:bg-gray-900/50 backdrop-blur-md border border-white/20 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple transition-all duration-300"
        rows={1}
      />
      <button
        onClick={handleSend}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-brand-purple text-white rounded-lg hover:opacity-90 active:scale-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!message.trim()}
      >
        <SendIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Composer;
