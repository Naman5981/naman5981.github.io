import React from 'react';
import '../styles/Projects.css';

const Projects = () => (
  <section className="projects">
    <h2>Projects</h2>
    <div className="project">
      <h4>Location App</h4>
      <p>A communication app with enhanced UI using RxJava.</p>
      <p><b>Role:</b> Developed a multilingual educational mobile application in local tribal languages equips tribal communities with knowledge on prevalent health conditions, promoting self-diagnosis and treatment options. </p>
    </div>
    <div className="project">
      <h4>Officinal</h4>
      <p>An educational app promoting health awareness in tribal languages.</p>
      <p><b>Role:</b> Developed a chatbot using Dialogflow and integrated a webview within an Android application to enable seamless video playback. </p>
    </div>
    <div className="project">
      <h4>DaiMaa</h4>
      <p>Composed a native mobile healthcare app offering personalized nutrition guidance for expectant mothers within a comprehensive maternal healthcare platform </p>
    </div>
  </section>
);

export default Projects;
