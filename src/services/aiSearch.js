const provider = process.env.REACT_APP_AI_SEARCH_PROVIDER?.toLowerCase() ?? '';
const ollamaUrl = process.env.REACT_APP_OLLAMA_URL ?? 'http://127.0.0.1:11434';
const ollamaModel = process.env.REACT_APP_OLLAMA_MODEL ?? 'llama3.2:3b';

export const hasConfiguredAISearch = provider === 'ollama';

const cleanText = (value) => `${value ?? ''}`.replace(/\s+/g, ' ').trim();

const buildSearchContext = ({ projects, skillCategories, experiences }) => ({
  projects: (projects ?? []).map((project) => ({
    id: project.slug ?? project.title,
    title: cleanText(project.title),
    description: cleanText(project.description),
    impact: cleanText(project.impact),
    category: cleanText(project.category),
    status: cleanText(project.status),
    stack: project.stack ?? [],
    targetSection: 'projects'
  })),
  skills: (skillCategories ?? []).flatMap((category) =>
    category.skills.map((skill) => ({
      id: `${category.category}-${skill}`,
      title: cleanText(skill),
      description: `Found in ${cleanText(category.category)}`,
      category: cleanText(category.category),
      targetSection: 'skills'
    }))
  ),
  experience: (experiences ?? []).map((experience) => ({
    id: cleanText(experience.company),
    title: `${cleanText(experience.company)} · ${cleanText(experience.designation)}`,
    description: cleanText(experience.summary),
    details: (experience.description ?? []).map(cleanText),
    location: cleanText(experience.location),
    duration: cleanText(experience.duration),
    targetSection: 'experience'
  }))
});

const buildPrompt = ({ query, context }) => `
You are ranking portfolio search results for a backend engineer's website.

User query:
${query}

Available portfolio data as JSON:
${JSON.stringify(context)}

Return only valid JSON with this shape:
{
  "results": [
    {
      "id": "string",
      "type": "Project|Skill|Experience",
      "title": "string",
      "body": "string",
      "targetSection": "projects|skills|experience",
      "tags": ["string", "string"]
    }
  ]
}

Rules:
- Return at most 8 results.
- Prefer the most relevant matches for the query intent.
- Use only items from the provided data.
- Keep body concise.
- tags should be short labels like Java, Fintech, Backend, PostgreSQL, Reliability.
- If nothing is relevant, return {"results":[]}.
`.trim();

const safeParseResults = (responseText) => {
  const firstBrace = responseText.indexOf('{');
  const lastBrace = responseText.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1) {
    return [];
  }

  const jsonSlice = responseText.slice(firstBrace, lastBrace + 1);
  const parsed = JSON.parse(jsonSlice);

  if (!Array.isArray(parsed.results)) {
    return [];
  }

  return parsed.results
    .filter(
      (item) =>
        item &&
        item.id &&
        item.type &&
        item.title &&
        item.body &&
        item.targetSection
    )
    .slice(0, 8)
    .map((item) => ({
      ...item,
      tags: Array.isArray(item.tags) ? item.tags.slice(0, 3) : []
    }));
};

export const getOllamaSearchResults = async ({ query, projects, skillCategories, experiences }) => {
  if (!hasConfiguredAISearch) {
    return [];
  }

  const context = buildSearchContext({ projects, skillCategories, experiences });
  const prompt = buildPrompt({ query, context });

  const response = await fetch(`${ollamaUrl.replace(/\/$/, '')}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: ollamaModel,
      prompt,
      stream: false,
      format: 'json'
    })
  });

  if (!response.ok) {
    throw new Error(`Ollama search failed with status ${response.status}`);
  }

  const data = await response.json();
  return safeParseResults(data.response ?? '');
};

export const getAISearchProviderLabel = () =>
  hasConfiguredAISearch ? `Ollama · ${ollamaModel}` : 'Smart Search fallback';
