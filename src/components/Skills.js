import React, { useMemo } from 'react';
import '../styles/Skills.css';
import { getSkillCategories } from '../services/portfolio';
import { useAsyncData } from '../hooks/useAsyncData';

const Skills = () => {
  const { data: skillCategories, hasError } = useAsyncData(getSkillCategories);

  const visibleCategories = useMemo(() => skillCategories ?? [], [skillCategories]);

  if (hasError) {
    return (
      <div className="skills-container">
        <h2>Skills</h2>
        <p>Skills data could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="skills-container">
      <h2>Skills</h2>

      {!skillCategories ? (
        <div className="skills-skeleton" aria-hidden="true">
          {[0, 1, 2].map((item) => (
            <div key={item} className="skill-category">
              <div className="shimmer-line category" />
              <div className="skills-chip-skeleton">
                {[0, 1, 2, 3, 4].map((chip) => (
                  <span key={chip} className="shimmer-chip" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        visibleCategories.map((skillCategory) => (
          <div key={skillCategory.category} className="skill-category">
            <h3>{skillCategory.category}</h3>
            <ul>
              {skillCategory.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default Skills;
