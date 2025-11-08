import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ChatSession, Message } from '../types';
import { useAuth } from './useAuth';
import { generateAiResponse } from '../services/aiService';
import { downloadJson, readJsonFile } from '../utils/fileUtils';

interface ChatContextType {
  sessions: ChatSession[];
  activeSession: ChatSession | null;
  activeSessionId: string | null;
  createNewSession: () => void;
  switchSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  renameSession: (sessionId: string, newTitle: string) => void;
  sendMessage: (content: string) => void;
  exportChats: () => void;
  importChats: (file: File) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const getStorageKey = useCallback(() => `mindmingle-chats-${currentUser?.username}`, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      const savedChats = localStorage.getItem(getStorageKey());
      const loadedSessions = savedChats ? JSON.parse(savedChats) : [];
      setSessions(loadedSessions);
      if (loadedSessions.length > 0) {
        setActiveSessionId(loadedSessions[0].id);
      } else {
        createNewSession();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, getStorageKey]);
  
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(getStorageKey(), JSON.stringify(sessions));
    } else {
      localStorage.removeItem(getStorageKey());
    }
  }, [sessions, getStorageKey]);

  const createNewSession = useCallback(() => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  }, []);

  const switchSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
  };
  
  const deleteSession = (sessionId: string) => {
    setSessions(prev => {
      const newSessions = prev.filter(s => s.id !== sessionId);
      if (activeSessionId === sessionId) {
        setActiveSessionId(newSessions.length > 0 ? newSessions[0].id : null);
      }
      if (newSessions.length === 0) {
        createNewSession();
      }
      return newSessions;
    });
  };

  const renameSession = (sessionId: string, newTitle: string) => {
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, title: newTitle } : s));
  };
  
  const updateMessages = (sessionId: string, updater: (messages: Message[]) => Message[]) => {
      setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, messages: updater(s.messages) } : s));
  };

  // FIX: Updated sendMessage to pass conversation history to the AI for contextual responses.
  const sendMessage = async (content: string) => {
    if (!activeSessionId) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    
    const currentSession = sessions.find(s => s.id === activeSessionId);
    const history = currentSession?.messages || [];

    updateMessages(activeSessionId, messages => [...messages, userMessage]);

    // FIX: Auto-generate title from first message using history.
    if (history.length === 0) {
        const newTitle = content.split(' ').slice(0, 5).join(' ');
        renameSession(activeSessionId, newTitle.length > 30 ? newTitle.substring(0, 27) + '...' : newTitle);
    }
    
    // AI response
    const aiTypingMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        content: '',
        timestamp: new Date().toISOString(),
        isTyping: true,
    };
    updateMessages(activeSessionId, messages => [...messages, aiTypingMessage]);

    const fullResponse = await generateAiResponse(history, content);
    
    const aiResponseMessage: Message = {
        ...aiTypingMessage,
        content: fullResponse,
        isTyping: false,
    };
    updateMessages(activeSessionId, messages => messages.map(m => m.id === aiTypingMessage.id ? aiResponseMessage : m));
  };

  const exportChats = () => {
    downloadJson(sessions, `mindmingle-chats-${currentUser?.username}.json`);
  };

  const importChats = async (file: File) => {
    try {
      const importedSessions = await readJsonFile(file) as ChatSession[];
      // Basic validation
      if (Array.isArray(importedSessions) && importedSessions.every(s => s.id && s.title && s.messages)) {
        setSessions(importedSessions);
        if (importedSessions.length > 0) {
          setActiveSessionId(importedSessions[0].id);
        }
      } else {
        alert('Invalid chat file format.');
      }
    } catch (error) {
      alert('Error importing chats. Please check the file.');
      console.error('Import error:', error);
    }
  };

  const activeSession = sessions.find(s => s.id === activeSessionId) || null;

  // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
  return React.createElement(ChatContext.Provider, { value: { sessions, activeSession, activeSessionId, createNewSession, switchSession, deleteSession, renameSession, sendMessage, exportChats, importChats } }, children);
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
