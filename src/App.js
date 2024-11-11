import React from 'react';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import './styles/App.css';

function App() {
  return (
    <div className="app-container">
      {/* Left Section with About and Experience */}
      <div className="left-section">
        <div className="section-wrapper">
          <About />
        </div>
        <div className="section-wrapper">
          <Experience />
        </div>
      </div>

      {/* Right Section with Skills and Projects */}
      <div className="right-section">
        <div className="section-wrapper">
          <Skills />
        </div>
        <div className="section-wrapper">
          <Projects />
        </div>
      </div>
    </div>
  );
}

export default App;
