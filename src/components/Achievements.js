import React, { useEffect, useState } from 'react';
import '../styles/Achievements.css';
import { getAchievements } from '../services/portfolio';

const Achievements = () => {
  const [achievements, setAchievements] = useState(null);
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

  if (!achievements && !hasError) {
    return null;
  }

  if (hasError || !achievements) {
    return (
      <div className="achievements-container">
        <h2>Achievements</h2>
        <p>Achievement data could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="achievements-container">
      <h2>Achievements</h2>
      <ul>
        {achievements.map((achievement) => (
          <li key={achievement}>{achievement}</li>
        ))}
      </ul>
    </div>
  );
};

export default Achievements;
