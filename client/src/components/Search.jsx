import { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';

const Search = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-12 relative z-10">
      <div className="relative group">
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-500 group-hover:duration-200"></div>

        {/* Input Container */}
        <div className="relative flex items-center bg-secondary/80 backdrop-blur-xl border border-white/10 rounded-xl p-2 shadow-2xl transition-all duration-300">
          <SearchIcon className="w-6 h-6 text-text-muted ml-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a job title (e.g., Software Engineer)..."
            className="w-full bg-transparent text-text-main placeholder-text-muted px-4 py-3 focus:outline-none text-lg font-medium"
          />
          <button
            type="submit"
            className="bg-accent hover:brightness-110 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-accent/20 active:scale-95"
          >
            Analyze
          </button>
        </div>
      </div>
    </form>
  );
};

export default Search;
