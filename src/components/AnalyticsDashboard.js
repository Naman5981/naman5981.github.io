import React, { useEffect, useState } from 'react';
import { getAnalyticsSummary } from '../services/analytics';
import '../styles/AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
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

    return () => {
      isMounted = false;
    };
  }, []);

  if (hasError) {
    return (
      <section className="analytics-dashboard">
        <div className="analytics-header">
          <span className="eyebrow">Visitor Signals</span>
          <h2>Audience activity</h2>
        </div>
        <p className="analytics-empty-copy">Analytics could not be loaded right now.</p>
      </section>
    );
  }

  if (!summary) {
    return (
      <section className="analytics-dashboard" aria-hidden="true">
        <div className="analytics-header">
          <span className="eyebrow">Visitor Signals</span>
          <div className="shimmer-line title" />
        </div>

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

  return (
    <section className="analytics-dashboard">
      <div className="analytics-header">
        <span className="eyebrow">Visitor Signals</span>
        <h2>Top viewed content</h2>
        <p>Live summary of what visitors are exploring most on the portfolio.</p>
      </div>

      <div className="analytics-stat-grid">
        <article className="analytics-stat-card">
          <span>Section views</span>
          <strong>{sectionViews}</strong>
        </article>
        <article className="analytics-stat-card">
          <span>Project views</span>
          <strong>{projectViews}</strong>
        </article>
        <article className="analytics-stat-card">
          <span>Resume downloads</span>
          <strong>{summary.resumeDownloads}</strong>
        </article>
      </div>

      <div className="analytics-list-grid">
        <div className="analytics-list-card">
          <h3>Top Sections</h3>
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
          <h3>Top Projects</h3>
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
