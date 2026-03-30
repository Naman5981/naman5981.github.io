import React, { useEffect, useMemo, useState } from 'react';
import { getExperiences, getProjects, getSkillCategories } from '../services/portfolio';
import { getSmartSearchResults, smartSearchPrompts } from '../lib/smartSearch';
import {
  getAISearchProviderLabel,
  getOllamaSearchResults,
  hasConfiguredAISearch
} from '../services/aiSearch';
import '../styles/SmartSearch.css';

const SmartSearch = ({ isOpen, onClose, onNavigate }) => {
  const [projects, setProjects] = useState(null);
  const [skillCategories, setSkillCategories] = useState(null);
  const [experiences, setExperiences] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [query, setQuery] = useState('');
  const [aiResults, setAiResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMode, setSearchMode] = useState(hasConfiguredAISearch ? 'ollama' : 'fallback');

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

  const results = useMemo(
    () =>
      getSmartSearchResults({
        query,
        projects: projects ?? [],
        skillCategories: skillCategories ?? [],
        experiences: experiences ?? []
      }),
    [experiences, projects, query, skillCategories]
  );
  const displayedResults = searchMode === 'ollama' ? aiResults : results;

  const isLoading = !projects || !skillCategories || !experiences;
  const handleOpenSection = (sectionId) => {
    onNavigate(sectionId);
    onClose();
  };

  useEffect(() => {
    if (!hasConfiguredAISearch || !query.trim() || isLoading) {
      setAiResults([]);
      setIsSearching(false);
      setSearchMode(hasConfiguredAISearch ? 'ollama' : 'fallback');
      return undefined;
    }

    let isCancelled = false;
    setIsSearching(true);

    const timeoutId = window.setTimeout(async () => {
      try {
        const nextResults = await getOllamaSearchResults({
          query,
          projects: projects ?? [],
          skillCategories: skillCategories ?? [],
          experiences: experiences ?? []
        });

        if (!isCancelled) {
          setAiResults(nextResults);
          setSearchMode('ollama');
        }
      } catch (error) {
        console.error('Ollama search failed, falling back to smart search.', error);
        if (!isCancelled) {
          setAiResults([]);
          setSearchMode('fallback');
        }
      } finally {
        if (!isCancelled) {
          setIsSearching(false);
        }
      }
    }, 350);

    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [experiences, isLoading, projects, query, skillCategories]);

  return (
    <>
      {isOpen ? <button type="button" className="smart-search-backdrop" aria-label="Close AI search" onClick={onClose} /> : null}

      <div className={`smart-search-shell ${isOpen ? 'open' : ''}`}>
        <section className="smart-search" aria-label="AI Search Assistant">
          <div className="smart-search-header">
            <div>
              <span className="eyebrow">AI Search</span>
              <h2>Ask the portfolio in natural language.</h2>
            </div>
            <button type="button" className="smart-search-close" aria-label="Close AI search" onClick={onClose}>
              Close
            </button>
          </div>

          <p className="smart-search-copy">
            Search projects, backend experience, and skills with intent-aware matching across the
            whole site.
          </p>

          <div className="smart-search-panel">
            <label className="search-label" htmlFor="smart-search-input">
              Try natural language
            </label>
            <span className="smart-search-provider">{getAISearchProviderLabel()}</span>
            <input
              id="smart-search-input"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Example: show me fintech backend work with Java and databases"
            />

            <div className="smart-search-prompt-row">
              {smartSearchPrompts.map((prompt) => (
                <button key={prompt} type="button" onClick={() => setQuery(prompt)}>
                  {prompt}
                </button>
              ))}
            </div>
          </div>
          {hasError ? (
            <div className="search-empty-state">
              <h3>Smart search is unavailable</h3>
              <p>The search data could not be loaded from Supabase right now.</p>
            </div>
          ) : isSearching ? (
            <div className="smart-search-grid" aria-hidden="true">
              {[0, 1, 2].map((item) => (
                <article className="smart-result-card smart-result-skeleton" key={item}>
                  <div className="shimmer-line short" />
                  <div className="shimmer-line title" />
                  <div className="shimmer-line" />
                  <div className="skeleton-chip-row">
                    <span className="shimmer-chip short" />
                    <span className="shimmer-chip short" />
                  </div>
                </article>
              ))}
            </div>
          ) : isLoading ? (
            <div className="smart-search-grid" aria-hidden="true">
              {[0, 1, 2].map((item) => (
                <article className="smart-result-card smart-result-skeleton" key={item}>
                  <div className="shimmer-line short" />
                  <div className="shimmer-line title" />
                  <div className="shimmer-line" />
                  <div className="skeleton-chip-row">
                    <span className="shimmer-chip short" />
                    <span className="shimmer-chip short" />
                  </div>
                </article>
              ))}
            </div>
          ) : query.trim() ? (
            displayedResults.length ? (
              <div className="smart-search-grid">
                {displayedResults.map((result) => (
                  <article key={result.id} className="smart-result-card">
                    <div className="smart-result-topline">
                      <span className="smart-result-type">{result.type}</span>
                      <button type="button" onClick={() => handleOpenSection(result.targetSection)}>
                        Open {result.targetSection}
                      </button>
                    </div>

                    <h3>{result.title}</h3>
                    <p>{result.body}</p>

                    {result.tags.length ? (
                      <div className="smart-result-tags">
                        {result.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            ) : (
              <div className="search-empty-state">
                <h3>No smart matches yet</h3>
                <p>Try asking about fintech, backend, Java, databases, production support, or mobile.</p>
              </div>
            )
          ) : (
            <div className="smart-search-empty">
              <h3>What this search understands</h3>
              <p>
                It can connect intent to projects and experience, even when you search by themes like
                fintech, APIs, reliability, architecture, or platform work.
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default SmartSearch;
