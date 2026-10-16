import React, { useEffect, useRef } from 'react';

const PortfolioTabsNav = ({
  tabs,
  activeTabId,
  onTabChange,
  tabContextMap,
  tabsRowRef,
  tabButtonRefs,
  tabIndicator,
  isDocked,
  isSelectorOpen,
  onToggleSelector,
  onCloseSelector
}) => {
  const selectorRef = useRef(null);
  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];

  useEffect(() => {
    if (!isSelectorOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!selectorRef.current?.contains(event.target)) {
        onCloseSelector();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onCloseSelector();
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isSelectorOpen, onCloseSelector]);

  return (
    <div className="portfolio-tabs-header">
      <div>
        <span className="eyebrow">Core Portfolio</span>
      </div>

      <div
        ref={tabsRowRef}
        className={`portfolio-tabs-row ${isDocked ? 'is-docked' : ''}`.trim()}
        role="tablist"
        aria-label="Portfolio sections"
      >
        <span
          className="portfolio-tabs-indicator"
          aria-hidden="true"
          style={{
            width: `${tabIndicator.width}px`,
            height: `${tabIndicator.height}px`,
            transform: `translate(${tabIndicator.left}px, ${tabIndicator.top}px)`
          }}
        />
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            ref={(node) => {
              if (node) {
                tabButtonRefs.current[tab.id] = node;
              }
            }}
            aria-selected={activeTab.id === tab.id}
            className={activeTab.id === tab.id ? 'active' : ''}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <p className="portfolio-tabs-context" aria-live="polite">
        {tabContextMap[activeTab.id]}
      </p>

      <div ref={selectorRef} className="portfolio-selector">
        <div className="portfolio-selector-meta">
          <p>Choose a section to view.</p>
        </div>

        <button
          type="button"
          className={`portfolio-selector-trigger ${isSelectorOpen ? 'open' : ''}`}
          aria-expanded={isSelectorOpen}
          aria-haspopup="listbox"
          onClick={onToggleSelector}
        >
          <span className="portfolio-selector-kicker">Viewing</span>
          <strong>{activeTab.label}</strong>
          <span className="portfolio-selector-icon" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>

        <div className={`portfolio-selector-sheet ${isSelectorOpen ? 'open' : ''}`}>
          <div className="portfolio-selector-list" role="listbox" aria-label="Portfolio sections">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="option"
                aria-selected={activeTab.id === tab.id}
                className={activeTab.id === tab.id ? 'active' : ''}
                onClick={() => onTabChange(tab.id)}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioTabsNav;
