import React from 'react';
import javaLogo from '../assets/tech-marquee/java.png';
import springBootLogo from '../assets/tech-marquee/springboot.png';
import postgresqlLogo from '../assets/tech-marquee/postgresql.png';
import mysqlLogo from '../assets/tech-marquee/mysql.png';
import dockerLogo from '../assets/tech-marquee/docker.png';
import redisLogo from '../assets/tech-marquee/redis.png';
import gitLogo from '../assets/tech-marquee/git.png';
import kafkaLogo from '../assets/tech-marquee/kafka.png';
import linuxLogo from '../assets/tech-marquee/linux.png';
import postmanLogo from '../assets/tech-marquee/postman.png';
import junitLogo from '../assets/tech-marquee/junit.png';
import githubLogo from '../assets/tech-marquee/github.png';
import mavenLogo from '../assets/tech-marquee/maven.png';
import chatgptLogo from '../assets/tech-marquee/chatgpt.png';
import firebaseLogo from '../assets/tech-marquee/firebase.png';
import n8nLogo from '../assets/tech-marquee/n8n.png';
import claudeLogo from '../assets/tech-marquee/claude.png';

export const transitionTechnologies = [
  { name: 'Java', logo: javaLogo },
  { name: 'Spring Boot', logo: springBootLogo },
  { name: 'PostgreSQL', logo: postgresqlLogo },
  { name: 'MySQL', logo: mysqlLogo },
  { name: 'Docker', logo: dockerLogo },
  { name: 'Redis', logo: redisLogo },
  { name: 'Git', logo: gitLogo },
  { name: 'Kafka', logo: kafkaLogo },
  { name: 'Linux', logo: linuxLogo },
  { name: 'Postman', logo: postmanLogo },
  { name: 'JUnit', logo: junitLogo },
  { name: 'GitHub', logo: githubLogo },
  { name: 'Maven', logo: mavenLogo },
  { name: 'ChatGPT', logo: chatgptLogo },
  { name: 'Firebase', logo: firebaseLogo },
  { name: 'n8n', logo: n8nLogo },
  { name: 'Claude', logo: claudeLogo }
];

const TechStrip = () => {
  const repeatedTechnologies = [
    ...transitionTechnologies,
    ...transitionTechnologies,
    ...transitionTechnologies
  ];

  return (
    <section className="portfolio-tech-strip" aria-hidden="true">
      <div className="portfolio-tech-strip-track">
        {repeatedTechnologies.map((technology, index) => (
          <React.Fragment key={`portfolio-tech-${index}`}>
            <div className="portfolio-tech-pill">
              <img src={technology.logo} alt="" loading="lazy" decoding="async" width="20" height="20" />
              <span>{technology.name}</span>
            </div>
            <span className="portfolio-tech-separator" aria-hidden="true" />
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default TechStrip;
