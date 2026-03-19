import React from 'react';
import './App.css';
import About from './About';
import Experience from './Experience';
import Education from './Education';
import Skills from './Skills';
import Projects from './Projects';
import Achievements from './Achievements';
import DownloadButton from './DownloadButton';

function App() {
  return (
    <div className="app-container">
      <div className="left-section">
        <div className="section-wrapper">
          <About />
        </div>
        <div className="section-wrapper">
          <Experience />
        </div>
      </div>
      <div className="right-section">
        <div className="section-wrapper">
          <Education />
        </div>
        <div className="section-wrapper">
          <Skills />
        </div>
        <div className="section-wrapper">
          <Projects />
        </div>
        <div className="section-wrapper">
          <Achievements />
        </div>
      </div>
      <DownloadButton />
    </div>
  );
}

export default App;
