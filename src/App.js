import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import About from './components/About';
import Education from './components/Education';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import SmartSearch from './components/SmartSearch';
import PortfolioError from './components/PortfolioError';
import { navigationSections, portfolioStats, workspacePanels } from './data/portfolioContent';
import { trackPortfolioEvent } from './services/analytics';
import { getProfile } from './services/portfolio';
import './styles/App.css';

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
  const [siteOwnerName, setSiteOwnerName] = useState('');
  const [hasPortfolioError, setHasPortfolioError] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [revealedSections, setRevealedSections] = useState(() => ({ about: true }));
  const [isSmartSearchOpen, setIsSmartSearchOpen] = useState(false);
  const headerRef = useRef(null);
  const sectionMap = useMemo(
    () =>
      navigationSections.reduce((lookup, section) => {
        lookup[section.id] = section.label;
        return lookup;
      }, {}),
    []
  );

  const activePanel = useMemo(
    () => workspacePanels.find((workspace) => workspace.id === activeWorkspace) ?? workspacePanels[0],
    [activeWorkspace]
  );

  useEffect(() => {
    let isMounted = true;

    const loadHeaderProfile = async () => {
      try {
        const profile = await getProfile();
        if (isMounted) {
          setSiteOwnerName(profile.fullName);
          setHasPortfolioError(false);
        }
      } catch (error) {
        console.error('Failed to load site owner from Supabase.', error);
        if (isMounted) {
          setHasPortfolioError(true);
        }
      }
    };

    loadHeaderProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('theme-preference', theme);
  }, [theme]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.documentElement.setAttribute('data-mobile-menu-open', 'true');
    } else {
      document.documentElement.removeAttribute('data-mobile-menu-open');
    }

    return () => {
      document.documentElement.removeAttribute('data-mobile-menu-open');
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isSmartSearchOpen) {
      document.documentElement.removeAttribute('data-ai-search-open');
      return undefined;
    }

    document.documentElement.setAttribute('data-ai-search-open', 'true');

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsSmartSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      document.documentElement.removeAttribute('data-ai-search-open');
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isSmartSearchOpen]);

  useEffect(() => {
    const sectionIds = navigationSections.map((section) => section.id);
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) {
      return undefined;
    }

    const observer = new window.IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio);

        if (visibleEntries.length > 0) {
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: '-22% 0px -58% 0px',
        threshold: [0.15, 0.32, 0.5]
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const sectionLabel = sectionMap[activeSection];

    if (!sectionLabel) {
      return;
    }

    trackPortfolioEvent({
      eventType: 'section_view',
      targetKey: activeSection,
      targetLabel: sectionLabel,
      source: 'section_navigation',
      oncePerSession: true
    });
  }, [activeSection, sectionMap]);

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

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (documentHeight <= 0) {
        setScrollProgress(0);
        return;
      }

      const nextProgress = Math.min((scrollTop / documentHeight) * 100, 100);
      setScrollProgress(nextProgress);
    };

    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress);

    return () => {
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('resize', updateScrollProgress);
    };
  }, []);

  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll('[data-reveal]'));

    if (!revealItems.length) {
      return undefined;
    }

    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            const sectionId =
              entry.target.id || entry.target.closest('[id]')?.id || entry.target.parentElement?.id;

            if (sectionId) {
              setRevealedSections((current) =>
                current[sectionId] ? current : { ...current, [sectionId]: true }
              );
            }

            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.18
      }
    );

    revealItems.forEach((item) => observer.observe(item));

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      setRevealedSections((current) => ({ ...current, [sectionId]: true }));

      setIsMobileMenuOpen(false);
      setActiveSection(sectionId);
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

  if (hasPortfolioError) {
    return <PortfolioError />;
  }

  return (
    <div className="site-shell">
      <div className="scroll-progress" aria-hidden="true">
        <span className="scroll-progress-bar" style={{ transform: `scaleX(${scrollProgress / 100})` }} />
      </div>

      <header ref={headerRef} className="site-header">
        <div className="brand-lockup">
          <span className="brand-kicker">NS / backend systems</span>
          <h1>{siteOwnerName}</h1>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className={`theme-toggle ${theme === 'light' ? 'light' : 'dark'}`}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
          >
            <span className="theme-toggle-track" aria-hidden="true">
              <span className="theme-toggle-icon theme-toggle-sun">{'\u2600'}</span>
              <span className="theme-toggle-icon theme-toggle-moon">{'\u263D'}</span>
              <span className="theme-toggle-thumb" />
            </span>
          </button>

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
          <div className="site-nav-inner">
            {navigationSections.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                className={activeSection === id ? 'active' : ''}
                aria-current={activeSection === id ? 'location' : undefined}
                onClick={() => scrollToSection(id)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="mobile-nav-meta">
            <span className="mobile-nav-caption">Navigate sections</span>
            <span className="mobile-nav-active">{sectionMap[activeSection]}</span>
          </div>
        </nav>
      </header>

      <button
        type="button"
        className={`menu-backdrop ${isMobileMenuOpen ? 'open' : ''}`}
        aria-label="Close navigation menu"
        aria-hidden={!isMobileMenuOpen}
        tabIndex={isMobileMenuOpen ? 0 : -1}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <main className="site-main">
        <section className="intro-shell" id="about">
          <div
            className={`intro-main module-card module-hero ${
              highlightedSection === 'about' ? 'section-flash' : ''
            } ${revealedSections.about ? 'is-visible' : ''}`}
            data-reveal
          >
            <About />
          </div>
        </section>

        <section className="stats-grid" aria-label="Key metrics">
          {portfolioStats.map((stat) => (
            <article key={stat.label} className="stat-card" data-reveal>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </article>
          ))}
        </section>

        <section className="workspace-panel" data-reveal>
          <div className="workspace-heading">
            <span className="eyebrow">Explore Sections</span>
            <h2>Browse the site by experience, projects, or technical depth.</h2>
          </div>

          <div className="workspace-tabs" role="tablist" aria-label="Portfolio workspaces">
            {workspacePanels.map((workspace) => (
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
              } ${revealedSections.experience ? 'is-visible' : ''}`}
              data-reveal
            >
              <Experience />
            </section>

            <section
              id="projects"
              className={`module-card ${
                highlightedSection === 'projects' ? 'section-flash' : ''
              } ${revealedSections.projects ? 'is-visible' : ''}`}
              data-reveal
            >
              <Projects />
            </section>
          </div>

          <aside className="secondary-column">
            <section className="module-card compact-card is-visible" data-reveal>
              <AnalyticsDashboard />
            </section>

            <section
              id="skills"
              className={`module-card compact-card ${
                highlightedSection === 'skills' ? 'section-flash' : ''
              } ${revealedSections.skills ? 'is-visible' : ''}`}
              data-reveal
            >
              <Skills />
            </section>

            <section
              id="education"
              className={`module-card compact-card ${
                highlightedSection === 'education' ? 'section-flash' : ''
              } ${revealedSections.education ? 'is-visible' : ''}`}
              data-reveal
            >
              <Education />
            </section>

            <section
              id="achievements"
              className={`module-card compact-card ${
                highlightedSection === 'achievements' ? 'section-flash' : ''
              } ${revealedSections.achievements ? 'is-visible' : ''}`}
              data-reveal
            >
              <Achievements />
            </section>
          </aside>
        </div>
      </main>

        <button
          type="button"
          className={`smart-search-launcher ${isSmartSearchOpen ? 'open' : ''}`}
          aria-label={isSmartSearchOpen ? 'Close AI search' : 'Open AI search'}
          aria-expanded={isSmartSearchOpen}
          onClick={() => setIsSmartSearchOpen((current) => !current)}
        >
          <span className="smart-search-launcher-mark" aria-hidden="true">
            {isSmartSearchOpen ? (
              <span className="smart-search-launcher-close-glyph">X</span>
            ) : (
              <>
                <svg viewBox="0 0 24 24" role="presentation" focusable="false">
                  <path d="M10.5 4.75a5.75 5.75 0 1 0 0 11.5a5.75 5.75 0 0 0 0-11.5Zm0-1.5a7.25 7.25 0 1 1 0 14.5a7.25 7.25 0 0 1 0-14.5Zm6.31 12.5l4 4a.75.75 0 1 1-1.06 1.06l-4-4a.75.75 0 0 1 1.06-1.06Z" />
                </svg>
                <span>AI</span>
              </>
            )}
          </span>
          <span className="smart-search-launcher-label">{isSmartSearchOpen ? 'Close' : 'AI Search'}</span>
        </button>

      <SmartSearch
        isOpen={isSmartSearchOpen}
        onClose={() => setIsSmartSearchOpen(false)}
        onNavigate={scrollToSection}
      />

      <SpeedInsights />
    </div>
  );
}

export default App;
