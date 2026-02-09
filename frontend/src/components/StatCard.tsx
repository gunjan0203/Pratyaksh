import React from 'react';
import { motion } from 'framer-motion';
import './StatCard.css';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  change: string;
  color: string;
  barValue?: number;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  change, 
  color,
  barValue,
  delay = 0 
}) => {
  const isPositive = change.startsWith('+');
  const progressValue = barValue || (isPositive ? 75 : 25);
  
  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        y: -10,
        boxShadow: `0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px ${color}33`
      }}
    >
      <div className="stat-header">
        <div className="stat-icon-wrapper" style={{ backgroundColor: `${color}20` }}>
          <div className="stat-icon" style={{ color }}>
              {React.cloneElement(icon as React.ReactElement, { size: 24 } as any)}
            </div>
        </div>
      </div>
      
      <div className="stat-content">
        <h3 className="stat-value">{value}</h3>
        <div className="stat-title-row">
          <p className="stat-title">{title}</p>
          <div className={`stat-change ${isPositive ? 'positive' : 'negative'}`}>
            {change}
          </div>
        </div>
      </div>
      
      <div className="stat-progress-container">
        <div className="progress-labels">
          <span className="progress-min"></span>
          <span className="progress-max"></span>
        </div>
        <div className="stat-progress">
          <motion.div 
            className="progress-bar"
            initial={{ width: 0 }}
            animate={{ width: `${progressValue}%` }}
            transition={{ duration: 1, delay: delay + 0.3 }}
            style={{ backgroundColor: color }}
          />
        </div>
      </div>
      
      <div className="stat-decoration">
        <div className="decoration-circle decoration-circle-1" />
        <div className="decoration-circle decoration-circle-2" />
        <div className="decoration-circle decoration-circle-3" />
      </div>
    </motion.div>
  );
};

export default StatCard;