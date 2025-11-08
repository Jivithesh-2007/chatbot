
import React from 'react';
import AuthScreen from './components/AuthScreen';
import ChatInterface from './components/ChatInterface';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ChatProvider } from './hooks/useChat';
import { ThemeProvider, useTheme } from './hooks/useTheme';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

const AppContent: React.FC = () => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();

  return (
    <div className={`${theme} transition-colors duration-500`}>
      <div className="bg-gray-100 dark:bg-black text-gray-800 dark:text-gray-200 min-h-screen">
        {currentUser ? (
          <ChatProvider>
            <ChatInterface />
          </ChatProvider>
        ) : (
          <AuthScreen />
        )}
      </div>
    </div>
  );
};

export default App;
