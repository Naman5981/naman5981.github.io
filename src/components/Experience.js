import React, { useEffect, useState } from 'react';
import '../styles/Experience.css';
import { getExperiences } from '../services/portfolio';

const CompanyLogo = ({ src, alt, company }) => {
  const [hasError, setHasError] = useState(false);
  const initials = company
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  if (!src || hasError) {
    return (
      <div className="company-logo company-logo-fallback" aria-label={`${company} logo fallback`}>
        <span>{initials}</span>
      </div>
    );
  }

  return <img className="company-logo" src={src} alt={alt} loading="lazy" onError={() => setHasError(true)} />;
};

const Experience = () => {
  const [experiences, setExperiences] = useState(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadExperiences = async () => {
      try {
        const nextExperiences = await getExperiences();
        if (isMounted) {
          setExperiences(nextExperiences);
          setHasError(false);
        }
      } catch (error) {
        console.error('Failed to load experiences from Supabase.', error);
        if (isMounted) {
          setHasError(true);
        }
      }
    };

    loadExperiences();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!experiences && !hasError) {
    return null;
  }

  if (hasError || !experiences) {
    return (
      <section className="experience">
        <h2>Work Experience</h2>
        <p>Experience data could not be loaded.</p>
      </section>
    );
  }

  return (
    <section className="experience">
      <h2>Work Experience</h2>
      {experiences.map((exp) => (
        <div className="experience-block" key={`${exp.company}-${exp.duration}`} tabIndex={0}>
          <div className="experience-company">
            <CompanyLogo src={exp.logo} alt={exp.logoAlt} company={exp.company} />
            <h3>
              {exp.website ? (
                <a href={exp.website} target="_blank" rel="noopener noreferrer">
                  {exp.company}
                </a>
              ) : (
                exp.company
              )}
            </h3>
          </div>
          <p className="location">{exp.location}</p>
          <p className="duration">{exp.duration}</p>
          <p className="designation">{exp.designation}</p>
          <p className="experience-summary">{exp.summary}</p>
          <div className="experience-details">
            <ul>
              {exp.description.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Experience;
