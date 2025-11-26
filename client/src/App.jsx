import React, { useState } from 'react';
import Search from './components/Search';
import JobCard from './components/JobCard';

function App() {
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    setJobData(null);

    try {
      // Fetch from our backend (which serves mock data)
      const response = await fetch(`http://localhost:5000/api/jobs/search?query=${encodeURIComponent(query)}`);
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
    <div className="min-h-screen bg-primary text-white p-6 font-sans selection:bg-accent selection:text-white">
      <div className="max-w-5xl mx-auto pt-20">
        <header className="text-center mb-16">
          <h1 className="text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
            AI Job Market Watch
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover your future in the age of Artificial Intelligence.
            Analyze automation risks and find your human edge.
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
