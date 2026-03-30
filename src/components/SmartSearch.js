import React, { useEffect, useRef, useState } from 'react';
import { getExperiences, getProjects, getSkillCategories } from '../services/portfolio';
import { smartSearchPrompts } from '../lib/smartSearch';
import { getAISearchResults } from '../services/aiSearch';
import '../styles/SmartSearch.css';

const SmartSearch = ({ isOpen, onClose, onNavigate }) => {
  const [projects, setProjects] = useState(null);
  const [skillCategories, setSkillCategories] = useState(null);
  const [experiences, setExperiences] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [query, setQuery] = useState('');
  const [isTraceActive, setIsTraceActive] = useState(false);
  const [activeResponse, setActiveResponse] = useState(null);
  const promptRowRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const loadSearchSources = async () => {
      try {
        const [nextProjects, nextSkillCategories, nextExperiences] = await Promise.all([
          getProjects(),
          getSkillCategories(),
          getExperiences()
        ]);

        if (isMounted) {
          setProjects(nextProjects);
          setSkillCategories(nextSkillCategories);
          setExperiences(nextExperiences);
          setHasError(false);
        }
      } catch (error) {
        console.error('Failed to load smart search sources.', error);
        if (isMounted) {
          setHasError(true);
        }
      }
    };

    loadSearchSources();

    return () => {
      isMounted = false;
    };
  }, []);

  const isLoading = !projects || !skillCategories || !experiences;
  const handleOpenSection = (sectionId) => {
    onNavigate(sectionId);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setIsTraceActive(false);
      return undefined;
    }

    setIsTraceActive(true);
    const timeoutId = window.setTimeout(() => {
      setIsTraceActive(false);
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [isOpen]);

  useEffect(() => {
    const promptRow = promptRowRef.current;

    if (!promptRow) {
      return undefined;
    }

    const handleWheel = (event) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
        return;
      }

      event.preventDefault();
      promptRow.scrollLeft += event.deltaY;
    };

    promptRow.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      promptRow.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const runSearch = async (nextQuery) => {
    const trimmedQuery = nextQuery.trim();

    if (!trimmedQuery || isLoading) {
      return;
    }

    setActiveResponse({
      query: trimmedQuery,
      results: [],
      isPending: true
    });
    setQuery('');

    const nextSearch = await getAISearchResults({
      query: trimmedQuery,
      projects: projects ?? [],
      skillCategories: skillCategories ?? [],
      experiences: experiences ?? []
    });

    setActiveResponse({
      query: trimmedQuery,
      results: nextSearch.results,
      isPending: false
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    runSearch(query);
  };

  return (
    <>
      <button
        type="button"
        className={`smart-search-backdrop ${isOpen ? 'open' : ''}`}
        aria-label="Close AI search"
        aria-hidden={!isOpen}
        tabIndex={isOpen ? 0 : -1}
        onClick={onClose}
      />

      <div className={`smart-search-shell ${isOpen ? 'open' : ''}`}>
        <section className="smart-search" aria-label="AI portfolio search">
          <div className="smart-search-header">
            <div>
              <h2>AI Search</h2>
            </div>
          </div>

        <div className="smart-search-body">
          <div className="smart-search-messages">
            {hasError ? (
              <div className="search-empty-state">
                <h3>Search is unavailable</h3>
                <p>The search data could not be loaded from Supabase right now.</p>
              </div>
            ) : isLoading ? (
              <div className="smart-chat-thread" aria-hidden="true">
                {[0, 1].map((item) => (
                  <article key={item} className="smart-chat-message assistant">
                    <div className="smart-chat-bubble smart-result-skeleton">
                      <div className="shimmer-line short" />
                      <div className="shimmer-line title" />
                      <div className="shimmer-line" />
                    </div>
                  </article>
                ))}
              </div>
            ) : activeResponse ? (
              <div className="smart-response-card">
                <p className="smart-response-query">{activeResponse.query}</p>
                {activeResponse.isPending ? (
                  <div className="smart-response-loading" aria-hidden="true">
                    <div className="smart-chat-loading">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="smart-response-summary">
                      {activeResponse.results.length
                        ? `I found ${activeResponse.results.length} relevant matches.`
                        : `I could not find a strong match for this query.`}
                    </p>
                    {activeResponse.results.length ? (
                      <div className="smart-response-results">
                        {activeResponse.results.map((result) => (
                          <button
                            key={result.id}
                            type="button"
                            className="smart-chat-result"
                            onClick={() => handleOpenSection(result.targetSection)}
                          >
                            <span className="smart-chat-result-type">{result.type}</span>
                            <strong>{result.title}</strong>
                            <span>{result.body}</span>
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            ) : (
              <div className="smart-search-empty">
                <h3>Try queries like</h3>
                <p>
                  Fintech backend work, Java with PostgreSQL, production support, or platform engineering.
                </p>
              </div>
            )}
          </div>

          <form className="smart-search-panel" onSubmit={handleSubmit}>
            <div className={`smart-search-input-shell ${isTraceActive ? 'trace-active' : ''}`}>
              <span className="smart-search-input-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="presentation" focusable="false">
                  <path d="M10.5 4.75a5.75 5.75 0 1 0 0 11.5a5.75 5.75 0 0 0 0-11.5Zm0-1.5a7.25 7.25 0 1 1 0 14.5a7.25 7.25 0 0 1 0-14.5Zm6.31 12.5l4 4a.75.75 0 1 1-1.06 1.06l-4-4a.75.75 0 0 1 1.06-1.06Z" />
                </svg>
              </span>
              <input
                id="smart-search-input"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ask me something"
              />
              <button type="submit" className="smart-search-send" aria-label="Send AI search">
                Go
              </button>
            </div>

            <div ref={promptRowRef} className="smart-search-prompt-row">
              {smartSearchPrompts.slice(0, 3).map((prompt) => (
                <button key={prompt} type="button" onClick={() => runSearch(prompt)}>
                  {prompt}
                </button>
              ))}
            </div>
          </form>
        </div>
        </section>
      </div>
    </>
  );
};

export default SmartSearch;
