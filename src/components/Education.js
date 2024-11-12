
import React from 'react';
import '../styles/Education.css';

const Education = () => {
  const educationData = [
    {
      degree: "Bachelor Of Technology",
      institution: "Geetanjali Institute of Technical Studies",
      duration: "08/2016 - 07/2020"
    },
    {
      degree: "Senior Secondary (XIIth)",
      institution: "Alok Senior Secondary",
      duration: "04/2015 - 05/2016"
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
