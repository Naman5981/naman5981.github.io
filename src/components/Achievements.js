import React from 'react';
import '../styles/Achievements.css';
import { getAchievements, getCachedAchievements } from '../services/portfolio';
import { useAsyncData } from '../hooks/useAsyncData';

const Achievements = () => {
  const { data: achievements, hasError } = useAsyncData(getAchievements, getCachedAchievements());

  if (hasError) {
    return (
      <div className="achievements-container">
        <h2>Achievements</h2>
        <p>Achievement data could not be loaded.</p>
      </div>
    );
  }

  if (!achievements) {
    return (
      <div className="achievements-container">
        <h2>Achievements</h2>
        <div className="achievements-skeleton" aria-hidden="true">
          {[0, 1, 2].map((item) => (
            <div className="achievements-skeleton-item" key={item}>
              <div className={`shimmer-line ${item === 1 ? 'category' : item === 2 ? 'short' : ''}`} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="achievements-container">
      <h2>Achievements</h2>
      <div className="achievements-list">
        {achievements.map((achievement) => (
          <div className="achievement-block" key={achievement}>
            <p>{achievement}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
