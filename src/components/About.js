import React, { useEffect, useState } from 'react';
import '../styles/About.css';
import profilePic from '../assets/profile.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import DownloadButton from './DownloadButton';

const About = () => {
  const [issuesSolvedCount, setIssuesSolvedCount] = useState(0);

  useEffect(() => {
    const targetValue = 30;
    const animationDuration = 700;
    const stepDuration = Math.max(Math.floor(animationDuration / targetValue), 16);

    let currentValue = 0;
    const intervalId = window.setInterval(() => {
      currentValue += 1;
      setIssuesSolvedCount(currentValue);

      if (currentValue >= targetValue) {
        window.clearInterval(intervalId);
      }
    }, stepDuration);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section className="about">
      <div className="about-hero">
        <div className="profile-image-wrap">
          <div className="profile-greeting" aria-hidden="true">
            Hi!!
          </div>
          <div className="profile-image">
            <img src={profilePic} alt="Profile" />
          </div>
        </div>

        <div className="about-text">
          <h1>Naman Sanadhya</h1>
          <h2>Java Backend Developer</h2>
          <p>
            I build scalable backend systems for banking and transaction-heavy platforms.
            Over 5+ years, I have worked across Spring Boot microservices, API design,
            transaction safety, production debugging, and modular service architecture.
          </p>

          <div className="about-stats">
            <div className="about-stat">
              <strong>5+</strong>
              <span>Years</span>
            </div>
            <div className="about-stat">
              <strong>{issuesSolvedCount}+</strong>
              <span>Issues Solved</span>
            </div>
            <div className="about-stat">
              <strong>3</strong>
              <span>Core Domains</span>
            </div>
            <div className="about-stat">
              <strong>100%</strong>
              <span>Backend Focus</span>
            </div>
          </div>

          <div className="about-actions">
            <a className="primary-action" href="mailto:namansanadhya@gmail.com">
              Get In Touch
            </a>
            <DownloadButton />
          </div>

          <div className="social-icons">
            <a
              href="https://github.com/naman5981"
              target="_blank"
              rel="noopener noreferrer"
              className="icon-link"
            >
                <FontAwesomeIcon icon={faGithub} size="2x" />
            </a>
            <a
              href="https://linkedin.com/in/namansanadhya"
              target="_blank"
              rel="noopener noreferrer"
              className="icon-link"
            >
                <FontAwesomeIcon icon={faLinkedin} size="2x" />
            </a>
          </div>

          <div className="about-contact-strip">
            <span>Jaipur, Rajasthan</span>
            <span>namansanadhya@gmail.com</span>
            <span>+91 76651 55815</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
