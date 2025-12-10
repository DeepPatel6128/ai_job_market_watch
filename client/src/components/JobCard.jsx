import React from 'react';
import { AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import ImpactChart from './ImpactChart';

const JobCard = ({ job }) => {
  if (!job) return null;

  const getRiskColor = (score) => {
    if (score >= 80) return 'text-red-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-green-500';
  };

  // Helper to safely get text from prediction
  const getPredText = (pred) => {
    if (typeof pred === 'string') return pred;
    if (typeof pred === 'object' && pred.text) return pred.text;
    return 'No prediction available';
  };

  return (
    <div className="bg-secondary/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10 animate-fade-in-up hover:border-accent/30 transition-all duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
        <div>
          <h2 className="text-4xl font-bold text-text-main mb-2 tracking-tight">{job.title}</h2>
          <span className="inline-block px-3 py-1 rounded-full bg-primary text-text-muted text-sm font-medium uppercase tracking-wider border border-white/5">
            {job.field}
          </span>
        </div>
        <div className="flex items-center gap-4 bg-primary/50 p-4 rounded-xl border border-white/5">
          <div className="text-right">
            <div className="text-xs text-text-muted uppercase font-bold tracking-wider mb-1">Automation Risk</div>
            <div className={`text-4xl font-black ${getRiskColor(job.automationScore)}`}>
              {job.automationScore}%
            </div>
          </div>
          <div className={`h-12 w-1 rounded-full ${job.automationScore >= 50 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Timeline Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent" />
            Future Timeline
          </h3>
          <div className="relative border-l-2 border-white/10 ml-3 space-y-8 pl-8 py-2">
            {['5y', '10y', '20y'].map((key) => (
              <div key={key} className="relative group">
                <div className="absolute -left-[39px] top-1 w-5 h-5 rounded-full border-4 border-secondary bg-accent group-hover:scale-125 transition-transform duration-300"></div>
                <div className="bg-primary/50 p-4 rounded-xl border border-white/5 group-hover:border-accent/30 transition-colors">
                  <div className="text-accent font-bold mb-1 text-sm uppercase tracking-wide">
                    {key === '5y' ? '5 Years' : key === '10y' ? '10 Years' : '20 Years'}
                  </div>
                  <p className="text-text-muted text-sm leading-relaxed">
                    {getPredText(job.predictions[key])}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Human Edge & Chart Section */}
        <div className="flex flex-col space-y-8">
          <div>
            <h3 className="text-xl font-bold text-text-main mb-6 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              The Human Edge
            </h3>
            <div className="bg-gradient-to-br from-primary/80 to-primary/40 p-8 rounded-2xl border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:opacity-75"></div>
              <p className="text-text-main/90 leading-loose text-lg relative z-10 font-medium">
                "{job.humanEdge}"
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm text-text-muted">
                <TrendingUp className="w-4 h-4" />
                <span>Skills to cultivate</span>
              </div>
            </div>
          </div>

          {/* Chart Integration */}
          <ImpactChart predictions={job.predictions} />
        </div>
      </div>
    </div>
  );
};

export default JobCard;
