import React, { useEffect, useMemo, useState } from 'react';
import '../styles/Projects.css';
import { projectAliases, projectShowcase } from '../data/portfolioContent';
import { getProjects } from '../services/portfolio';

const Projects = () => {
  const [projects, setProjects] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  const decoratedProjects = useMemo(
    () =>
      (projects ?? []).map((project) => {
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
      }),
    [projects]
  );

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredProjects = decoratedProjects.filter((project) => {
    if (!normalizedSearch) {
      return true;
    }

    const searchableText = [
      project.title,
      project.description,
      project.category,
      project.status,
      project.impact,
      ...(project.stack ?? [])
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchableText.includes(normalizedSearch);
  });

  if (hasError) {
    return (
      <section className="projects">
        <h2>Projects</h2>
        <p>Project data could not be loaded.</p>
      </section>
    );
  }

  return (
    <section className="projects">
      <div className="projects-header">
        <h2>Projects</h2>
        <p>
          Product-minded builds across backend-heavy workflows, domain tools, and mobile
          experiences.
        </p>
      </div>

      {!projects ? (
        <div className="projects-skeleton" aria-hidden="true">
          <div className="search-skeleton shimmer-line" />
          <div className="project-grid">
            {[0, 1, 2, 3].map((item) => (
              <article className="project project-skeleton-card" key={item}>
                <div className="skeleton-chip-row">
                  <span className="shimmer-chip" />
                  <span className="shimmer-chip short" />
                </div>
                <div className="shimmer-line title" />
                <div className="shimmer-line" />
                <div className="shimmer-line" />
                <div className="shimmer-block" />
                <div className="skeleton-chip-row stack">
                  <span className="shimmer-chip" />
                  <span className="shimmer-chip" />
                  <span className="shimmer-chip short" />
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="section-search">
            <label className="search-label" htmlFor="project-search">
              Search projects
            </label>
            <input
              id="project-search"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by project, domain, stack, or focus"
            />
            <span className="search-meta">
              {filteredProjects.length} of {decoratedProjects.length} shown
            </span>
          </div>

          {filteredProjects.length ? (
            <div className="project-grid">
              {filteredProjects.map((project) => (
                <article
                  className={`project project-${project.accent}`}
                  key={project.slug ?? project.title}
                >
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
          ) : (
            <div className="search-empty-state">
              <h3>No projects matched</h3>
              <p>Try a broader keyword like Java, banking, mobile, or API.</p>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Projects;
