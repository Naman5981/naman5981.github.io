import React, { useEffect } from 'react';
import '../styles/About.css';
import profilePic from '../assets/profile.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

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
              <h2>Backend Developer</h2>
              <p>
                A skilled backend developer with expertise in Java, system optimization, and Android development. Passionate about building efficient and scalable applications.
              </p>
            </div>
          </div>

          {/* Contact Card */}
          <div className="contact-card">
            <h3>Contact Me</h3>
            <p>Email: <a href="mailto:namansanadhya@gmail.com">namansanadhya@gmail.com</a></p>
            <p>Phone: +91 76651 55815</p>
            <div className="social-icons">
              <a 
                href="https://github.com/yourusername" 
                target="_blank" 
                rel="noopener noreferrer"
                className="icon-link"
              >
                <FontAwesomeIcon icon={faGithub} size="2x" />
              </a>
              <a 
                href="https://linkedin.com/in/yourusername" 
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
