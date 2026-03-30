const normalize = (value) =>
  `${value ?? ''}`
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

const describeMatches = (candidateConcepts, queryConcepts, fallbackTags = []) => {
  const matchedConcepts = queryConcepts
    .filter((concept) => candidateConcepts.includes(concept))
    .map((concept) => labelMap[concept]);

  return matchedConcepts.length ? matchedConcepts : fallbackTags.slice(0, 3);
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
        ...(project.stack ?? [])
      ].join(' ')
    );

    if (searchText.includes('spring') || searchText.includes('java')) {
      concepts.push('backend');
    }
    if (searchText.includes('bank') || searchText.includes('payment') || searchText.includes('merchant')) {
      concepts.push('fintech');
    }
    if (searchText.includes('postgres') || searchText.includes('sql')) {
      concepts.push('database');
    }
    if (searchText.includes('android') || searchText.includes('assistant')) {
      concepts.push('mobile');
    }
    if (searchText.includes('health') || searchText.includes('nutrition')) {
      concepts.push('healthcare');
    }
    if (searchText.includes('architecture') || searchText.includes('modular')) {
      concepts.push('leadership');
    }

    return {
      id: `project-${project.slug ?? project.title}`,
      type: 'Project',
      title: project.title,
      body: project.impact ?? project.description,
      targetSection: 'projects',
      concepts,
      searchText,
      fallbackTags: project.stack?.slice(0, 3) ?? []
    };
  });

const buildSkillCandidates = (categories) =>
  categories.flatMap((category) =>
    category.skills.map((skill) => {
      const searchText = normalize(`${category.category} ${skill}`);
      const concepts = [];

      if (
        searchText.includes('java') ||
        searchText.includes('spring') ||
        searchText.includes('api')
      ) {
        concepts.push('backend');
      }
      if (searchText.includes('postgres') || searchText.includes('mysql') || searchText.includes('sql')) {
        concepts.push('database');
      }
      if (searchText.includes('cloud') || searchText.includes('ci') || searchText.includes('deployment')) {
        concepts.push('cloud');
      }
      if (searchText.includes('android') || searchText.includes('mobile')) {
        concepts.push('mobile');
      }
      if (searchText.includes('automation') || searchText.includes('architecture')) {
        concepts.push('leadership');
      }

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
        ...(experience.description ?? []),
        experience.location
      ].join(' ')
    );
    const concepts = [];

    if (
      searchText.includes('spring') ||
      searchText.includes('java') ||
      searchText.includes('service')
    ) {
      concepts.push('backend');
    }
    if (
      searchText.includes('bank') ||
      searchText.includes('financial') ||
      searchText.includes('transaction')
    ) {
      concepts.push('fintech');
    }
    if (
      searchText.includes('incident') ||
      searchText.includes('production') ||
      searchText.includes('support') ||
      searchText.includes('debug')
    ) {
      concepts.push('reliability');
    }
    if (
      searchText.includes('architecture') ||
      searchText.includes('ownership') ||
      searchText.includes('scalable')
    ) {
      concepts.push('leadership');
    }

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

export const getSmartSearchResults = ({
  query,
  projects = [],
  skillCategories = [],
  experiences = []
}) => {
  const trimmedQuery = query.trim();
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
        ...candidate,
        score,
        tags: describeMatches(candidate.concepts, queryConcepts, candidate.fallbackTags)
      };
    })
    .filter((candidate) => candidate.score > 0)
    .sort((left, right) => right.score - left.score || left.type.localeCompare(right.type))
    .slice(0, 8);
};

export const smartSearchPrompts = [
  'Show me fintech backend work',
  'Find projects using Java and PostgreSQL',
  'What shows production support experience?',
  'Which skills are relevant for platform engineering?'
];
