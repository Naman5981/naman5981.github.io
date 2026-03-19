import React, { useEffect } from 'react';
import '../styles/About.css';
import profilePic from '../assets/profile.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import DownloadButton from './DownloadButton'; // Importing the download button

const About = () => {
  // Restore the custom cursor functionality
  useEffect(() => {
    const cursor = document.querySelector('.cursor');
    const handleMouseMove = (event) => {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* Custom Cursor */}
      <div className="cursor"></div>

      <section className="about">
        <div className="about-container">
          {/* About Section */}
          <div className="about-content">
            <div className="profile-image">
              <img src={profilePic} alt="Profile" />
            </div>
            <div className="about-text">
              <h1>Naman Sanadhya</h1>
              <h2>Backend Engineer</h2>
              <p>
                Backend Engineer with 5+ years of experience building scalable financial systems using Java, Spring Boot, and microservices. Strong in API design, transaction management, and high-availability systems.
              </p>
              {/* Download Resume Button */}
              <DownloadButton />
            </div>
          </div>

          {/* Contact Card */}
          <div className="contact-card">
            <h3>Contact Me</h3>
            <p>Email: <a href="mailto:namansanadhya@gmail.com">namansanadhya@gmail.com</a></p>
            <p>Phone: +91 76651 55815</p>
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
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
