import React, { useEffect, useState } from 'react';
import '../styles/Achievements.css';
import { getAchievements, getCachedAchievements } from '../services/portfolio';

const Achievements = () => {
  const [achievements, setAchievements] = useState(() => getCachedAchievements());
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadAchievements = async () => {
      try {
        const nextAchievements = await getAchievements();
        if (isMounted) {
          setAchievements(nextAchievements);
          setHasError(false);
        }
      } catch (error) {
        console.error('Failed to load achievements from Supabase.', error);
        if (isMounted) {
          setHasError(true);
        }
      }
    };

    loadAchievements();

    return () => {
      isMounted = false;
    };
  }, []);

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
