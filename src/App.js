import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import About from './components/About';
import Education from './components/Education';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import './styles/App.css';

const workspaces = [
  {
    id: 'overview',
    label: 'Overview',
    eyebrow: 'Introduction',
    title: 'Backend engineer focused on systems that need to stay reliable under pressure.',
    description:
      'The homepage is now organized as a technical profile: who I am, what I build, where I have worked, and the systems skills I bring into production environments.',
    metrics: ['5+ years building backend systems', 'Fintech and platform experience', 'Microservices, APIs, and production support'],
    links: ['about', 'experience', 'skills']
  },
  {
    id: 'experience',
    label: 'Experience',
    eyebrow: 'Career',
    title: 'Work shaped by banking workflows, backend architecture, and operational ownership.',
    description:
      'The experience section is the backbone of the site, showing how product delivery, debugging, and system design come together across real-world teams and high-volume platforms.',
    metrics: ['Spring Boot services', 'Incident response and fixes', 'Scalable transaction workflows'],
    links: ['experience', 'achievements']
  },
  {
    id: 'projects',
    label: 'Projects',
    eyebrow: 'Selected Work',
    title: 'A project section that can grow into deeper engineering case studies.',
    description:
      'Instead of standalone resume bullets, projects now live as part of the website flow and can be expanded next into architecture, outcomes, and implementation details.',
    metrics: ['Banking systems', 'Healthcare assistants', 'Mobile and backend builds'],
    links: ['projects']
  },
  {
    id: 'toolkit',
    label: 'Toolkit',
    eyebrow: 'Capabilities',
    title: 'Skills, education, and recognition grouped as supporting depth.',
    description:
      'This area supports the main story with stack familiarity, formal education, and achievements rather than competing with the core experience narrative.',
    metrics: ['Languages and APIs', 'Cloud and CI/CD', 'Architecture and automation'],
    links: ['skills', 'education']
  }
];

const stats = [
  { value: '5+', label: 'Years shipping backend systems' },
  { value: '3', label: 'Core tracks: banking, platforms, automation' },
  { value: '30+', label: 'Production issues investigated and resolved' }
];

const sectionMap = {
  about: 'Profile',
  experience: 'Experience',
  projects: 'Projects',
  skills: 'Toolkit',
  education: 'Education',
  achievements: 'Achievements'
};

function App() {
  const [theme, setTheme] = useState(() => {
    const storedTheme = window.localStorage.getItem('theme-preference');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });
  const [activeWorkspace, setActiveWorkspace] = useState('overview');
  const [highlightedSection, setHighlightedSection] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef(null);

  const activePanel = useMemo(
    () => workspaces.find((workspace) => workspace.id === activeWorkspace) ?? workspaces[0],
    [activeWorkspace]
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('theme-preference', theme);
  }, [theme]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!headerRef.current?.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      setIsMobileMenuOpen(false);
      const header = document.querySelector('.site-header');
      const headerStyles = header ? window.getComputedStyle(header) : null;
      const isPinnedHeader = headerStyles
        ? headerStyles.position === 'sticky' || headerStyles.position === 'fixed'
        : false;
      const headerHeight = header && isPinnedHeader ? header.getBoundingClientRect().height : 0;
      const extraOffset = 24;
      const targetPosition =
        section.getBoundingClientRect().top + window.scrollY - headerHeight - extraOffset;
      const finalTop = Math.max(targetPosition, 0);

      setHighlightedSection('');
      window.scrollTo({
        top: finalTop,
        behavior: 'smooth'
      });

      let attempts = 0;
      const maxAttempts = 40;
      const triggerHighlight = () => {
        setHighlightedSection(sectionId);
        window.setTimeout(() => {
          setHighlightedSection((current) => (current === sectionId ? '' : current));
        }, 850);
      };

      const waitForArrival = () => {
        const distance = Math.abs(window.scrollY - finalTop);
        attempts += 1;

        if (distance <= 8 || attempts >= maxAttempts) {
          triggerHighlight();
          return;
        }

        window.setTimeout(waitForArrival, 40);
      };

      window.setTimeout(waitForArrival, 120);
    }
  };

  return (
    <div className="site-shell">
      <header ref={headerRef} className="site-header">
        <div className="brand-lockup">
          <span className="brand-kicker">NS / backend systems</span>
          <h1>Naman Sanadhya</h1>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className={`menu-toggle ${isMobileMenuOpen ? 'open' : ''}`}
            aria-expanded={isMobileMenuOpen}
            aria-controls="primary-navigation"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setIsMobileMenuOpen((current) => !current)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <nav
          id="primary-navigation"
          className={`site-nav ${isMobileMenuOpen ? 'menu-open' : ''}`}
          aria-label="Primary"
        >
          {Object.entries(sectionMap).map(([id, label]) => (
            <button key={id} type="button" onClick={() => scrollToSection(id)}>
              {label}
            </button>
          ))}

          <button
            type="button"
            className={`theme-toggle ${theme === 'light' ? 'light' : 'dark'}`}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
          >
            <span className="theme-toggle-track" aria-hidden="true">
              <span className="theme-toggle-icon theme-toggle-sun">{'\u2600'}</span>
              <span className="theme-toggle-icon theme-toggle-moon">{'\u263E'}</span>
              <span className="theme-toggle-thumb" />
            </span>
          </button>
        </nav>
      </header>

      {isMobileMenuOpen ? (
        <button
          type="button"
          className="menu-backdrop"
          aria-label="Close navigation menu"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      ) : null}

      <main className="site-main">
        <section className="intro-shell" id="about">
          <div
            className={`intro-main module-card module-hero ${
              highlightedSection === 'about' ? 'section-flash' : ''
            }`}
          >
            <About />
          </div>
        </section>

        <section className="stats-grid" aria-label="Key metrics">
          {stats.map((stat) => (
            <article key={stat.label} className="stat-card">
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </article>
          ))}
        </section>

        <section className="workspace-panel">
          <div className="workspace-heading">
            <span className="eyebrow">Explore Sections</span>
            <h2>Browse the site by experience, projects, or technical depth.</h2>
          </div>

          <div className="workspace-tabs" role="tablist" aria-label="Portfolio workspaces">
            {workspaces.map((workspace) => (
              <button
                key={workspace.id}
                type="button"
                role="tab"
                aria-selected={activeWorkspace === workspace.id}
                className={activeWorkspace === workspace.id ? 'active' : ''}
                onClick={() => setActiveWorkspace(workspace.id)}
              >
                {workspace.label}
              </button>
            ))}
          </div>

          <div className="workspace-content">
            <div>
              <span className="eyebrow">{activePanel.eyebrow}</span>
              <h3>{activePanel.title}</h3>
              <p>{activePanel.description}</p>
            </div>

            <div className="workspace-metrics">
              {activePanel.metrics.map((metric) => (
                <span key={metric}>{metric}</span>
              ))}
            </div>

            <div className="workspace-links">
              {activePanel.links.map((link) => (
                <button key={link} type="button" onClick={() => scrollToSection(link)}>
                  Open {sectionMap[link]}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="content-grid">
          <div className="primary-column">
            <section
              id="experience"
              className={`module-card ${
                highlightedSection === 'experience' ? 'section-flash' : ''
              }`}
            >
              <Experience />
            </section>

            <section
              id="projects"
              className={`module-card ${
                highlightedSection === 'projects' ? 'section-flash' : ''
              }`}
            >
              <Projects />
            </section>
          </div>

          <aside className="secondary-column">
            <section
              id="skills"
              className={`module-card compact-card ${
                highlightedSection === 'skills' ? 'section-flash' : ''
              }`}
            >
              <Skills />
            </section>

            <section
              id="education"
              className={`module-card compact-card ${
                highlightedSection === 'education' ? 'section-flash' : ''
              }`}
            >
              <Education />
            </section>

            <section
              id="achievements"
              className={`module-card compact-card ${
                highlightedSection === 'achievements' ? 'section-flash' : ''
              }`}
            >
              <Achievements />
            </section>
          </aside>
        </div>
      </main>

      <SpeedInsights />
    </div>
  );
}

export default App;
