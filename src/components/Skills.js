import React from 'react';
import '../styles/Skills.css';

const skills = {
  Backend: ["Spring Boot", "Microservices", "Hibernate", "JUnit"],
  Architecture: ["Distributed Systems", "Transaction Management", "API Design"],
  Languages: ["Java", "JavaScript", "C++", "Shell"],
  Databases: ["MySQL", "PostgreSQL", "Firebase"],
  "API & Tools": ["REST APIs", "Postman", "Swagger"],
  "DevOps & Cloud": ["GitHub", "GitLab", "Maven", "Jenkins", "CI/CD", "AWS", "GCP"],
  Automation: ["ChatGPT", "n8n", "Claude"]
};

const Skills = () => {
  return (
    <div className="skills-container">
      <h2>Skills</h2>
      {Object.entries(skills).map(([category, skillList]) => (
        <div key={category} className="skill-category">
          <h3>{category}</h3>
          <ul>
            {skillList.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Skills;
