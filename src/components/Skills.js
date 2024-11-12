import React from 'react';
import '../styles/Skills.css';

const skills = [
  "Java",
  "Spring Boot",
  "React",
  "Node.js",
  "Firebase",
  "MySQL",
  "Android Development",
  "GitHub"
];

const Skills = () => {
  return (
    <div className="skills-container">
      <h2>Skills</h2>
      <ul>
        {skills.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
    </div>
  );
};

export default Skills;
