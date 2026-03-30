const { createClient } = require('@supabase/supabase-js');

const profileSlug = process.env.PROFILE_SLUG || process.env.REACT_APP_PROFILE_SLUG || 'naman-sanadhya';
const supabaseUrl = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;
const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const normalize = (value) =>
  `${value || ''}`
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const intentDictionary = {
  backend: ['backend', 'java', 'spring', 'spring boot', 'api', 'microservice', 'microservices'],
  fintech: ['fintech', 'banking', 'payments', 'merchant', 'transaction', 'virtual account'],
  database: ['database', 'postgres', 'postgresql', 'sql', 'mysql', 'data'],
  cloud: ['cloud', 'ci/cd', 'deployment', 'platform', 'automation'],
  mobile: ['android', 'mobile', 'assistant', 'voice', 'dialogflow'],
  healthcare: ['healthcare', 'health', 'nutrition', 'medical'],
  reliability: ['production', 'support', 'incident', 'debugging', 'reliability', 'stability'],
  leadership: ['ownership', 'delivery', 'scalable', 'architecture', 'design']
};

const labelMap = {
  backend: 'Backend',
  fintech: 'Fintech',
  database: 'Databases',
  cloud: 'Platform',
  mobile: 'Mobile',
  healthcare: 'Healthcare',
  reliability: 'Reliability',
  leadership: 'Architecture'
};

const extractConcepts = (query) => {
  const normalizedQuery = normalize(query);
  const concepts = new Set();

  Object.entries(intentDictionary).forEach(([concept, keywords]) => {
    if (keywords.some((keyword) => normalizedQuery.includes(normalize(keyword)))) {
      concepts.add(concept);
    }
  });

  return Array.from(concepts);
};

const buildSearchTokens = (query) =>
  normalize(query)
    .split(' ')
    .filter((token) => token.length > 1);

const scoreTextMatch = (text, queryTokens) =>
  queryTokens.reduce((score, token) => {
    if (!text.includes(token)) {
      return score;
    }

    return score + (token.length > 4 ? 2 : 1);
  }, 0);

const scoreConceptMatch = (candidateConcepts, queryConcepts) =>
  queryConcepts.reduce(
    (score, concept) => (candidateConcepts.includes(concept) ? score + 6 : score),
    0
  );

const describeMatches = (candidateConcepts, queryConcepts, fallbackTags) => {
  const matchedConcepts = queryConcepts
    .filter((concept) => candidateConcepts.includes(concept))
    .map((concept) => labelMap[concept]);

  return matchedConcepts.length ? matchedConcepts : (fallbackTags || []).slice(0, 3);
};

const buildProjectCandidates = (projects) =>
  projects.map((project) => {
    const concepts = [];
    const searchText = normalize(
      [
        project.title,
        project.description,
        project.category,
        project.status,
        project.impact,
        ...(project.stack || [])
      ].join(' ')
    );

    if (searchText.includes('spring') || searchText.includes('java')) concepts.push('backend');
    if (searchText.includes('bank') || searchText.includes('payment') || searchText.includes('merchant')) concepts.push('fintech');
    if (searchText.includes('postgres') || searchText.includes('sql')) concepts.push('database');
    if (searchText.includes('android') || searchText.includes('assistant')) concepts.push('mobile');
    if (searchText.includes('health') || searchText.includes('nutrition')) concepts.push('healthcare');
    if (searchText.includes('architecture') || searchText.includes('modular')) concepts.push('leadership');

    return {
      id: `project-${project.slug || project.title}`,
      type: 'Project',
      title: project.title,
      body: project.impact || project.description,
      targetSection: 'projects',
      concepts,
      searchText,
      fallbackTags: (project.stack || []).slice(0, 3)
    };
  });

const buildSkillCandidates = (categories) =>
  categories.flatMap((category) =>
    category.skills.map((skill) => {
      const searchText = normalize(`${category.category} ${skill}`);
      const concepts = [];

      if (searchText.includes('java') || searchText.includes('spring') || searchText.includes('api')) concepts.push('backend');
      if (searchText.includes('postgres') || searchText.includes('mysql') || searchText.includes('sql')) concepts.push('database');
      if (searchText.includes('cloud') || searchText.includes('ci') || searchText.includes('deployment')) concepts.push('cloud');
      if (searchText.includes('android') || searchText.includes('mobile')) concepts.push('mobile');
      if (searchText.includes('automation') || searchText.includes('architecture')) concepts.push('leadership');

      return {
        id: `skill-${category.category}-${skill}`,
        type: 'Skill',
        title: skill,
        body: `Found in ${category.category}`,
        targetSection: 'skills',
        concepts,
        searchText,
        fallbackTags: [category.category]
      };
    })
  );

const buildExperienceCandidates = (experiences) =>
  experiences.map((experience) => {
    const searchText = normalize(
      [
        experience.company,
        experience.designation,
        experience.summary,
        ...(experience.description || []),
        experience.location
      ].join(' ')
    );
    const concepts = [];

    if (searchText.includes('spring') || searchText.includes('java') || searchText.includes('service')) concepts.push('backend');
    if (searchText.includes('bank') || searchText.includes('financial') || searchText.includes('transaction')) concepts.push('fintech');
    if (searchText.includes('incident') || searchText.includes('production') || searchText.includes('support') || searchText.includes('debug')) concepts.push('reliability');
    if (searchText.includes('architecture') || searchText.includes('ownership') || searchText.includes('scalable')) concepts.push('leadership');

    return {
      id: `experience-${experience.company}`,
      type: 'Experience',
      title: `${experience.company} · ${experience.designation}`,
      body: experience.summary,
      targetSection: 'experience',
      concepts,
      searchText,
      fallbackTags: [experience.duration, experience.location].filter(Boolean)
    };
  });

const getFallbackResults = ({ query, projects, skillCategories, experiences }) => {
  const trimmedQuery = `${query || ''}`.trim();
  if (!trimmedQuery) {
    return [];
  }

  const queryTokens = buildSearchTokens(trimmedQuery);
  const queryConcepts = extractConcepts(trimmedQuery);
  const normalizedQuery = normalize(trimmedQuery);

  const candidates = [
    ...buildProjectCandidates(projects),
    ...buildSkillCandidates(skillCategories),
    ...buildExperienceCandidates(experiences)
  ];

  return candidates
    .map((candidate) => {
      const exactPhraseBonus = candidate.searchText.includes(normalizedQuery) ? 8 : 0;
      const tokenScore = scoreTextMatch(candidate.searchText, queryTokens);
      const conceptScore = scoreConceptMatch(candidate.concepts, queryConcepts);
      const score = exactPhraseBonus + tokenScore + conceptScore;

      return {
        id: candidate.id,
        type: candidate.type,
        title: candidate.title,
        body: candidate.body,
        targetSection: candidate.targetSection,
        tags: describeMatches(candidate.concepts, queryConcepts, candidate.fallbackTags),
        score
      };
    })
    .filter((candidate) => candidate.score > 0)
    .sort((left, right) => right.score - left.score || left.type.localeCompare(right.type))
    .slice(0, 8)
    .map(({ score, ...candidate }) => candidate);
};

const getSupabase = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables are not configured.');
  }

  return createClient(supabaseUrl, supabaseAnonKey);
};

const getPortfolioSearchContext = async () => {
  const supabase = getSupabase();
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('slug', profileSlug)
    .single();

  if (profileError) throw profileError;

  const [{ data: projects, error: projectError }, { data: experiences, error: experienceError }, { data: categories, error: categoriesError }] = await Promise.all([
    supabase
      .from('projects')
      .select('slug, title, description, repo_url, live_url, sort_order')
      .eq('featured', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('experiences')
      .select('id, company, location, duration_label, designation, summary, sort_order')
      .eq('profile_id', profile.id)
      .order('sort_order', { ascending: true }),
    supabase
      .from('skill_categories')
      .select('id, name, sort_order')
      .eq('profile_id', profile.id)
      .order('sort_order', { ascending: true })
  ]);

  if (projectError) throw projectError;
  if (experienceError) throw experienceError;
  if (categoriesError) throw categoriesError;

  const experienceIds = (experiences || []).map((item) => item.id);
  const categoryIds = (categories || []).map((item) => item.id);

  let highlights = [];
  let skills = [];

  if (experienceIds.length) {
    const { data, error } = await supabase
      .from('experience_highlights')
      .select('experience_id, highlight, sort_order')
      .in('experience_id', experienceIds)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    highlights = data || [];
  }

  if (categoryIds.length) {
    const { data, error } = await supabase
      .from('skills')
      .select('category_id, name, sort_order')
      .in('category_id', categoryIds)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    skills = data || [];
  }

  const mappedExperiences = (experiences || []).map((experience) => ({
    company: experience.company,
    location: experience.location,
    duration: experience.duration_label,
    designation: experience.designation,
    summary: experience.summary,
    description: highlights
      .filter((highlight) => highlight.experience_id === experience.id)
      .sort((left, right) => left.sort_order - right.sort_order)
      .map((highlight) => highlight.highlight)
  }));

  const mappedCategories = (categories || []).map((category) => ({
    category: category.name,
    skills: skills
      .filter((skill) => skill.category_id === category.id)
      .sort((left, right) => left.sort_order - right.sort_order)
      .map((skill) => skill.name)
  }));

  const mappedProjects = (projects || []).map((project) => ({
    slug: project.slug,
    title: project.title,
    description: project.description,
    category: 'Project',
    status: 'Featured',
    impact: project.description,
    stack: []
  }));

  return {
    projects: mappedProjects,
    skillCategories: mappedCategories,
    experiences: mappedExperiences
  };
};

const buildGeminiContext = ({ projects, skillCategories, experiences }) => ({
  projects: projects.map((project) => ({
    id: project.slug || project.title,
    title: project.title,
    description: project.description,
    impact: project.impact,
    category: project.category,
    status: project.status,
    stack: project.stack || [],
    targetSection: 'projects'
  })),
  skills: skillCategories.flatMap((category) =>
    category.skills.map((skill) => ({
      id: `${category.category}-${skill}`,
      title: skill,
      description: `Found in ${category.category}`,
      category: category.category,
      targetSection: 'skills'
    }))
  ),
  experience: experiences.map((experience) => ({
    id: experience.company,
    title: `${experience.company} · ${experience.designation}`,
    description: experience.summary,
    details: experience.description || [],
    duration: experience.duration,
    location: experience.location,
    targetSection: 'experience'
  }))
});

const responseSchema = {
  type: 'object',
  properties: {
    results: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string', enum: ['Project', 'Skill', 'Experience'] },
          title: { type: 'string' },
          body: { type: 'string' },
          targetSection: { type: 'string', enum: ['projects', 'skills', 'experience'] },
          tags: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: ['id', 'type', 'title', 'body', 'targetSection', 'tags']
      }
    }
  },
  required: ['results']
};

const buildGeminiRequest = ({ query, context }) => ({
  contents: [
    {
      parts: [
        {
          text: [
            'You are ranking search results for a backend engineer portfolio.',
            `User query: ${query}`,
            'Use only the provided portfolio data.',
            'Return up to 8 relevant items.',
            'Keep result bodies concise.',
            'Prefer exact query intent, domain fit, technology fit, and practical relevance.',
            `Portfolio data: ${JSON.stringify(context)}`
          ].join('\n\n')
        }
      ]
    }
  ],
  generationConfig: {
    temperature: 0.2,
    responseMimeType: 'application/json',
    responseSchema
  }
});

const getGeminiResults = async ({ query, context }) => {
  if (!geminiApiKey) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(buildGeminiRequest({ query, context }))
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Gemini request failed with status ${response.status}: ${text}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    return [];
  }

  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed.results)) {
    return [];
  }

  return parsed.results.slice(0, 8).map((result) => ({
    id: result.id,
    type: result.type,
    title: result.title,
    body: result.body,
    targetSection: result.targetSection,
    tags: Array.isArray(result.tags) ? result.tags.slice(0, 3) : []
  }));
};

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const query = `${body.query || ''}`.trim();

    if (!query) {
      res.status(200).json({ mode: 'fallback', results: [] });
      return;
    }

    const context = await getPortfolioSearchContext();

    try {
      const geminiResults = await getGeminiResults({
        query,
        context: buildGeminiContext(context)
      });

      if (geminiResults.length) {
        res.status(200).json({ mode: 'gemini', results: geminiResults });
        return;
      }
    } catch (geminiError) {
      console.error('Gemini search failed, using fallback.', geminiError);
    }

    const fallbackResults = getFallbackResults({
      query,
      projects: context.projects,
      skillCategories: context.skillCategories,
      experiences: context.experiences
    });

    res.status(200).json({ mode: 'fallback', results: fallbackResults });
  } catch (error) {
    console.error('AI search endpoint failed.', error);
    res.status(500).json({ error: 'AI search failed' });
  }
};
