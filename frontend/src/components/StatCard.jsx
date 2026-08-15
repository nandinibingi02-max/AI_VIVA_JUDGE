import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import '../styles/StatCard.css';

const StatCard = ({ stat, index }) => {
  return (
    <motion.div 
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      <div className="stat-icon-wrapper" style={{ background: `${stat.color}20` }}>
        {stat.icon}
      </div>
      <div className="stat-content">
        <div className="stat-value">{stat.value}</div>
        <div className="stat-label">{stat.label}</div>
        <div className="stat-trend">
          <TrendingUp size={14} />
          <span>{stat.trend}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;