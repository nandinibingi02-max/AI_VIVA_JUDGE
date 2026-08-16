import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';
import '../styles/RecentSessions.css';

const RecentSessions = ({ sessions, onOpen }) => {
  if (!sessions || sessions.length === 0) {
    return (
      <div className="empty-state">
        <p>No recent sessions</p>
      </div>
    );
  }

  return (
    <div className="sessions-list">
      {sessions.map((session, index) => (
        <motion.div 
          key={session.id || index}
          className="session-item"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 * index }}
        >
          <div className="session-info">
            <div className="session-icon-wrapper">
              {session.status === 'completed' ? 
                <CheckCircle size={18} color="#10b981" /> : 
                <AlertCircle size={18} color="#ef4444" />
              }
            </div>
            <div className="session-details">
              <span className="session-subject">{session.subject}</span>
              <div className="session-meta">
                <Clock size={14} />
                <span>{session.date}</span>
              </div>
            </div>
          </div>
          <div className="session-score">
            <span className="score-value">{Number.isFinite(session.score) ? `${session.score}%` : 'Active'}</span>
            <button className="session-view" onClick={() => onOpen?.(session.id)} aria-label={`Open ${session.subject} viva`}>
              <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default RecentSessions;
