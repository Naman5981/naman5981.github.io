const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const responseSchema = {
  type: 'object',
  properties: {
    answer: { type: 'string' }
  },
  required: ['answer']
};

let cachedLocalEnv = null;

const stripWrappingQuotes = (value) => value.replace(/^['"]|['"]$/g, '');

const getLocalEnv = () => {
  if (cachedLocalEnv) {
    return cachedLocalEnv;
  }

  const envPath = path.join(process.cwd(), '.env.local');

  if (!fs.existsSync(envPath)) {
    cachedLocalEnv = {};
    return cachedLocalEnv;
  }

  const parsed = {};
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      return;
    }

    const separatorIndex = trimmed.indexOf('=');

    if (separatorIndex === -1) {
      return;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    parsed[key] = stripWrappingQuotes(value);
  });

  cachedLocalEnv = parsed;
  return cachedLocalEnv;
};

const getEnvValue = (key) => process.env[key] || getLocalEnv()[key];

const getSupabase = () => {
  const supabaseUrl = getEnvValue('SUPABASE_URL') || getEnvValue('REACT_APP_SUPABASE_URL');
  const supabaseAnonKey = getEnvValue('SUPABASE_ANON_KEY') || getEnvValue('REACT_APP_SUPABASE_ANON_KEY');

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables are not configured.');
  }

  return createClient(supabaseUrl, supabaseAnonKey);
};

const getPortfolioSearchContext = async () => {
  const profileSlug =
    getEnvValue('PROFILE_SLUG') || getEnvValue('REACT_APP_PROFILE_SLUG') || 'naman-sanadhya';
  const supabase = getSupabase();
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name, headline, bio, location, email, phone')
    .eq('slug', profileSlug)
    .single();

  if (profileError) throw profileError;

  const [
    { data: projects, error: projectError },
    { data: experiences, error: experienceError },
    { data: categories, error: categoriesError }
  ] = await Promise.all([
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
    profile: {
      fullName: profile.full_name,
      headline: profile.headline,
      bio: profile.bio,
      location: profile.location,
      email: profile.email,
      phone: profile.phone
    },
    projects: mappedProjects,
    skillCategories: mappedCategories,
    experiences: mappedExperiences
  };
};

const buildGeminiContext = ({ profile, projects, skillCategories, experiences }) => ({
  profile: {
    fullName: profile?.fullName || '',
    headline: profile?.headline || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    email: profile?.email || '',
    phone: profile?.phone || ''
  },
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
    title: `${experience.company} - ${experience.designation}`,
    description: experience.summary,
    details: experience.description || [],
    duration: experience.duration,
    location: experience.location,
    targetSection: 'experience'
  }))
});

const buildGeminiRequest = ({ query, context }) => ({
  contents: [
    {
      parts: [
        {
          text: [
            'You are speaking as the portfolio owner.',
            'Answer in first person, as if you are Naman Sanadhya talking about your own work.',
            'The portfolio owner profile is included in the data below.',
            'If the user asks about "his", "their", or "the person", interpret that as the portfolio owner.',
            `User query: ${query}`,
            'Use only the provided portfolio data.',
            'Answer in plain text only.',
            'Do not invent anything that is not present in the portfolio data.',
            'Keep the answer concise, natural, warm, and directly useful.',
            'Sound human, not robotic.',
            'Do not refer to yourself as "the portfolio owner".',
            'Use my name naturally only when it helps clarity. Otherwise answer as "I" and "my".',
            'Do not use em dashes.',
            'If the portfolio data does not support the query, say that briefly.',
            'Do not use markdown bullet lists unless the query clearly asks for a list.',
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

const getGeminiAnswer = async ({ query, context }) => {
  const geminiApiKey = getEnvValue('GEMINI_API_KEY');
  const geminiModel = getEnvValue('GEMINI_MODEL') || 'gemini-2.5-flash';

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
    return '';
  }

  const parsed = JSON.parse(text);
  if (typeof parsed.answer !== 'string') {
    return '';
  }

  return parsed.answer.trim();
};

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const isDevelopment =
    process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV === 'development';

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const query = `${body.query || ''}`.trim();

    if (!query) {
      res.status(200).json({ mode: 'gemini', answer: '' });
      return;
    }

    const context = await getPortfolioSearchContext();
    const geminiAnswer = await getGeminiAnswer({
      query,
      context: buildGeminiContext(context)
    });

    res.status(200).json({ mode: 'gemini', answer: geminiAnswer });
  } catch (error) {
    console.error('AI search endpoint failed.', error);
    res.status(500).json({
      error: 'Gemini AI search failed',
      details: isDevelopment ? error.message : undefined
    });
  }
};
