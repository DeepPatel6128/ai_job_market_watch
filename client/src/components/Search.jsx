import React, { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';

const Search = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-12">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex items-center bg-secondary rounded-lg p-2">
          <SearchIcon className="w-6 h-6 text-gray-400 ml-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a job title (e.g., Software Engineer)..."
            className="w-full bg-transparent text-white placeholder-gray-400 px-4 py-2 focus:outline-none text-lg"
          />
          <button
            type="submit"
            className="bg-accent hover:bg-sky-500 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            Analyze
          </button>
        </div>
      </div>
    </form>
  );
};

export default Search;
