import React from 'react';
import '../styles/Projects.css';

const Projects = () => (
  <section className="projects">
    <h2>Projects</h2>
    <div className="project">
      <h4>Virtual Account Management</h4>
      <p>Designed a scalable microservice for merchant-driven virtual accounts, enabling secure payment collection with validation and transaction consistency.</p>
    </div>
    <div className="project">
      <h4>SpringCore Banking</h4>
      <p>Developed a banking system with RBAC, transaction safety, and modular architecture for scalable and consistent operations.</p>
    </div>
    <div className="project">
      <h4>Officinal</h4>
      <p>Built a healthcare app with Dialogflow chatbot and Google Assistant integration for voice-based interaction and real-time updates.</p>
    </div>
    <div className="project">
      <h4>Daimaa</h4>
      <p>Developed a nutrition guidance app with chatbot integration and structured data models for scalable content delivery.</p>
    </div>
  </section>
);

export default Projects;
