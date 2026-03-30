const providerLabel = 'Gemini AI search';

export const getAISearchProviderLabel = () => providerLabel;

export const getAISearchResults = async ({ query }) => {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return {
      mode: 'gemini',
      answer: ''
    };
  }

  const response = await fetch('/api/ai-search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: trimmedQuery })
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => null);
    const isLikelyLocalCraDev =
      typeof window !== 'undefined' &&
      (window.location.port === '3000' || window.location.port === '3001') &&
      response.status === 404;

    if (isLikelyLocalCraDev) {
      throw new Error('Local API route not running. Start this project with `vercel dev` instead of `npm start`.');
    }

    throw new Error(errorPayload?.error || `AI search request failed with status ${response.status}`);
  }

  const data = await response.json();

  return {
    mode: data.mode ?? 'gemini',
    answer: typeof data.answer === 'string' ? data.answer : ''
  };
};
