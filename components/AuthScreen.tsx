
import React, { useState, FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from './ThemeToggle';

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, signup } = useAuth();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isLogin) {
        login(username, password);
      } else {
        signup(username, password);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-black dark:to-gray-900 p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md p-8 space-y-8 bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl border border-white/20 dark:border-gray-700 rounded-2xl shadow-glow-purple-md transition-all duration-500">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            MindMingle
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Your futuristic conversational companion</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-gray-200/50 dark:bg-black/50 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple transition"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-200/50 dark:bg-black/50 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple transition"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="flex flex-col space-y-3">
            <button
              type="submit"
              className="w-full py-3 text-white font-semibold bg-gradient-to-r from-brand-purple to-indigo-600 rounded-lg hover:opacity-90 active:scale-95 transition-all duration-300 shadow-lg shadow-purple-500/30"
            >
              {isLogin ? 'Log In' : 'Sign Up'}
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="w-full text-sm text-gray-500 dark:text-gray-400 hover:text-brand-purple dark:hover:text-brand-purple transition"
            >
              {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Log In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthScreen;
