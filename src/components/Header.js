import React, { useState, useEffect } from 'react';

const Header = ({
  headerRef,
  siteOwnerName,
  theme,
  onToggleTheme,
  activeSection,
  onSelectSection,
  sectionMap,
  profileSection,
  workSections
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
  }, [isMobileMenuOpen, headerRef]);

  const handleSectionClick = (sectionId) => {
    setIsMobileMenuOpen(false);
    onSelectSection(sectionId);
  };

  return (
    <>
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
            onClick={onToggleTheme}
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
            <div className="site-nav-mobile-header">
              <span className="site-nav-mobile-label">Navigation</span>
              <p>Choose where you want to continue exploring.</p>
            </div>

            {profileSection ? (
              <div className="site-nav-group site-nav-group-profile">
                <button
                  type="button"
                  className={`${activeSection === profileSection.id ? 'active' : ''} nav-home-link`.trim()}
                  aria-current={activeSection === profileSection.id ? 'location' : undefined}
                  onClick={() => handleSectionClick(profileSection.id)}
                >
                  {profileSection.label}
                </button>
              </div>
            ) : null}

            <div className="site-nav-group site-nav-group-work">
              <div className="site-nav-work-track">
                {workSections.map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    className={`site-nav-work-button ${activeSection === id ? 'active' : ''}`.trim()}
                    aria-current={activeSection === id ? 'location' : undefined}
                    onClick={() => handleSectionClick(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
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
    </>
  );
};

export default Header;
