import { synthesizeLocalSmartAnswer } from '../lib/smartSearch.js';

const providerLabel = 'AI Search Copilot';

export const getAISearchProviderLabel = () => providerLabel;

export const getAISearchResults = async ({ query, context = {} }) => {
  const trimmedQuery = `${query ?? ''}`.trim();

  if (!trimmedQuery) {
    return {
      mode: 'empty',
      answer: ''
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

    if (response.ok) {
      const data = await response.json();
      if (typeof data?.answer === 'string' && data.answer.trim()) {
        return {
          mode: data.mode ?? 'gemini',
          answer: data.answer.trim()
        };
      }
    }
  } catch (error) {
    // API route unavailable (CRA dev server on localhost:3000, GitHub Pages static hosting, or offline)
  }

  // Zero-failure fallback to intelligent client-side smart synthesis copilot
  const synthesized = synthesizeLocalSmartAnswer({
    query: trimmedQuery,
    context
  });

  return {
    mode: 'copilot-local',
    answer: synthesized
  };
};
