import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
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
import { navigationSections, portfolioStats } from './data/portfolioContent';
import { trackPortfolioEvent } from './services/analytics';
import { getProfile } from './services/portfolio';
import javaLogo from './assets/tech-marquee/java.png';
import springBootLogo from './assets/tech-marquee/springboot.png';
import postgresqlLogo from './assets/tech-marquee/postgresql.png';
import mysqlLogo from './assets/tech-marquee/mysql.png';
import dockerLogo from './assets/tech-marquee/docker.png';
import redisLogo from './assets/tech-marquee/redis.png';
import gitLogo from './assets/tech-marquee/git.png';
import kafkaLogo from './assets/tech-marquee/kafka.png';
import linuxLogo from './assets/tech-marquee/linux.png';
import postmanLogo from './assets/tech-marquee/postman.png';
import junitLogo from './assets/tech-marquee/junit.png';
import githubLogo from './assets/tech-marquee/github.png';
import mavenLogo from './assets/tech-marquee/maven.png';
import chatgptLogo from './assets/tech-marquee/chatgpt.png';
import firebaseLogo from './assets/tech-marquee/firebase.png';
import n8nLogo from './assets/tech-marquee/n8n.png';
import claudeLogo from './assets/tech-marquee/claude.png';
import './styles/App.css';

const transitionTechnologies = [
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

function App() {
  const [theme, setTheme] = useState(() => {
    const storedTheme = window.localStorage.getItem('theme-preference');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });
  const [activePortfolioTab, setActivePortfolioTab] = useState('experience');
  const [mountedPortfolioTabs, setMountedPortfolioTabs] = useState(() => ({ experience: true }));
  const [outgoingPortfolioTab, setOutgoingPortfolioTab] = useState(null);
  const [portfolioSlideDirection, setPortfolioSlideDirection] = useState('forward');
  const [pendingPortfolioScrollSection, setPendingPortfolioScrollSection] = useState('');
  const [isPortfolioSelectorOpen, setIsPortfolioSelectorOpen] = useState(false);
  const [portfolioStageHeight, setPortfolioStageHeight] = useState(0);
  const [highlightedSection, setHighlightedSection] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderCondensed, setIsHeaderCondensed] = useState(false);
  const [siteOwnerName, setSiteOwnerName] = useState('');
  const [hasPortfolioError, setHasPortfolioError] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [revealedSections, setRevealedSections] = useState(() => ({ about: true }));
  const [isSmartSearchOpen, setIsSmartSearchOpen] = useState(false);
  const [portfolioTabIndicator, setPortfolioTabIndicator] = useState({ width: 0, left: 0, top: 0, height: 0 });
  const headerRef = useRef(null);
  const portfolioPanelRef = useRef(null);
  const portfolioSelectorRef = useRef(null);
  const portfolioTabsRef = useRef(null);
  const portfolioTabButtonRefs = useRef({});
  const portfolioPaneRefs = useRef({});
  const portfolioTransitionTimeoutRef = useRef(null);
  const sectionMap = useMemo(
    () =>
      navigationSections.reduce((lookup, section) => {
        lookup[section.id] = section.label;
        return lookup;
      }, {}),
    []
  );

  const smartSearchContext = useMemo(() => {
    if (activeSection === 'about') {
      return {
        label: 'Ask about the portfolio',
        context: 'Profile'
      };
    }

    const sectionLabel = sectionMap[activeSection] || 'Portfolio';

    return {
      label: `Ask about ${sectionLabel}`,
      context: sectionLabel
    };
  }, [activeSection, sectionMap]);

  const portfolioTabs = useMemo(
    () => [
      {
        id: 'experience',
        label: 'Experience',
        layout: 'wide',
        component: Experience
      },
      {
        id: 'projects',
        label: 'Projects',
        layout: 'wide',
        component: Projects
      },
      {
        id: 'skills',
        label: 'Skills',
        layout: 'compact',
        component: Skills
      },
      {
        id: 'education',
        label: 'Education',
        layout: 'compact',
        component: Education
      },
      {
        id: 'achievements',
        label: 'Achievements',
        layout: 'compact',
        component: Achievements
      },
      {
        id: 'visitor-signals',
        label: 'Visitor Signals',
        layout: 'compact',
        component: AnalyticsDashboard
      }
    ],
    []
  );

  const activePortfolioPanel =
    portfolioTabs.find((tab) => tab.id === activePortfolioTab) ?? portfolioTabs[0];
  const portfolioTabIds = useMemo(() => new Set(portfolioTabs.map((tab) => tab.id)), [portfolioTabs]);
  const outgoingPortfolioPanel = outgoingPortfolioTab
    ? portfolioTabs.find((tab) => tab.id === outgoingPortfolioTab) ?? null
    : null;

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
    if (!isPortfolioSelectorOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!portfolioSelectorRef.current?.contains(event.target)) {
        setIsPortfolioSelectorOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsPortfolioSelectorOpen(false);
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isPortfolioSelectorOpen]);

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
    const syncHeaderState = () => {
      setIsHeaderCondensed(window.scrollY > 20);
    };

    syncHeaderState();
    window.addEventListener('scroll', syncHeaderState, { passive: true });

    return () => {
      window.removeEventListener('scroll', syncHeaderState);
    };
  }, []);

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

  useEffect(() => {
    setRevealedSections((current) =>
      current[activePortfolioTab] ? current : { ...current, [activePortfolioTab]: true }
    );
    setMountedPortfolioTabs((current) =>
      current[activePortfolioTab] ? current : { ...current, [activePortfolioTab]: true }
    );
  }, [activePortfolioTab]);

  useEffect(() => {
    return () => {
      if (portfolioTransitionTimeoutRef.current) {
        window.clearTimeout(portfolioTransitionTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!pendingPortfolioScrollSection || activePortfolioTab !== pendingPortfolioScrollSection) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      const panel = portfolioPanelRef.current;

      if (panel) {
        setOutgoingPortfolioTab(null);
        scrollElementIntoView(panel, pendingPortfolioScrollSection);
      }

      setPendingPortfolioScrollSection('');
    }, 80);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [activePortfolioTab, pendingPortfolioScrollSection]);

  useLayoutEffect(() => {
    const tabRow = portfolioTabsRef.current;
    const activeButton = portfolioTabButtonRefs.current[activePortfolioTab];

    if (!tabRow || !activeButton) {
      return undefined;
    }

    const updateIndicator = () => {
      const rowRect = tabRow.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      setPortfolioTabIndicator({
        width: buttonRect.width,
        left: buttonRect.left - rowRect.left,
        top: buttonRect.top - rowRect.top,
        height: buttonRect.height
      });
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);

    return () => {
      window.removeEventListener('resize', updateIndicator);
    };
  }, [activePortfolioTab, portfolioTabs]);

  useLayoutEffect(() => {
    const activePane = portfolioPaneRefs.current[activePortfolioTab];
    const outgoingPane = outgoingPortfolioTab ? portfolioPaneRefs.current[outgoingPortfolioTab] : null;

    const updateStageHeight = () => {
      const nextHeight = Math.max(
        activePane?.offsetHeight ?? 0,
        outgoingPane?.offsetHeight ?? 0
      );

      if (nextHeight > 0) {
        setPortfolioStageHeight(nextHeight);
      }
    };

    updateStageHeight();
    window.addEventListener('resize', updateStageHeight);

    return () => {
      window.removeEventListener('resize', updateStageHeight);
    };
  }, [activePortfolioTab, outgoingPortfolioTab, mountedPortfolioTabs]);

  useEffect(() => {
    if (!portfolioPanelRef.current) {
      return;
    }

    portfolioPanelRef.current.classList.add('is-visible');
  }, [activePortfolioTab]);

  if (hasPortfolioError) {
    return <PortfolioError />;
  }

  const startPortfolioTabTransition = (nextTabId) => {
    if (nextTabId === activePortfolioTab) {
      return;
    }

    const currentIndex = portfolioTabs.findIndex((tab) => tab.id === activePortfolioTab);
    const nextIndex = portfolioTabs.findIndex((tab) => tab.id === nextTabId);

    setPortfolioSlideDirection(nextIndex > currentIndex ? 'forward' : 'backward');
    setOutgoingPortfolioTab(activePortfolioTab);
    setMountedPortfolioTabs((current) =>
      current[nextTabId] ? current : { ...current, [nextTabId]: true }
    );
    setActivePortfolioTab(nextTabId);

    if (portfolioTransitionTimeoutRef.current) {
      window.clearTimeout(portfolioTransitionTimeoutRef.current);
    }

    portfolioTransitionTimeoutRef.current = window.setTimeout(() => {
      setOutgoingPortfolioTab(null);
    }, 420);
    setIsPortfolioSelectorOpen(false);
  };

  const scrollElementIntoView = (element, sectionId) => {
    setRevealedSections((current) => ({ ...current, [sectionId]: true }));
    element.classList.add('is-visible');
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
      element.getBoundingClientRect().top + window.scrollY - headerHeight - extraOffset;
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
  };

  const scrollToSection = (sectionId) => {
    if (portfolioTabIds.has(sectionId)) {
      if (activePortfolioTab !== sectionId) {
        setPendingPortfolioScrollSection(sectionId);
        startPortfolioTabTransition(sectionId);
        return;
      }

      if (portfolioPanelRef.current) {
        scrollElementIntoView(portfolioPanelRef.current, sectionId);
      }

      return;
    }

    const section = document.getElementById(sectionId);
    if (section) {
      scrollElementIntoView(section, sectionId);
    }
  };

  const handlePortfolioTabChange = (nextTabId) => {
    startPortfolioTabTransition(nextTabId);
  };

  return (
    <div className="site-shell">
      <div className="scroll-progress" aria-hidden="true">
        <span className="scroll-progress-bar" style={{ transform: `scaleX(${scrollProgress / 100})` }} />
      </div>

      <header ref={headerRef} className={`site-header ${isHeaderCondensed ? 'is-condensed' : ''}`}>
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
              <span className="theme-toggle-thumb">
                <span className="theme-toggle-thumb-core">
                  <span className="theme-toggle-thumb-symbol theme-toggle-thumb-sun-symbol">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="4.1" />
                      <path d="M12 2.6v2.4M12 19v2.4M4.85 4.85l1.7 1.7M17.45 17.45l1.7 1.7M2.6 12H5M19 12h2.4M4.85 19.15l1.7-1.7M17.45 6.55l1.7-1.7" />
                    </svg>
                  </span>
                  <span className="theme-toggle-thumb-symbol theme-toggle-thumb-moon-symbol">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16.8 14.7A7.2 7.2 0 0 1 9.3 7.2 7.6 7.6 0 1 0 16.8 14.7Z" />
                    </svg>
                  </span>
                </span>
              </span>
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
                className={`${activeSection === id ? 'active' : ''} ${id === 'about' ? 'nav-home-link' : ''}`.trim()}
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

        <section className="portfolio-tech-strip" aria-hidden="true" data-reveal>
          <div className="portfolio-tech-strip-track">
            {[...transitionTechnologies, ...transitionTechnologies, ...transitionTechnologies].map((technology, index) => (
              <React.Fragment key={`portfolio-tech-${index}`}>
                <div className="portfolio-tech-pill">
                  <img src={technology.logo} alt="" loading="lazy" />
                  <span>{technology.name}</span>
                </div>
                <span className="portfolio-tech-separator" aria-hidden="true" />
              </React.Fragment>
            ))}
          </div>
        </section>

        <section className="portfolio-tabs-shell" data-reveal>
          <div className="portfolio-tabs-header">
            <div>
              <span className="eyebrow">Core Portfolio</span>
            </div>

            <div
              ref={portfolioTabsRef}
              className="portfolio-tabs-row"
              role="tablist"
              aria-label="Portfolio sections"
            >
              <span
                className="portfolio-tabs-indicator"
                aria-hidden="true"
                style={{
                  width: `${portfolioTabIndicator.width}px`,
                  height: `${portfolioTabIndicator.height}px`,
                  transform: `translate(${portfolioTabIndicator.left}px, ${portfolioTabIndicator.top}px)`
                }}
              />
              {portfolioTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  ref={(node) => {
                    if (node) {
                      portfolioTabButtonRefs.current[tab.id] = node;
                    }
                  }}
                  aria-selected={activePortfolioPanel.id === tab.id}
                  className={activePortfolioPanel.id === tab.id ? 'active' : ''}
                  onClick={() => handlePortfolioTabChange(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div ref={portfolioSelectorRef} className="portfolio-selector">
              <div className="portfolio-selector-meta">
                <p>Choose a section to view.</p>
              </div>

              <button
                type="button"
                className={`portfolio-selector-trigger ${isPortfolioSelectorOpen ? 'open' : ''}`}
                aria-expanded={isPortfolioSelectorOpen}
                aria-haspopup="listbox"
                onClick={() => setIsPortfolioSelectorOpen((current) => !current)}
              >
                <span className="portfolio-selector-kicker">Viewing</span>
                <strong>{activePortfolioPanel.label}</strong>
                <span className="portfolio-selector-icon" aria-hidden="true">
                  <span />
                  <span />
                </span>
              </button>

              <div className={`portfolio-selector-sheet ${isPortfolioSelectorOpen ? 'open' : ''}`}>
                <div className="portfolio-selector-list" role="listbox" aria-label="Portfolio sections">
                  {portfolioTabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      role="option"
                      aria-selected={activePortfolioPanel.id === tab.id}
                      className={activePortfolioPanel.id === tab.id ? 'active' : ''}
                      onClick={() => handlePortfolioTabChange(tab.id)}
                    >
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <section
            ref={portfolioPanelRef}
            id={
              activePortfolioPanel.id === 'visitor-signals'
                ? 'visitor-signals'
                : activePortfolioPanel.id
            }
            className={`module-card portfolio-tab-panel portfolio-tab-panel-${activePortfolioPanel.layout} ${
              highlightedSection === activePortfolioPanel.id ? 'section-flash' : ''
            } ${revealedSections[activePortfolioPanel.id] ? 'is-visible' : ''}`}
            data-reveal
          >
            <div
              className={`portfolio-tab-stage portfolio-tab-stage-${activePortfolioPanel.layout}`}
              style={portfolioStageHeight ? { minHeight: `${portfolioStageHeight}px` } : undefined}
            >
              {portfolioTabs.map((tab) => {
                if (!mountedPortfolioTabs[tab.id]) {
                  return null;
                }

                const isActive = tab.id === activePortfolioTab;
                const isOutgoing = tab.id === outgoingPortfolioTab;
                const paneClassName = [
                  'portfolio-tab-slide',
                  `portfolio-tab-slide-${tab.layout}`,
                  isActive && outgoingPortfolioPanel
                    ? `portfolio-tab-slide-in portfolio-tab-slide-${portfolioSlideDirection}`
                    : '',
                  isActive && !outgoingPortfolioPanel ? 'portfolio-tab-slide-static' : '',
                  isOutgoing
                    ? `portfolio-tab-slide-out portfolio-tab-slide-${portfolioSlideDirection}`
                    : '',
                  !isActive && !isOutgoing ? 'portfolio-tab-slide-hidden' : ''
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <div
                    key={tab.id}
                    ref={(node) => {
                      if (node) {
                        portfolioPaneRefs.current[tab.id] = node;
                      }
                    }}
                    className={paneClassName}
                    aria-hidden={!isActive}
                  >
                    <tab.component />
                  </div>
                );
              })}
            </div>
          </section>
        </section>
      </main>

      <p className="site-signoff">Designed with care, shaped with AI.</p>

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
          {!isSmartSearchOpen ? (
            <span className="smart-search-launcher-context">{smartSearchContext.label}</span>
          ) : null}
        </button>

      <SmartSearch
        isOpen={isSmartSearchOpen}
        onClose={() => setIsSmartSearchOpen(false)}
        onNavigate={scrollToSection}
        activeContext={smartSearchContext.context}
      />

      <SpeedInsights />
    </div>
  );
}

export default App;
