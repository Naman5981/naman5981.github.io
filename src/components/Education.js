import React from 'react';
import '../styles/Education.css';

const Education = () => {
  const educationData = [
    {
      degree: "B.Tech in Computer Science",
      institution: "Geetanjali Institute of Technical Studies, Udaipur",
      duration: "2020"
    },
    {
      degree: "CBSE (XII)",
      institution: "Alok Senior Secondary School, Udaipur",
      duration: "2016"
    }
  ];

  return (
    <div className="education-container">
      <h2>Education</h2>
      {educationData.map((edu, index) => (
        <div className="education-block" key={index}>
          <h3>{edu.degree}</h3>
          <p>{edu.institution}</p>
          <p className="duration">{edu.duration}</p>
        </div>
      ))}
    </div>
  );
};

export default Education;
