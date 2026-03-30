import { getSmartSearchResults } from '../lib/smartSearch';

const providerLabel = 'Gemini AI search';

export const getAISearchProviderLabel = () => providerLabel;

export const getAISearchResults = async ({ query, projects, skillCategories, experiences }) => {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return {
      mode: 'fallback',
      results: []
    };
  }

  try {
    const response = await fetch('/api/ai-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: trimmedQuery })
    });

    if (!response.ok) {
      throw new Error(`AI search request failed with status ${response.status}`);
    }

    const data = await response.json();

    return {
      mode: data.mode ?? 'gemini',
      results: Array.isArray(data.results) ? data.results : []
    };
  } catch (error) {
    console.error('Falling back to local smart search.', error);

    return {
      mode: 'fallback',
      results: getSmartSearchResults({
        query: trimmedQuery,
        projects,
        skillCategories,
        experiences
      })
    };
  }
};
