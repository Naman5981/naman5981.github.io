import React, { useEffect, useState } from 'react';
import '../styles/Experience.css';
import { getExperiences } from '../services/portfolio';

const CompanyLogo = ({ src, alt, company }) => {
  const [hasError, setHasError] = useState(false);
  const fallbackLabelMap = {
    'Infosys Limited': 'Infosys',
    'Tech Mahindra': 'TechM',
    'Xebia (AU Small Finance Bank)': 'Xebia'
  };
  const fallbackLabel =
    fallbackLabelMap[company] ??
    company
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();

  if (!src || hasError) {
    return (
      <div className="company-logo company-logo-fallback" aria-label={`${company} logo fallback`}>
        <span>{fallbackLabel}</span>
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

  if (hasError) {
    return (
      <section className="experience">
        <h2>Work Experience</h2>
        <p>Experience data could not be loaded.</p>
      </section>
    );
  }

  if (!experiences) {
    return (
      <section className="experience">
        <h2>Work Experience</h2>
        <div className="experience-skeleton-list" aria-hidden="true">
          {[0, 1, 2].map((item) => (
            <div className="experience-block experience-skeleton" key={item}>
              <div className="experience-company">
                <div className="company-logo skeleton-logo shimmer-block" />
                <div className="experience-heading-skeleton">
                  <div className="shimmer-line title" />
                  <div className="shimmer-line short" />
                </div>
              </div>
              <div className="shimmer-line short" />
              <div className="shimmer-line short" />
              <div className="shimmer-line" />
              <div className="shimmer-line" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="experience">
      <h2>Work Experience</h2>
      {experiences.map((exp) => (
        <div className="experience-block" key={`${exp.company}-${exp.duration}`} tabIndex={0}>
          <div className="experience-head">
            <div className="experience-company">
              <CompanyLogo src={exp.logo} alt={exp.logoAlt} company={exp.company} />
              <div className="experience-title-group">
                <h3>
                  {exp.website ? (
                    <a href={exp.website} target="_blank" rel="noopener noreferrer">
                      {exp.company}
                    </a>
                  ) : (
                    exp.company
                  )}
                </h3>
                <p className="designation">{exp.designation}</p>
              </div>
            </div>
            <div className="experience-meta">
              <p className="location">{exp.location}</p>
              <p className="duration">{exp.duration}</p>
            </div>
          </div>
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
