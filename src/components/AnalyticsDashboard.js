import React, { useEffect, useState } from 'react';
import { getAnalyticsSummary } from '../services/analytics';
import '../styles/AnalyticsDashboard.css';

const AnalyticsDashboard = ({ compact = false }) => {
  const [summary, setSummary] = useState(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadSummary = async () => {
      try {
        const nextSummary = await getAnalyticsSummary();

        if (isMounted) {
          setSummary(nextSummary);
          setHasError(false);
        }
      } catch (error) {
        console.error('Failed to load analytics summary.', error);

        if (isMounted) {
          setHasError(true);
        }
      }
    };

    loadSummary();
    const intervalId = window.setInterval(loadSummary, 15000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  if (hasError) {
    return (
      <section className={`analytics-dashboard ${compact ? 'analytics-dashboard-compact' : ''}`}>
        <div className="analytics-header">
          <span className="eyebrow">{compact ? 'Proof Layer' : 'Visitor Signals'}</span>
          <h2>{compact ? 'Live portfolio proof' : 'Audience activity'}</h2>
        </div>
        <p className="analytics-empty-copy">Analytics could not be loaded right now.</p>
      </section>
    );
  }

  if (!summary) {
    return (
      <section
        className={`analytics-dashboard ${compact ? 'analytics-dashboard-compact' : ''}`}
        aria-hidden="true"
      >
        <div className="analytics-header">
          <span className="eyebrow">{compact ? 'Proof Layer' : 'Visitor Signals'}</span>
          <div className="shimmer-line title" />
        </div>

        {compact ? (
          <div className="analytics-proof-skeleton">
            {[0, 1, 2].map((item) => (
              <div className="analytics-proof-chip analytics-proof-chip-skeleton" key={item}>
                <div className={`shimmer-line ${item === 2 ? 'short' : ''}`} />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="analytics-stat-grid">
              {[0, 1, 2].map((item) => (
                <div className="analytics-stat-card" key={item}>
                  <div className="shimmer-line short" />
                  <div className="shimmer-line title" />
                </div>
              ))}
            </div>

            <div className="analytics-list-grid">
              {[0, 1].map((item) => (
                <div className="analytics-list-card" key={item}>
                  <div className="shimmer-line short" />
                  <div className="shimmer-line" />
                  <div className="shimmer-line" />
                  <div className="shimmer-line short" />
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    );
  }

  const sectionViews = summary.topSections.reduce(
    (total, item) => total + Number(item.total_events ?? 0),
    0
  );
  const projectViews = summary.topProjects.reduce(
    (total, item) => total + Number(item.total_events ?? 0),
    0
  );
  const topSection = summary.topSections[0];
  const topProject = summary.topProjects[0];
  const recentExploration = summary.recentExploration ?? [];
  const weeklyTopProject = summary.weeklyTopProject;
  const proofItems = [
    topSection ? `${topSection.target_label} is drawing the strongest section attention.` : null,
    weeklyTopProject
      ? `${weeklyTopProject.target_label} is the most opened project this week.`
      : topProject
        ? `${topProject.target_label} is pulling the most repeat project interest.`
        : null,
    summary.resumeFollowThrough
      ? `${summary.resumeFollowThrough} sessions moved from projects to the resume.`
      : null
  ].filter(Boolean);

  if (compact) {
    return (
      <section className="analytics-dashboard analytics-dashboard-compact">
        <div className="analytics-header analytics-header-compact">
          <span className="eyebrow">Proof Layer</span>
          <h2>What visitors validate after exploring the work</h2>
          <p>Live signals that show where attention gathers and what drives follow-through.</p>
        </div>

        <div className="analytics-proof-strip">
          {proofItems.map((item) => (
            <article className="analytics-proof-chip" key={item}>
              <span className="analytics-live-dot" aria-hidden="true" />
              <p>{item}</p>
            </article>
          ))}
        </div>

        {recentExploration.length ? (
          <div className="analytics-proof-footer">
            <span>Recently explored</span>
            <div className="analytics-context-tags">
              {recentExploration.map((item) => (
                <span key={`${item.type}:${item.label}`}>{item.label}</span>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    );
  }

  return (
    <section className="analytics-dashboard">
      <div className="analytics-header">
        <span className="eyebrow">Live proof</span>
        <h2>What visitors are validating right now</h2>
        <p>Real activity from the portfolio that shows where attention gathers first and what keeps getting opened.</p>
      </div>

      <article className="analytics-proof-banner">
        <div className="analytics-proof-kicker">
          <span className="analytics-live-dot" aria-hidden="true" />
          <span>Live visitor snapshot</span>
        </div>
        <p>
          {topSection
            ? `${topSection.target_label} is currently getting the strongest section attention`
            : 'Section activity will start shaping the story as visitors explore the portfolio'}
          {topProject ? `, while ${topProject.target_label} is the project drawing the most repeat interest.` : '.'}
        </p>
      </article>

      <div className="analytics-context-grid">
        <article className="analytics-context-card">
          <span>Recently explored</span>
          {recentExploration.length ? (
            <div className="analytics-context-tags">
              {recentExploration.map((item) => (
                <span key={`${item.type}:${item.label}`}>{item.label}</span>
              ))}
            </div>
          ) : (
            <p className="analytics-empty-copy">Fresh exploration patterns will appear here.</p>
          )}
        </article>

        <article className="analytics-context-card">
          <span>Most opened this week</span>
          <strong>{weeklyTopProject?.target_label ?? 'Waiting for weekly signal'}</strong>
          <p className="analytics-context-note">
            {weeklyTopProject
              ? `${weeklyTopProject.total_events} project opens in the past 7 days`
              : 'Weekly project attention will show once new visits come in.'}
          </p>
        </article>

        <article className="analytics-context-card">
          <span>Resume follow-through</span>
          <strong>{summary.resumeFollowThrough}</strong>
          <p className="analytics-context-note">
            Sessions that opened a project and then continued to the resume.
          </p>
        </article>
      </div>

      <div className="analytics-stat-grid">
        <article className="analytics-stat-card">
          <span>Sections opened</span>
          <strong>{sectionViews}</strong>
        </article>
        <article className="analytics-stat-card">
          <span>Project attention</span>
          <strong>{projectViews}</strong>
        </article>
        <article className="analytics-stat-card">
          <span>Resume pulls</span>
          <strong>{summary.resumeDownloads}</strong>
        </article>
      </div>

      <div className="analytics-list-grid">
        <div className="analytics-list-card">
          <h3>What visitors open first</h3>
          {summary.topSections.length ? (
            <ol>
              {summary.topSections.map((item) => (
                <li key={item.target_key}>
                  <span>{item.target_label}</span>
                  <strong>{item.total_events}</strong>
                </li>
              ))}
            </ol>
          ) : (
            <p className="analytics-empty-copy">Section activity will appear after visitors explore the site.</p>
          )}
        </div>

        <div className="analytics-list-card">
          <h3>What keeps attention longest</h3>
          {summary.topProjects.length ? (
            <ol>
              {summary.topProjects.map((item) => (
                <li key={item.target_key}>
                  <span>{item.target_label}</span>
                  <strong>{item.total_events}</strong>
                </li>
              ))}
            </ol>
          ) : (
            <p className="analytics-empty-copy">Project activity will show after visitors view project cards.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AnalyticsDashboard;
