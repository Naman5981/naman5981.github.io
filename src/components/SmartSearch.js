import React, { useEffect, useRef, useState } from 'react';
import { getProfile, getProjects, getSkillCategories, getExperiences } from '../services/portfolio';
import { defaultSmartSearchPrompts, getDynamicSmartSearchPrompts } from '../lib/smartSearch';
import { getAISearchResults } from '../services/aiSearch';
import '../styles/SmartSearch.css';

const SmartSearch = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [isTraceActive, setIsTraceActive] = useState(false);
  const [activeResponse, setActiveResponse] = useState(null);
  const [promptSuggestions, setPromptSuggestions] = useState(defaultSmartSearchPrompts.slice(0, 3));
  const promptRowRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const loadPromptSuggestions = async () => {
      try {
        const [profile, projects, skillCategories, experiences] = await Promise.all([
          getProfile(),
          getProjects(),
          getSkillCategories(),
          getExperiences()
        ]);

        if (!isMounted) {
          return;
        }

        const nextPrompts = getDynamicSmartSearchPrompts({
          profile,
          projects,
          skillCategories,
          experiences
        });

        setPromptSuggestions(nextPrompts.slice(0, 3));
      } catch (error) {
        console.error('Failed to load dynamic AI search prompts.', error);

        if (isMounted) {
          setPromptSuggestions(defaultSmartSearchPrompts.slice(0, 3));
        }
      }
    };

    loadPromptSuggestions();

    return () => {
      isMounted = false;
    };
  }, []);

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

    if (!trimmedQuery) {
      return;
    }

    setActiveResponse({
      query: trimmedQuery,
      answer: '',
      isPending: true
    });
    setQuery('');

    try {
      const nextSearch = await getAISearchResults({
        query: trimmedQuery
      });

      setActiveResponse({
        query: trimmedQuery,
        answer: nextSearch.answer,
        isPending: false,
        hasError: false,
        errorMessage: ''
      });
    } catch (error) {
      console.error('Gemini AI search failed.', error);
      setActiveResponse({
        query: trimmedQuery,
        answer: '',
        isPending: false,
        hasError: true,
        errorMessage: error instanceof Error ? error.message : 'Gemini AI search is unavailable right now.'
      });
    }
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
              <h2>AI Search (Beta)</h2>
            </div>
          </div>

        <div className="smart-search-body">
          <div className="smart-search-messages">
            {activeResponse ? (
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
                      {activeResponse.hasError
                        ? activeResponse.errorMessage || 'Gemini AI search is unavailable right now.'
                        : activeResponse.answer || 'I could not find a strong answer for this query.'}
                    </p>
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
              {promptSuggestions.map((prompt) => (
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
