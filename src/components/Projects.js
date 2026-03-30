import React, { useEffect, useState } from 'react';
import '../styles/Projects.css';
import { getProjects } from '../services/portfolio';

const Projects = () => {
  const [projects, setProjects] = useState(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      try {
        const nextProjects = await getProjects();
        if (isMounted) {
          setProjects(nextProjects);
          setHasError(false);
        }
      } catch (error) {
        console.error('Failed to load projects from Supabase.', error);
        if (isMounted) {
          setHasError(true);
        }
      }
    };

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!projects && !hasError) {
    return null;
  }

  if (hasError || !projects) {
    return (
      <section className="projects">
        <h2>Projects</h2>
        <p>Project data could not be loaded.</p>
      </section>
    );
  }

  return (
    <section className="projects">
      <h2>Projects</h2>
      {projects.map((project) => (
        <div className="project" key={project.slug ?? project.title}>
          <h4>
            {project.href ? (
              <a href={project.href} target="_blank" rel="noopener noreferrer">
                {project.title}
              </a>
            ) : (
              project.title
            )}
          </h4>
          <p>{project.description}</p>
        </div>
      ))}
    </section>
  );
};

export default Projects;
