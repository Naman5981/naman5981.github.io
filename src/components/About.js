import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../styles/About.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import DownloadButton from './DownloadButton';
import ResumeModal from './ResumeModal';
import { getProfile } from '../services/portfolio';
import { trackPortfolioEvent } from '../services/analytics';

const iconMap = {
  github: faGithub,
  linkedin: faLinkedin
};

const About = () => {
  const [profile, setProfile] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [issuesSolvedCount, setIssuesSolvedCount] = useState(0);
  const [shouldAnimateStats, setShouldAnimateStats] = useState(false);
  const statsRef = useRef(null);
  const hasAnimatedStatsRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const nextProfile = await getProfile();
        if (isMounted && nextProfile) {
          setProfile(nextProfile);
          setHasError(false);
        }
      } catch (error) {
        console.error('Failed to load profile from Supabase.', error);
        if (isMounted) {
          setHasError(true);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!profile?.issuesSolvedTarget || hasAnimatedStatsRef.current) {
      return undefined;
    }

    const statsElement = statsRef.current;
    if (!statsElement) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || hasAnimatedStatsRef.current) {
          return;
        }

        hasAnimatedStatsRef.current = true;
        window.setTimeout(() => {
          setShouldAnimateStats(true);
        }, 180);
        observer.disconnect();
      },
      {
        threshold: 0.55
      }
    );

    observer.observe(statsElement);

    return () => observer.disconnect();
  }, [profile?.issuesSolvedTarget]);

  useEffect(() => {
    const targetValue = Math.max(profile?.issuesSolvedTarget ?? 0, 0);
    if (targetValue === 0 || !shouldAnimateStats) {
      setIssuesSolvedCount(0);
      return undefined;
    }

    const animationDuration = 960;
    const animationStart = window.performance.now();
    setIssuesSolvedCount(0);

    const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);
    let frameId;

    const tick = (timestamp) => {
      const elapsed = timestamp - animationStart;
      const progress = Math.min(elapsed / animationDuration, 1);
      const easedProgress = easeOutCubic(progress);
      const nextValue = Math.round(targetValue * easedProgress);

      setIssuesSolvedCount(nextValue);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    frameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frameId);
  }, [profile?.issuesSolvedTarget, shouldAnimateStats]);

  const handleCopyEmail = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!profile?.email) {
      return;
    }

    navigator.clipboard.writeText(profile.email).then(() => {
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2200);
    });
  };

  const handlePreviewResume = () => {
    trackPortfolioEvent({
      eventType: 'resume_preview',
      targetKey: 'resume',
      targetLabel: 'Resume Modal Preview',
      source: 'about_hero'
    });
    setIsResumeModalOpen(true);
  };

  const socialLinks = useMemo(
    () =>
      (profile?.socialLinks ?? [])
        .filter((link) => iconMap[link.platform])
        .map((link) => ({
          ...link,
          icon: iconMap[link.platform]
        })),
    [profile]
  );

  if (hasError) {
    return (
      <section className="about">
        <div className="about-hero">
          <div className="about-text">
            <h1>Profile unavailable</h1>
            <p>Supabase data could not be loaded.</p>
          </div>
        </div>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="about">
        <div className="about-hero about-skeleton" aria-hidden="true">
          <div className="profile-image skeleton-avatar shimmer-block" />
          <div className="about-text">
            <div className="shimmer-line title" />
            <div className="shimmer-line subtitle" />
            <div className="shimmer-line" />
            <div className="shimmer-line" />
            <div className="about-stats">
              {[0, 1, 2, 3].map((item) => (
                <div className="about-stat skeleton-stat" key={item}>
                  <span className="shimmer-line stat-value" />
                  <span className="shimmer-line stat-label" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="about">
      <div className="about-hero">
        <div className="profile-image-wrap hero-reveal hero-reveal-portrait">
          <div className="profile-greeting" aria-hidden="true">
            Hi!!
          </div>
          <div className="profile-image">
            {profile.profileImagePath ? <img src={profile.profileImagePath} alt="Profile" /> : null}
          </div>
        </div>

        <div className="about-text">
          <div
            className="availability-banner hero-reveal hero-reveal-banner"
            role="status"
            aria-label="Current availability"
          >
            <span className="availability-dot" aria-hidden="true" />
            Currently open to backend engineering roles, platform work, and high-ownership product teams
          </div>

          <div className="about-copy hero-reveal hero-reveal-copy">
            <span className="about-kicker">Backend engineer</span>
            <h1>{profile.fullName}</h1>
            <h2>{profile.headline}</h2>
            {(() => {
              const bioLines = String(profile.bio ?? '')
                .split('\n')
                .filter(Boolean);

              if (bioLines.length === 0) {
                return null;
              }

              return (
                <p className="about-lead">
                  {bioLines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </p>
              );
            })()}
          </div>

          <div ref={statsRef} className="about-stats hero-reveal hero-reveal-stats">
            <div className="about-stat">
              <strong>{profile.yearsExperienceLabel}</strong>
              <span>Years</span>
            </div>
            <div className="about-stat">
              <strong>{issuesSolvedCount}+</strong>
              <span>Issues Solved</span>
            </div>
            <div className="about-stat">
              <strong>{profile.coreDomainsCount}</strong>
              <span>Core Domains</span>
            </div>
            <div className="about-stat">
              <strong>{profile.backendFocusLabel}</strong>
              <span>Backend Focus</span>
            </div>
          </div>

          <div className="about-action-row hero-reveal hero-reveal-actions">
            <div className="about-actions">
              {profile.resumePath ? (
                <button
                  type="button"
                  className="floating-preview-button"
                  onClick={handlePreviewResume}
                  aria-label="Preview resume in browser"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  <span>Preview Resume</span>
                </button>
              ) : null}
              <DownloadButton href={profile.resumePath} label="Download Resume" />
              {socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-link"
                  aria-label={link.label ?? link.platform}
                >
                  <FontAwesomeIcon icon={link.icon} size="2x" />
                </a>
              ))}
            </div>
          </div>

          <div className="about-contact-strip hero-reveal hero-reveal-contact">
            <span className="about-contact-location">{profile.location}</span>
            {profile.email ? (
              <span className="contact-inline-link-wrap" style={{ display: 'inline-flex', alignItems: 'center' }}>
                <a className="contact-inline-link" href={`mailto:${profile.email}`}>
                  <strong>Email</strong>
                  <span>{profile.email}</span>
                </a>
                <button
                  type="button"
                  className={`copy-email-btn ${copiedEmail ? 'is-copied' : ''}`}
                  onClick={handleCopyEmail}
                  title="Copy email to clipboard"
                  aria-label="Copy email address"
                >
                  {copiedEmail ? (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </span>
            ) : null}
          </div>
        </div>
      </div>
      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        resumeUrl={profile.resumePath}
      />
    </section>
  );
};

export default About;
