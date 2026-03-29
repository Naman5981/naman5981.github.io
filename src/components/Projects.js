import React from 'react';
import '../styles/Projects.css';

const projects = [
  {
    title: 'Employee Performance Tracker',
    href: 'https://github.com/Naman5981/Employee_Performance_Tracker',
    description:
        'Built an employee performance tracker for managing staff records, capturing performance metrics, and reviewing summary workflows in a lightweight management interface.'
  },
  {
    title: 'Virtual Account Management',
    description:
      'Designed a scalable microservice for merchant-driven virtual accounts, enabling secure payment collection with validation and transaction consistency.'
  },
  {
    title: 'SpringCore Banking',
    description:
      'Developed a banking system with RBAC, transaction safety, and modular architecture for scalable and consistent operations.'
  },
  {
    title: 'Officinal',
    description:
      'Built a healthcare app with Dialogflow chatbot and Google Assistant integration for voice-based interaction and real-time updates.'
  },
  {
    title: 'Daimaa',
    description:
      'Developed a nutrition guidance app with chatbot integration and structured data models for scalable content delivery.'
  }
];

const Projects = () => (
  <section className="projects">
    <h2>Projects</h2>
    {projects.map((project) => (
      <div className="project" key={project.title}>
        <h4>
          {project.href ? (
            <a href={project.href} target="_blank" rel="noopener noreferrer">
              {project.title}
            </a>
          ) : (
            project.title
          )}
        </h4>
        <p>{project.description}</p>
      </div>
    ))}
  </section>
);

export default Projects;
