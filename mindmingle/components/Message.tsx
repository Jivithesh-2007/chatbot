
import React, { useState, useEffect } from 'react';
import { Message as MessageType } from '../types';

interface MessageProps {
  message: MessageType;
}

const TypingIndicator = () => (
  <div className="flex items-center space-x-1 p-3">
    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
  </div>
);

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const [displayedContent, setDisplayedContent] = useState('');

  useEffect(() => {
    if (!isUser && !message.isTyping) {
      let i = 0;
      setDisplayedContent('');
      const timer = setInterval(() => {
        setDisplayedContent(prev => prev + message.content.charAt(i));
        i++;
        if (i === message.content.length) {
          clearInterval(timer);
        }
      }, 20); // Typing speed
      return () => clearInterval(timer);
    } else {
        setDisplayedContent(message.content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message.content, message.isTyping, isUser]);

  const avatar = (char: string) => (
    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center font-bold text-white ${isUser ? 'bg-indigo-500' : 'bg-purple-500'}`}>
      {char}
    </div>
  );

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {avatar(isUser ? 'U' : 'M')}
      <div className={`max-w-xs md:max-w-md lg:max-w-2xl flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-4 py-3 rounded-2xl ${isUser ? 'bg-gradient-to-r from-brand-purple to-indigo-600 text-white rounded-br-none' : 'bg-white/10 dark:bg-gray-800/80 rounded-bl-none'}`}>
          {message.isTyping ? <TypingIndicator /> : <p className="text-sm whitespace-pre-wrap">{displayedContent}</p>}
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
        </p>
      </div>
    </div>
  );
};

export default Message;
