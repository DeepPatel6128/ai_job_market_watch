import React, { useState, useEffect } from 'react';
import Search from './components/Search';
import JobCard from './components/JobCard';
import Header from './components/Header';

function App() {
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Check system preference or saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    // Apply theme class to html element
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    setJobData(null);

    try {
      const response = await fetch(`/api/jobs/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();

      if (data.length > 0) {
        setJobData(data[0]); // Just show the first match for now
      } else {
        setError('No data found for this job title. Try "Software Engineer" or "Graphic Designer".');
      }
    } catch (err) {
      setError('Error connecting to server. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary text-text-main font-sans selection:bg-accent selection:text-white transition-colors duration-300">
      <Header theme={theme} toggleTheme={toggleTheme} />

      <div className="max-w-5xl mx-auto pt-32 px-6 pb-12">
        <header className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
            Discover your future<br />in the age of AI
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Analyze automation risks, explore timeline predictions, and find your unique
            <span className="text-accent font-semibold"> Human Edge</span>.
          </p>
        </header>

        <Search onSearch={handleSearch} />

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-gray-400">Analyzing market trends...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-red-400 bg-red-900/20 rounded-lg border border-red-900/50">
            {error}
          </div>
        )}

        {jobData && <JobCard job={jobData} />}
      </div>
    </div>
  );
}

export default App;
