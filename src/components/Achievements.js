import React from 'react';
import '../styles/Achievements.css';

const Achievements = () => {
  const achievements = [
    "Winner - KPIT Innovation Award, Smart India Hackathon 2018",
    "Finalist - Student Start-up Exposure Program, Rajasthan",
    "2nd Runner-up - Smart India Hackathon 2019"
  ];

  return (
    <div className="achievements-container">
      <h2>Achievements</h2>
      <ul>
        {achievements.map((achievement, index) => (
          <li key={index}>{achievement}</li>
        ))}
      </ul>
    </div>
  );
};

export default Achievements;
