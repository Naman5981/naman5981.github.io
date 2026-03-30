import React, { useEffect, useMemo, useState } from 'react';
import '../styles/Skills.css';
import { getSkillCategories } from '../services/portfolio';

const Skills = () => {
  const [skillCategories, setSkillCategories] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredCategories = useMemo(
    () =>
      (skillCategories ?? [])
        .map((skillCategory) => ({
          ...skillCategory,
          skills: skillCategory.skills.filter((skill) =>
            !normalizedSearch
              ? true
              : `${skillCategory.category} ${skill}`.toLowerCase().includes(normalizedSearch)
          )
        }))
        .filter((skillCategory) => skillCategory.skills.length > 0),
    [normalizedSearch, skillCategories]
  );

  const totalSkills = (skillCategories ?? []).reduce(
    (count, skillCategory) => count + skillCategory.skills.length,
    0
  );
  const visibleSkills = filteredCategories.reduce(
    (count, skillCategory) => count + skillCategory.skills.length,
    0
  );

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
          <div className="search-skeleton shimmer-line" />
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
        <>
          <div className="section-search">
            <label className="search-label" htmlFor="skills-search">
              Search skills
            </label>
            <input
              id="skills-search"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by language, tool, domain, or category"
            />
            <span className="search-meta">
              {visibleSkills} of {totalSkills} skills shown
            </span>
          </div>

          {filteredCategories.length ? (
            filteredCategories.map((skillCategory) => (
              <div key={skillCategory.category} className="skill-category">
                <h3>{skillCategory.category}</h3>
                <ul>
                  {skillCategory.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <div className="search-empty-state">
              <h3>No skills matched</h3>
              <p>Try searching for backend, database, Java, cloud, or testing.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Skills;
