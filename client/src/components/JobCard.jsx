import React from 'react';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const JobCard = ({ job }) => {
  if (!job) return null;

  const getRiskColor = (score) => {
    if (score >= 80) return 'text-red-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="bg-secondary rounded-xl p-8 shadow-2xl border border-slate-700 animate-fade-in">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">{job.title}</h2>
          <span className="text-gray-400 text-sm uppercase tracking-wider">{job.field}</span>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400 mb-1">Automation Risk</div>
          <div className={`text-4xl font-bold ${getRiskColor(job.automationScore)}`}>
            {job.automationScore}%
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-accent" />
            Timeline Predictions
          </h3>
          <div className="space-y-4">
            {Object.entries(job.predictions).map(([key, value]) => (
              <div key={key} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                <div className="text-accent font-bold mb-1">{key === '5y' ? '5 Years' : key === '10y' ? '10 Years' : '20 Years'}</div>
                <p className="text-gray-300 text-sm">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
            The Human Edge
          </h3>
          <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700 h-full">
            <p className="text-gray-300 leading-relaxed">
              {job.humanEdge}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
