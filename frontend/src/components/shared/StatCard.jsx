import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StatCard = ({ variant, icon, value, label }) => (
  <div className={`stat-card ${variant}`}>
    <div className="stat-icon-wrap">
      <FontAwesomeIcon icon={icon} />
    </div>
    <div className="stat-info">
      <span className="stat-num">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  </div>
);

export default StatCard;
