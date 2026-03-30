import React, { useEffect, useState } from 'react';
import '../styles/Skills.css';
import { getSkillCategories } from '../services/portfolio';

const Skills = () => {
  const [skillCategories, setSkillCategories] = useState(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadSkills = async () => {
      try {
        const nextSkillCategories = await getSkillCategories();
        if (isMounted) {
          setSkillCategories(nextSkillCategories);
          setHasError(false);
        }
      } catch (error) {
        console.error('Failed to load skills from Supabase.', error);
        if (isMounted) {
          setHasError(true);
        }
      }
    };

    loadSkills();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!skillCategories && !hasError) {
    return null;
  }

  if (hasError || !skillCategories) {
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
      {skillCategories.map((skillCategory) => (
        <div key={skillCategory.category} className="skill-category">
          <h3>{skillCategory.category}</h3>
          <ul>
            {skillCategory.skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Skills;
