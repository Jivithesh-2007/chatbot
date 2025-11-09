import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => void;
  signup: (username: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A simple mock of hashing. In a real app, use a library like bcrypt.
const simpleHash = async (text: string) => text;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('mindmingle-currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (username: string, password: string) => {
    const users: User[] = JSON.parse(localStorage.getItem('mindmingle-users') || '[]');
    const user = users.find(u => u.username === username);
    const passwordHash = await simpleHash(password);

    if (user && user.passwordHash === passwordHash) {
      setCurrentUser(user);
      localStorage.setItem('mindmingle-currentUser', JSON.stringify(user));
    } else {
      throw new Error('Invalid username or password');
    }
  };

  const signup = async (username: string, password: string) => {
    if (!username || !password) throw new Error('Username and password are required.');
    
    const users: User[] = JSON.parse(localStorage.getItem('mindmingle-users') || '[]');
    if (users.some(u => u.username === username)) {
      throw new Error('Username already exists');
    }
    const passwordHash = await simpleHash(password);
    const newUser: User = { username, passwordHash };
    users.push(newUser);
    localStorage.setItem('mindmingle-users', JSON.stringify(users));
    
    // Automatically log in after signup
    setCurrentUser(newUser);
    localStorage.setItem('mindmingle-currentUser', JSON.stringify(newUser));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('mindmingle-currentUser');
  };
  
  // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
  return React.createElement(AuthContext.Provider, { value: { currentUser, login, signup, logout } }, children);
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
