import React from 'react';
import './Experience.css';

const Experience = () => (
  <section className="experience">
    <h2>Work Experience</h2>
    <div className="job">
      <h3>Infosys - Systems Engineer</h3>
      <p>05/2022 - Present | Jaipur, Rajasthan</p>
      <ul>
        <li>Improved system performance by 40% with Java and Spring Boot.</li>
        <li>Reduced project delivery time by 25%.</li>
      </ul>
    </div>
    <div className="job">
      <h3>Tech Mahindra - Associate Software Engineer</h3>
      <p>01/2021 - 04/2022 | Mumbai, Maharashtra</p>
      <ul>
        <li>Enhanced BCCI and IPL mobile apps by 30%.</li>
      </ul>
    </div>
  </section>
);

export default Experience;
