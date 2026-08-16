import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import '../styles/PerformanceChart.css';

const PerformanceChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="empty-state">
        <p>No performance data available</p>
      </div>
    );
  }

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="understandingGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
          <XAxis 
            dataKey="name" 
            stroke="#ffffff60"
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="#ffffff60"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{ 
              background: 'rgba(26, 26, 62, 0.9)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}
            labelStyle={{ color: '#ffffff' }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#8b5cf6"
            strokeWidth={3}
            fill="url(#scoreGradient)"
          />
          <Area
            type="monotone"
            dataKey="understanding"
            stroke="#06b6d4"
            strokeWidth={3}
            fill="url(#understandingGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#8b5cf6' }}></div>
          <span>Score</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#06b6d4' }}></div>
          <span>Confidence</span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;
