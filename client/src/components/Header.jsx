import React from 'react';
import { Moon, Sun, BrainCircuit } from 'lucide-react';

const Header = ({ theme, toggleTheme }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-secondary p-2 rounded-full">
              <BrainCircuit className="w-8 h-8 text-accent" />
            </div>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-text-main to-text-muted">
            AI Job Market Watch
          </span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-secondary/50 hover:bg-secondary border border-white/10 transition-colors group"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-yellow-400 group-hover:rotate-90 transition-transform duration-500" />
          ) : (
            <Moon className="w-5 h-5 text-indigo-400 group-hover:-rotate-12 transition-transform duration-500" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
