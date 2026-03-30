import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../styles/Projects.css';
import { projectAliases, projectShowcase } from '../data/portfolioContent';
import { trackPortfolioEvent } from '../services/analytics';
import { getProjects } from '../services/portfolio';

const Projects = () => {
  const [projects, setProjects] = useState(null);
  const [hasError, setHasError] = useState(false);
  const trackedProjectViews = useRef(new Set());

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

  useEffect(() => {
    if (!decoratedProjects.length) {
      return undefined;
    }

    const cards = Array.from(document.querySelectorAll('[data-project-slug]'));
    if (!cards.length) {
      return undefined;
    }

    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const slug = entry.target.getAttribute('data-project-slug');
          const title = entry.target.getAttribute('data-project-title');

          if (!slug || !title || trackedProjectViews.current.has(slug)) {
            return;
          }

          trackedProjectViews.current.add(slug);

          trackPortfolioEvent({
            eventType: 'project_view',
            targetKey: slug,
            targetLabel: title,
            source: 'projects_grid',
            oncePerSession: true
          });

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.45
      }
    );

    cards.forEach((card) => observer.observe(card));

    return () => {
      observer.disconnect();
    };
  }, [decoratedProjects]);

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
        <div className="project-grid">
          {decoratedProjects.map((project) => (
            <article
              className={`project project-${project.accent}`}
              key={project.slug ?? project.title}
              data-project-slug={project.slug ?? project.title}
              data-project-title={project.title}
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
      )}
    </section>
  );
};

export default Projects;
