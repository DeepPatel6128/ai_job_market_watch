import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ImpactChart = ({ predictions }) => {
  // Transform predictions object into array for Recharts
  // predictions structure: { "5y": { score: 40 }, "10y": { score: 70 }, ... }

  // Handle case where predictions might be old format (string) or missing scores
  // Although we cleared DB, robustness is good.
  const getDataPoint = (key, label) => {
    const pred = predictions[key];
    const score = typeof pred === 'object' && pred.score ? pred.score : 0;
    return { name: label, score };
  };

  const data = [
    { name: 'Now', score: 10 }, // Baseline
    getDataPoint('5y', '5 Years'),
    getDataPoint('10y', '10 Years'),
    getDataPoint('20y', '20 Years'),
  ];

  return (
    <div className="h-64 w-full mt-6">
      <h3 className="text-lg font-semibold mb-4 text-text-main">AI Impact Trajectory</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" domain={[0, 100]} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
            itemStyle={{ color: '#22d3ee' }}
          />
          <Area type="monotone" dataKey="score" stroke="#22d3ee" fillOpacity={1} fill="url(#colorScore)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ImpactChart;
