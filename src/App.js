import React from 'react';
import About from '../src/components/About';
import Experience from '../src/components/Experience';
import Projects from '../src/components/Projects';
import Skills from '../src/components/Skills';
import Contact from '../src/components/Contact';
import './styles/App.css';

function App() {
  return (
    <div className="App">
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Contact />
    </div>
  );
}

export default App;
