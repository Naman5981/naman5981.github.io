import React, { useEffect, useState } from 'react';
import '../styles/Projects.css';
import { projectAliases, projectShowcase } from '../data/portfolioContent';
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

  const decoratedProjects = projects.map((project) => {
    const projectKey = projectAliases[project.slug] ?? project.slug;
    const showcase = projectShowcase[projectKey] ?? {};

    return {
      ...project,
      category: showcase.category ?? 'Selected Build',
      status: showcase.status ?? 'Project',
      accent: showcase.accent ?? 'teal',
      stack: showcase.stack ?? [],
      impact: showcase.impact ?? project.description,
      repoUrl: project.repoUrl ?? showcase.links?.repoUrl ?? null,
      liveUrl: project.liveUrl ?? showcase.links?.liveUrl ?? null
    };
  });

  return (
    <section className="projects">
      <div className="projects-header">
        <h2>Projects</h2>
        <p>
          Product-minded builds across backend-heavy workflows, domain tools, and mobile
          experiences.
        </p>
      </div>

      <div className="project-grid">
        {decoratedProjects.map((project) => (
          <article className={`project project-${project.accent}`} key={project.slug ?? project.title}>
            <div className="project-topline">
              <span className="project-category">{project.category}</span>
              <span className="project-status">{project.status}</span>
            </div>

            <div className="project-heading">
              <h4>{project.title}</h4>
              <p>{project.description}</p>
            </div>

            <div className="project-impact">
              <span className="project-impact-label">Focus</span>
              <p>{project.impact}</p>
            </div>

            {project.stack.length ? (
              <div className="project-stack" aria-label={`${project.title} technology stack`}>
                {project.stack.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            ) : null}

            <div className="project-actions">
              {project.repoUrl ? (
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                  View Repository
                </a>
              ) : null}
              {project.liveUrl ? (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  Open Project
                </a>
              ) : (
                <span className="project-note">Private or internal implementation</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Projects;
