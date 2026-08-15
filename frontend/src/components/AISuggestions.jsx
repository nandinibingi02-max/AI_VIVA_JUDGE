import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, BookOpen, Zap } from 'lucide-react';
import '../styles/AISuggestions.css';

const iconMap = {
  lightbulb: Lightbulb,
  book: BookOpen,
  zap: Zap
};

const AISuggestions = ({ suggestions }) => {
  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="empty-state">
        <p>No suggestions available</p>
      </div>
    );
  }

  return (
    <div className="suggestions-container">
      {suggestions.map((suggestion, index) => {
        const Icon = iconMap[suggestion.icon] || Lightbulb;
        return (
          <motion.div 
            key={index}
            className={`suggestion-item ${suggestion.type}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <div className="suggestion-icon">
              <Icon size={16} />
            </div>
            <p>{suggestion.text}</p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default AISuggestions;