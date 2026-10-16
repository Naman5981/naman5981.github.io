import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Header from './components/Header';
import About from './components/About';
import TechStrip from './components/TechStrip';
import PortfolioTabsNav from './components/PortfolioTabsNav';
import PortfolioClosing from './components/PortfolioClosing';
import { navigationSections } from './data/portfolioContent';
import { trackPortfolioEvent } from './services/analytics';
import { getProfile } from './services/portfolio';
import { useTheme } from './hooks/useTheme';
import { useScrollProgress } from './hooks/useScrollProgress';
import './styles/App.css';

const Experience = React.lazy(() => import('./components/Experience'));
const Projects = React.lazy(() => import('./components/Projects'));
const Skills = React.lazy(() => import('./components/Skills'));
const Education = React.lazy(() => import('./components/Education'));
const Achievements = React.lazy(() => import('./components/Achievements'));
const AnalyticsDashboard = React.lazy(() => import('./components/AnalyticsDashboard'));
const SmartSearch = React.lazy(() => import('./components/SmartSearch'));
const PortfolioError = React.lazy(() => import('./components/PortfolioError'));

const PORTFOLIO_TABS = [
  { id: 'experience', label: 'Experience', layout: 'wide', component: Experience },
  { id: 'projects', label: 'Projects', layout: 'wide', component: Projects },
  { id: 'skills', label: 'Skills', layout: 'compact', component: Skills },
  { id: 'education', label: 'Education', layout: 'compact', component: Education },
  { id: 'achievements', label: 'Achievements', layout: 'compact', component: Achievements }
];

const TAB_CONTEXT_DESCRIPTIONS = {
  experience: 'Roles, systems, and production ownership across backend-heavy work.',
  projects: 'Selected builds that show execution, product judgment, and technical range.',
  skills: 'The technical stack and backend depth behind the work.',
  education: 'The formal foundation supporting the applied engineering path.',
  achievements: 'Signals of recognition, competitive work, and momentum over time.'
};

const TAB_IDS = new Set(PORTFOLIO_TABS.map((tab) => tab.id));
const SECTION_MAP = navigationSections.reduce((acc, section) => {
  acc[section.id] = section.label;
  return acc;
}, {});

const PROFILE_SECTION = navigationSections.find((section) => section.id === 'about');
const WORK_SECTIONS = navigationSections.filter((section) => section.id !== 'about');

function App() {
  const { theme, toggleTheme } = useTheme();
  const scrollProgress = useScrollProgress();

  const [activePortfolioTab, setActivePortfolioTab] = useState('experience');
  const [mountedPortfolioTabs, setMountedPortfolioTabs] = useState(() => ({ experience: true }));
  const [outgoingPortfolioTab, setOutgoingPortfolioTab] = useState(null);
  const [portfolioSlideDirection, setPortfolioSlideDirection] = useState('forward');
  const [pendingScrollSection, setPendingScrollSection] = useState('');
  const [isPortfolioSelectorOpen, setIsPortfolioSelectorOpen] = useState(false);
  const [portfolioStageHeight, setPortfolioStageHeight] = useState(0);
  const [highlightedSection, setHighlightedSection] = useState('');
  const [siteOwner, setSiteOwner] = useState({ name: '', email: '', resumePath: '' });
  const [hasPortfolioError, setHasPortfolioError] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [revealedSections, setRevealedSections] = useState(() => ({ about: true }));
  const [isSmartSearchOpen, setIsSmartSearchOpen] = useState(false);
  const [tabIndicator, setTabIndicator] = useState({ width: 0, left: 0, top: 0, height: 0 });
  const [isTabsDocked, setIsTabsDocked] = useState(false);

  const headerRef = useRef(null);
  const portfolioPanelRef = useRef(null);
  const portfolioEntryRef = useRef(null);
  const portfolioTabsRef = useRef(null);
  const portfolioTabButtonRefs = useRef({});
  const portfolioPaneRefs = useRef({});
  const transitionTimeoutRef = useRef(null);

  const activePortfolioPanel =
    PORTFOLIO_TABS.find((tab) => tab.id === activePortfolioTab) ?? PORTFOLIO_TABS[0];
  const outgoingPortfolioPanel = outgoingPortfolioTab
    ? PORTFOLIO_TABS.find((tab) => tab.id === outgoingPortfolioTab) ?? null
    : null;

  // 1. Fetch site owner profile for top-level brand lockup
  useEffect(() => {
    let isMounted = true;

    const loadSiteOwner = async () => {
      try {
        const profile = await getProfile();
        if (isMounted) {
          setSiteOwner({
            name: profile.fullName ?? '',
            email: profile.email ?? '',
            resumePath: profile.resumePath ?? ''
          });
          setHasPortfolioError(false);
        }
      } catch (error) {
        console.error('Failed to load site owner from Supabase.', error);
        if (isMounted) {
          setHasPortfolioError(true);
        }
      }
    };

    loadSiteOwner();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Track smart search keyboard escape & attribute
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

  // 3. Active section observer
  useEffect(() => {
    const sectionIds = navigationSections.map((section) => section.id);
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

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
      { rootMargin: '-22% 0px -58% 0px', threshold: [0.15, 0.32, 0.5] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // 4. Analytics: track section view
  useEffect(() => {
    const sectionLabel = SECTION_MAP[activeSection];
    if (!sectionLabel) return;

    trackPortfolioEvent({
      eventType: 'section_view',
      targetKey: activeSection,
      targetLabel: sectionLabel,
      source: 'section_navigation',
      oncePerSession: true
    });
  }, [activeSection]);

  // 5. Scroll reveal observer
  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!revealItems.length) return undefined;

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
      { rootMargin: '0px 0px -10% 0px', threshold: 0.18 }
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  // 6. Docked tabs tracking
  useEffect(() => {
    const tabsRow = portfolioTabsRef.current;
    if (!tabsRow) return undefined;

    let frameId = null;
    const updateDockedState = () => {
      frameId = null;
      const headerHeight = headerRef.current?.getBoundingClientRect().height ?? 0;
      const topOffset = headerHeight + 12;
      const rowRect = tabsRow.getBoundingClientRect();
      const nextDocked = rowRect.top <= topOffset + 2 && rowRect.bottom > topOffset + 18;
      setIsTabsDocked((current) => (current === nextDocked ? current : nextDocked));
    };

    const onScroll = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(updateDockedState);
    };

    updateDockedState();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

  // 7. Measure site header height for CSS variable
  useLayoutEffect(() => {
    const headerElement = headerRef.current;
    if (!headerElement) return undefined;

    const updateHeaderHeight = () => {
      const headerHeight = Math.ceil(headerElement.getBoundingClientRect().height);
      document.documentElement.style.setProperty('--site-header-height', `${headerHeight}px`);
    };

    updateHeaderHeight();
    let resizeObserver;

    if ('ResizeObserver' in window) {
      resizeObserver = new window.ResizeObserver(updateHeaderHeight);
      resizeObserver.observe(headerElement);
    } else {
      window.addEventListener('resize', updateHeaderHeight);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener('resize', updateHeaderHeight);
      }
      document.documentElement.style.removeProperty('--site-header-height');
    };
  }, []);

  // 8. Measure tab indicator position
  useLayoutEffect(() => {
    const tabRow = portfolioTabsRef.current;
    const activeButton = portfolioTabButtonRefs.current[activePortfolioTab];
    if (!tabRow || !activeButton) return undefined;

    const updateIndicator = () => {
      const rowRect = tabRow.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      setTabIndicator({
        width: buttonRect.width,
        left: buttonRect.left - rowRect.left,
        top: buttonRect.top - rowRect.top,
        height: buttonRect.height
      });
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activePortfolioTab]);

  // 9. Measure tab stage transition height
  useLayoutEffect(() => {
    const activePane = portfolioPaneRefs.current[activePortfolioTab];
    const outgoingPane = outgoingPortfolioTab ? portfolioPaneRefs.current[outgoingPortfolioTab] : null;

    const measurePaneHeight = (pane) => {
      if (!pane) return 0;
      const content = pane.firstElementChild;
      return content instanceof HTMLElement
        ? Math.ceil(content.getBoundingClientRect().height)
        : pane.scrollHeight;
    };

    const updateStageHeight = () => {
      const nextHeight = Math.max(measurePaneHeight(activePane), measurePaneHeight(outgoingPane));
      if (nextHeight > 0) {
        setPortfolioStageHeight(nextHeight);
      }
    };

    updateStageHeight();
    window.addEventListener('resize', updateStageHeight);
    return () => window.removeEventListener('resize', updateStageHeight);
  }, [activePortfolioTab, outgoingPortfolioTab, mountedPortfolioTabs]);

  // Cleanup tab transition timer on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const startPortfolioTabTransition = (nextTabId) => {
    if (nextTabId === activePortfolioTab) return;

    const currentIndex = PORTFOLIO_TABS.findIndex((tab) => tab.id === activePortfolioTab);
    const nextIndex = PORTFOLIO_TABS.findIndex((tab) => tab.id === nextTabId);

    setPortfolioSlideDirection(nextIndex > currentIndex ? 'forward' : 'backward');
    setOutgoingPortfolioTab(activePortfolioTab);
    setMountedPortfolioTabs((current) =>
      current[nextTabId] ? current : { ...current, [nextTabId]: true }
    );
    setActivePortfolioTab(nextTabId);

    if (transitionTimeoutRef.current) {
      window.clearTimeout(transitionTimeoutRef.current);
    }

    transitionTimeoutRef.current = window.setTimeout(() => {
      setOutgoingPortfolioTab(null);
    }, 420);
    setIsPortfolioSelectorOpen(false);
  };

  const scrollElementIntoView = useCallback((element, sectionId) => {
    setRevealedSections((current) => ({ ...current, [sectionId]: true }));
    element.classList.add('is-visible');
    setActiveSection(sectionId);

    const header = document.querySelector('.site-header');
    const headerStyles = header ? window.getComputedStyle(header) : null;
    const isPinnedHeader = headerStyles
      ? headerStyles.position === 'sticky' || headerStyles.position === 'fixed'
      : false;
    const headerHeight = header && isPinnedHeader ? header.getBoundingClientRect().height : 0;
    const targetPosition =
      element.getBoundingClientRect().top + window.scrollY - headerHeight - 24;
    const finalTop = Math.max(targetPosition, 0);

    setHighlightedSection('');
    window.scrollTo({ top: finalTop, behavior: 'smooth' });

    let attempts = 0;
    const triggerHighlight = () => {
      setHighlightedSection(sectionId);
      window.setTimeout(() => {
        setHighlightedSection((current) => (current === sectionId ? '' : current));
      }, 850);
    };

    const waitForArrival = () => {
      const distance = Math.abs(window.scrollY - finalTop);
      attempts += 1;
      if (distance <= 8 || attempts >= 40) {
        triggerHighlight();
        return;
      }
      window.setTimeout(waitForArrival, 40);
    };

    window.setTimeout(waitForArrival, 120);
  }, []);

  const scrollPortfolioTabsIntoView = useCallback((sectionId) => {
    const tabsRow = portfolioTabsRef.current;
    if (!tabsRow) {
      if (portfolioEntryRef.current) {
        scrollElementIntoView(portfolioEntryRef.current, sectionId);
      }
      return;
    }

    setRevealedSections((current) => ({ ...current, [sectionId]: true }));
    tabsRow.classList.add('is-visible');
    setActiveSection(sectionId);

    const header = document.querySelector('.site-header');
    const headerStyles = header ? window.getComputedStyle(header) : null;
    const isPinnedHeader = headerStyles
      ? headerStyles.position === 'sticky' || headerStyles.position === 'fixed'
      : false;
    const headerHeight = header && isPinnedHeader ? header.getBoundingClientRect().height : 0;
    const targetPosition =
      tabsRow.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
    const finalTop = Math.max(targetPosition, 0);

    setHighlightedSection('');
    window.scrollTo({ top: finalTop, behavior: 'smooth' });

    let attempts = 0;
    const finalizeArrival = () => {
      setHighlightedSection(sectionId);
      window.setTimeout(() => {
        setHighlightedSection((current) => (current === sectionId ? '' : current));
      }, 850);
    };

    const waitForArrival = () => {
      const distance = Math.abs(window.scrollY - finalTop);
      attempts += 1;
      if (distance <= 8 || attempts >= 40) {
        finalizeArrival();
        return;
      }
      window.setTimeout(waitForArrival, 40);
    };

    window.setTimeout(waitForArrival, 120);
  }, [scrollElementIntoView]);

  const scrollToSection = (sectionId) => {
    if (TAB_IDS.has(sectionId)) {
      if (activePortfolioTab !== sectionId) {
        setPendingScrollSection(sectionId);
        startPortfolioTabTransition(sectionId);
        return;
      }
      scrollPortfolioTabsIntoView(sectionId);
      return;
    }

    const section = document.getElementById(sectionId);
    if (section) {
      scrollElementIntoView(section, sectionId);
    }
  };

  useEffect(() => {
    if (!pendingScrollSection || activePortfolioTab !== pendingScrollSection) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      if (portfolioTabsRef.current || portfolioEntryRef.current || portfolioPanelRef.current) {
        setOutgoingPortfolioTab(null);
        scrollPortfolioTabsIntoView(pendingScrollSection);
      }
      setPendingScrollSection('');
    }, 80);

    return () => window.clearTimeout(timeoutId);
  }, [activePortfolioTab, pendingScrollSection, scrollPortfolioTabsIntoView]);

  const smartSearchContext = useMemo(() => {
    if (activeSection === 'about') {
      return { label: 'Ask about the portfolio', context: 'Profile' };
    }
    const sectionLabel = SECTION_MAP[activeSection] || 'Portfolio';
    return { label: `Ask about ${sectionLabel}`, context: sectionLabel };
  }, [activeSection]);

  if (hasPortfolioError) {
    return (
      <React.Suspense fallback={null}>
        <PortfolioError />
      </React.Suspense>
    );
  }

  return (
    <div className="site-shell">
      <div className="scroll-progress" aria-hidden="true">
        <span className="scroll-progress-bar" style={{ transform: `scaleX(${scrollProgress / 100})` }} />
      </div>

      <Header
        headerRef={headerRef}
        siteOwnerName={siteOwner.name}
        theme={theme}
        onToggleTheme={toggleTheme}
        activeSection={activeSection}
        onSelectSection={scrollToSection}
        sectionMap={SECTION_MAP}
        profileSection={PROFILE_SECTION}
        workSections={WORK_SECTIONS}
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

        <div ref={portfolioEntryRef} className="portfolio-entry-shell" data-reveal>
          <div className="portfolio-entry-bridge" aria-hidden="true">
            <span className="portfolio-entry-bridge-stem" />
            <span className="portfolio-entry-bridge-glow" />
          </div>

          <TechStrip />

          <section className="portfolio-tabs-shell">
            <PortfolioTabsNav
              tabs={PORTFOLIO_TABS}
              activeTabId={activePortfolioTab}
              onTabChange={startPortfolioTabTransition}
              tabContextMap={TAB_CONTEXT_DESCRIPTIONS}
              tabsRowRef={portfolioTabsRef}
              tabButtonRefs={portfolioTabButtonRefs}
              tabIndicator={tabIndicator}
              isDocked={isTabsDocked}
              isSelectorOpen={isPortfolioSelectorOpen}
              onToggleSelector={() => setIsPortfolioSelectorOpen((prev) => !prev)}
              onCloseSelector={() => setIsPortfolioSelectorOpen(false)}
            />

            <section
              ref={portfolioPanelRef}
              id={activePortfolioPanel.id}
              className={`module-card portfolio-tab-panel portfolio-tab-panel-${activePortfolioPanel.layout} ${
                highlightedSection === activePortfolioPanel.id ? 'section-flash' : ''
              } ${revealedSections[activePortfolioPanel.id] ? 'is-visible' : ''}`}
              data-reveal
            >
              <div
                className={`portfolio-tab-stage portfolio-tab-stage-${activePortfolioPanel.layout}`}
                style={portfolioStageHeight ? { minHeight: `${portfolioStageHeight}px` } : undefined}
              >
                {PORTFOLIO_TABS.map((tab) => {
                  if (!mountedPortfolioTabs[tab.id]) return null;

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
                        if (node) portfolioPaneRefs.current[tab.id] = node;
                      }}
                      className={paneClassName}
                      aria-hidden={!isActive}
                    >
                      <React.Suspense
                        fallback={
                          <div
                            className="skeleton-tab-loader shimmer-block"
                            style={{ minHeight: '280px', borderRadius: '12px' }}
                            aria-busy="true"
                          />
                        }
                      >
                        <tab.component />
                      </React.Suspense>
                    </div>
                  );
                })}
              </div>
            </section>
          </section>
        </div>

        <div className="portfolio-proof-transition" aria-hidden="true" data-reveal>
          <span className="portfolio-proof-transition-line" />
        </div>

        <section className="portfolio-proof-shell module-card" data-reveal>
          <React.Suspense fallback={<div className="shimmer-block" style={{ minHeight: '120px', borderRadius: '12px' }} />}>
            <AnalyticsDashboard compact />
          </React.Suspense>
        </section>

        <PortfolioClosing
          resumePath={siteOwner.resumePath}
          email={siteOwner.email}
        />
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

      {isSmartSearchOpen && (
        <React.Suspense fallback={null}>
          <SmartSearch
            isOpen={isSmartSearchOpen}
            onClose={() => setIsSmartSearchOpen(false)}
            onNavigate={scrollToSection}
            activeContext={smartSearchContext.context}
          />
        </React.Suspense>
      )}

      <Analytics />
      <SpeedInsights />
    </div>
  );
}

export default App;
