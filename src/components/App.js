import React from 'react';
import './App.css';
import About from './components/About';
import Experience from './components/Experience';
import Education from './components/Education';
import Skills from './components/Skills';
import Projects from './components/Projects';
import DownloadButton from './components/DownloadButton';

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
      </div>
      <DownloadButton />
    </div>
  );
}

export default App;
