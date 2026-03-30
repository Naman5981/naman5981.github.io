import React, { useEffect, useState } from 'react';
import '../styles/Education.css';
import { getEducation } from '../services/portfolio';

const Education = () => {
  const [educationData, setEducationData] = useState(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadEducation = async () => {
      try {
        const nextEducationData = await getEducation();
        if (isMounted) {
          setEducationData(nextEducationData);
          setHasError(false);
        }
      } catch (error) {
        console.error('Failed to load education from Supabase.', error);
        if (isMounted) {
          setHasError(true);
        }
      }
    };

    loadEducation();

    return () => {
      isMounted = false;
    };
  }, []);

  if (hasError) {
    return (
      <div className="education-container">
        <h2>Education</h2>
        <p>Education data could not be loaded.</p>
      </div>
    );
  }

  if (!educationData) {
    return (
      <div className="education-container">
        <h2>Education</h2>
        <div className="compact-section-skeleton" aria-hidden="true">
          {[0, 1].map((item) => (
            <div className="compact-skeleton-card" key={item}>
              <div className="shimmer-line title" />
              <div className="shimmer-line" />
              <div className="shimmer-line short" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="education-container">
      <h2>Education</h2>
      {educationData.map((edu) => (
        <div className="education-block" key={`${edu.degree}-${edu.duration}`}>
          <h3>{edu.degree}</h3>
          <p>{edu.institution}</p>
          <p className="duration">{edu.duration}</p>
        </div>
      ))}
    </div>
  );
};

export default Education;
