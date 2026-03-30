import React, { useEffect, useMemo, useState } from 'react';
import '../styles/About.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import DownloadButton from './DownloadButton';
import { getProfile } from '../services/portfolio';

const iconMap = {
  github: faGithub,
  linkedin: faLinkedin
};

const About = () => {
  const [profile, setProfile] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [issuesSolvedCount, setIssuesSolvedCount] = useState(0);

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
    const targetValue = Math.max(profile?.issuesSolvedTarget ?? 0, 0);
    if (targetValue === 0) {
      setIssuesSolvedCount(0);
      return undefined;
    }

    const animationDuration = 700;
    const stepDuration = Math.max(Math.floor(animationDuration / targetValue), 16);

    let currentValue = 0;
    setIssuesSolvedCount(0);

    const intervalId = window.setInterval(() => {
      currentValue += 1;
      setIssuesSolvedCount(currentValue);

      if (currentValue >= targetValue) {
        window.clearInterval(intervalId);
      }
    }, stepDuration);

    return () => window.clearInterval(intervalId);
  }, [profile?.issuesSolvedTarget]);

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

  if (!profile && !hasError) {
    return null;
  }

  if (hasError || !profile) {
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

  return (
    <section className="about">
      <div className="about-hero">
        <div className="profile-image-wrap">
          <div className="profile-greeting" aria-hidden="true">
            Hi!!
          </div>
          <div className="profile-image">
            {profile.profileImagePath ? <img src={profile.profileImagePath} alt="Profile" /> : null}
          </div>
        </div>

        <div className="about-text">
          <h1>{profile.fullName}</h1>
          <h2>{profile.headline}</h2>
          <p>{profile.bio}</p>

          <div className="about-stats">
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

          <div className="about-actions">
            <a className="primary-action" href={profile.email ? `mailto:${profile.email}` : '#'}>
              Get In Touch
            </a>
            <DownloadButton href={profile.resumePath} />
          </div>

          <div className="social-icons">
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

          <div className="about-contact-strip">
            <span>{profile.location}</span>
            <span>{profile.email}</span>
            <span>{profile.phone}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
