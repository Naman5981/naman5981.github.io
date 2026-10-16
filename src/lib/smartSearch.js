import {
  fallbackProfile,
  fallbackExperiences,
  fallbackProjects,
  fallbackSkillCategories
} from '../data/fallbackPortfolioData.js';

export const normalizeText = (value) =>
  `${value ?? ''}`
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const intentDictionary = {
  backend: ['backend', 'java', 'spring', 'spring boot', 'api', 'apis', 'microservice', 'microservices'],
  fintech: ['fintech', 'banking', 'payments', 'merchant', 'transaction', 'virtual account'],
  database: ['database', 'databases', 'postgres', 'postgresql', 'sql', 'mysql', 'data'],
  cloud: ['cloud', 'ci/cd', 'deployment', 'deployments', 'platform', 'platform engineering', 'devops', 'automation'],
  mobile: ['android', 'mobile', 'assistant', 'voice', 'dialogflow'],
  healthcare: ['healthcare', 'health', 'nutrition', 'medical'],
  reliability: ['production', 'production support', 'support', 'incident', 'debugging', 'reliability', 'stability', 'monitoring'],
  leadership: ['ownership', 'delivery', 'scalable', 'architecture', 'design', 'system design']
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

const STOP_WORDS = new Set(['me', 'my', 'the', 'in', 'with', 'for', 'and', 'show', 'find', 'what']);

export const extractConcepts = (query) => {
  const normalizedQuery = normalizeText(query);
  const matchedConcepts = new Set();

  Object.entries(intentDictionary).forEach(([concept, keywords]) => {
    if (keywords.some((keyword) => normalizedQuery.includes(normalizeText(keyword)))) {
      matchedConcepts.add(concept);
    }
  });

  return Array.from(matchedConcepts);
};

export const buildSearchTokens = (query) =>
  normalizeText(query)
    .split(' ')
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));

const scoreTextMatch = (text, queryTokens) =>
  queryTokens.reduce((score, token) => {
    if (!text.includes(token)) {
      return score;
    }
    return score + (token.length > 6 ? 3 : token.length > 4 ? 2 : 1);
  }, 0);

const scoreTitleMatch = (text, queryTokens) =>
  queryTokens.reduce((score, token) => (text.includes(token) ? score + 3 : score), 0);

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

const detectConceptsFromText = (text) => {
  const concepts = [];
  if (text.includes('spring') || text.includes('java') || text.includes('api')) {
    concepts.push('backend');
  }
  if (text.includes('bank') || text.includes('payment') || text.includes('merchant') || text.includes('transaction')) {
    concepts.push('fintech');
  }
  if (text.includes('postgres') || text.includes('mysql') || text.includes('sql')) {
    concepts.push('database');
  }
  if (text.includes('android') || text.includes('assistant') || text.includes('mobile')) {
    concepts.push('mobile');
  }
  if (text.includes('health') || text.includes('nutrition')) {
    concepts.push('healthcare');
  }
  if (text.includes('cloud') || text.includes('ci') || text.includes('deployment')) {
    concepts.push('cloud');
  }
  if (text.includes('incident') || text.includes('production') || text.includes('support') || text.includes('debug')) {
    concepts.push('reliability');
  }
  if (text.includes('architecture') || text.includes('ownership') || text.includes('modular') || text.includes('automation')) {
    concepts.push('leadership');
  }
  return concepts;
};

const buildProjectCandidates = (projects) =>
  projects.map((project) => {
    const searchText = normalizeText(
      [
        project.title,
        project.description,
        project.category,
        project.status,
        project.impact,
        project.problem,
        project.outcome,
        ...(project.stack ?? [])
      ].join(' ')
    );

    return {
      id: `project-${project.slug ?? project.title}`,
      type: 'Project',
      title: project.title,
      titleSearchText: normalizeText(project.title),
      body: project.impact ?? project.description,
      targetSection: 'projects',
      concepts: detectConceptsFromText(searchText),
      searchText,
      fallbackTags: project.stack?.slice(0, 3) ?? []
    };
  });

const buildSkillCandidates = (categories) =>
  categories.flatMap((category) =>
    category.skills.map((skill) => {
      const searchText = normalizeText(`${category.category} ${skill}`);

      return {
        id: `skill-${category.category}-${skill}`,
        type: 'Skill',
        title: skill,
        titleSearchText: normalizeText(skill),
        body: `Found in ${category.category}`,
        targetSection: 'skills',
        concepts: detectConceptsFromText(searchText),
        searchText,
        fallbackTags: [category.category]
      };
    })
  );

const buildExperienceCandidates = (experiences) =>
  experiences.map((experience) => {
    const searchText = normalizeText(
      [
        experience.company,
        experience.designation,
        experience.summary,
        ...(experience.description ?? []),
        experience.location,
        experience.duration
      ].join(' ')
    );

    return {
      id: `experience-${experience.company}`,
      type: 'Experience',
      title: `${experience.company} · ${experience.designation}`,
      body: experience.summary,
      titleSearchText: normalizeText(`${experience.company} ${experience.designation}`),
      targetSection: 'experience',
      concepts: detectConceptsFromText(searchText),
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
  const trimmedQuery = (query || '').trim();
  if (!trimmedQuery) {
    return [];
  }

  const queryTokens = buildSearchTokens(trimmedQuery);
  const queryConcepts = extractConcepts(trimmedQuery);
  const normalizedQuery = normalizeText(trimmedQuery);

  const candidates = [
    ...buildProjectCandidates(projects),
    ...buildSkillCandidates(skillCategories),
    ...buildExperienceCandidates(experiences)
  ];

  return candidates
    .map((candidate) => {
      const exactPhraseBonus = candidate.searchText.includes(normalizedQuery) ? 8 : 0;
      const tokenScore = scoreTextMatch(candidate.searchText, queryTokens);
      const titleScore = scoreTitleMatch(candidate.titleSearchText ?? candidate.searchText, queryTokens);
      const conceptScore = scoreConceptMatch(candidate.concepts, queryConcepts);
      const score = exactPhraseBonus + tokenScore + titleScore + conceptScore;

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

export const defaultSmartSearchPrompts = [
  'Show me fintech backend work',
  'Find projects using Java and PostgreSQL',
  'What shows production support experience?',
  'Where is Naman based and how can I contact him?'
];

export const getDynamicSmartSearchPrompts = ({
  projects = [],
  activeContext = 'Portfolio'
}) => {
  const contextKey = `${activeContext || ''}`.toLowerCase();

  if (contextKey.includes('experience')) {
    return [
      'What did Naman achieve at AU Small Finance Bank?',
      'How did he reduce API latency by 40%?',
      'What shows production incident resolution experience?',
      'What scale has he handled in high-traffic systems?',
      'What was his role at Infosys and Tech Mahindra?'
    ];
  }

  if (contextKey.includes('project')) {
    const topProj = projects[0]?.title || 'Virtual Account Management';
    const secondProj = projects[1]?.title || 'Employee Performance Tracker';
    return [
      `Tell me about ${topProj}`,
      `How does ${secondProj} work?`,
      'Show me fintech and banking backend projects',
      'Which projects use Spring Boot and PostgreSQL?',
      'What mobile and voice assistant apps has he built?'
    ];
  }

  if (contextKey.includes('skill')) {
    return [
      "What is Naman's core backend tech stack?",
      'How deep is his Java and Spring Boot experience?',
      'Which databases and caching solutions does he use?',
      'What are his DevOps and CI/CD competencies?',
      'Which observability and testing tools does he use?'
    ];
  }

  if (contextKey.includes('profile') || contextKey.includes('about')) {
    return [
      "What is Naman's engineering background?",
      'Where is Naman based and is he open to work?',
      'How can I contact Naman or preview his resume?',
      'What makes him a strong fit for a senior backend role?',
      'Show me his top career highlights'
    ];
  }

  if (contextKey.includes('education') || contextKey.includes('achievement')) {
    return [
      'Where did Naman complete his education?',
      'What hackathons or awards has Naman won?',
      'Tell me about the KPIT Innovation Award',
      'What is his degree and specialization?'
    ];
  }

  const defaultPrompts = [
    'Show me fintech backend work',
    'Find projects using Java and PostgreSQL',
    'What shows production support experience?',
    'Where is Naman based and how can I contact him?'
  ];

  if (projects[0]?.title) {
    defaultPrompts.unshift(`Tell me about ${projects[0].title}`);
  }

  return defaultPrompts.slice(0, 5);
};

// --- Modular Intent Matchers for Local Answer Synthesis ---

const matchResumeIntent = (normalized, _raw, { profile }) => {
  if (['resume', 'cv', 'curriculum vitae'].some((kw) => normalized.includes(kw))) {
    const email = profile?.email || 'namansanadhya@gmail.com';
    return `You can preview or download my full resume directly using the 'Preview Resume' and 'Download' buttons in the navigation header, or reach out to me directly at ${email}.`;
  }
  return null;
};

const matchContactIntent = (normalized, _raw, { profile }) => {
  const contactKeywords = ['contact', 'reach', 'email', 'phone', 'call', 'hire', 'hiring', 'interview', 'connect', 'linkedin', 'github', 'get in touch'];
  if (contactKeywords.some((kw) => normalized.includes(kw))) {
    const email = profile?.email || 'namansanadhya@gmail.com';
    const phone = profile?.phone || '+91 76651 55815';
    return `You can reach me directly via email at ${email} or by phone at ${phone}. I am also active on LinkedIn (linkedin.com/in/namansanadhya) and GitHub (github.com/naman5981). Feel free to send me a message regarding backend engineering opportunities or collaboration.`;
  }
  return null;
};

const matchLocationIntent = (normalized, _raw, { profile }) => {
  const locationKeywords = ['location', 'based', 'city', 'where', 'bengaluru', 'bangalore', 'relocate', 'remote', 'open to work'];
  if (locationKeywords.some((kw) => normalized.includes(kw))) {
    const location = profile?.location || 'Bengaluru, Karnataka';
    return `I am based in ${location}, working as a Java Backend Developer with 5+ years of experience in distributed banking systems, microservices, and transaction platforms. I am open to discussing relevant engineering roles in Bengaluru as well as remote/hybrid setups.`;
  }
  return null;
};

const matchReliabilityIntent = (normalized) => {
  const reliabilityKeywords = [
    'incident', 'incidents', 'production support', 'reliability', 'latency',
    'performance tuning', 'sla', 'debugging', 'defect', '40%', '30%',
    'scale', 'concurrency', '1m', 'concurrent', 'uptime', 'stability'
  ];
  if (reliabilityKeywords.some((kw) => normalized.includes(kw))) {
    return `Production reliability and performance tuning are central to my work:
• At Infosys, I optimized 8+ Spring Boot microservices with Redis-backed caching, reducing API latency by 40%, and resolved 25+ critical production incidents using distributed tracing and log analysis, cutting recurring defects by 35%.
• At AU Small Finance Bank (via Xebia), I delivered 5+ production features reducing latency by 30% and resolved 10+ critical SLA-breach incidents, maintaining zero critical deployment failures.
• At Tech Mahindra, I engineered backend services supporting 1M+ concurrent users during live events, implementing circuit breakers and request throttling to sustain 99.9% uptime.`;
  }
  return null;
};

const matchCompanyIntent = (normalized) => {
  if (['au small finance', 'au bank', 'xebia', 'current role', 'present role'].some((kw) => normalized.includes(kw))) {
    return 'At AU Small Finance Bank (through Xebia, Jan 2026 - Present), I build production-grade banking microservices in Java 17 and Spring Boot 3. My focus is on scalable service design, transaction and reporting workflows, secure APIs, and release reliability. I have delivered 5+ production features reducing latency by 30%, resolved 10+ production-critical defects with zero deployment failures, and mentored junior engineers on clean architecture, SOLID principles, and TDD.';
  }
  if (['infosys', 'bfsi'].some((kw) => normalized.includes(kw))) {
    return 'At Infosys (May 2022 - Jan 2026), I was a Java Backend Developer on BFSI platforms. I optimized 8+ Spring Boot microservices with Redis-backed caching, reducing API latency by 40%. I also resolved 25+ critical production incidents using distributed tracing and log analysis (cutting recurring incidents by 35%), designed secure REST APIs with OAuth2/JWT and idempotency protections, and supported 10+ stable production releases via Jenkins and GitLab CI with Dockerized deployments.';
  }
  if (['tech mahindra', 'bcci', 'ipl'].some((kw) => normalized.includes(kw))) {
    return 'At Tech Mahindra (Jan 2021 - Apr 2022), I engineered backend services supporting 1M+ concurrent users during high-traffic BCCI and IPL live events. I implemented request throttling, circuit breakers, and load-balancing optimizations to sustain 99.9% uptime, reduced API response times by 15%, and cut production defects by 25% through enhanced JUnit and Mockito test coverage.';
  }
  if (['fograph', 'founder', 'co-founder'].some((kw) => normalized.includes(kw))) {
    return 'As a Co-founder and Android Developer at FoGraph (Nov 2019 - Dec 2020), I owned end-to-end mobile development in Java, integrating Firebase Firestore and SQLite for offline synchronization, and improving app stability via Firebase Crashlytics monitoring.';
  }
  return null;
};

const matchSpecificProjectIntent = (normalized, raw, { projects, skillCategories, experiences }) => {
  if (['project', 'projects', 'fintech backend', 'fintech project'].some((kw) => normalized.includes(kw))) {
    const matches = getSmartSearchResults({ query: raw, projects, skillCategories, experiences });
    const projectMatches = matches.filter((m) => m.type === 'Project');
    if (projectMatches.length > 0) {
      const topProjects = projectMatches.slice(0, 3);
      const bullets = topProjects.map((p) => `• ${p.title}: ${p.body}`).join('\n');
      return `Here are the matching projects from my portfolio for "${raw}":\n\n${bullets}\n\nYou can click on any project card below to jump directly to its details.`;
    }
  }

  if (['virtual account', 'merchant', 'payee', 'payment collection'].some((kw) => normalized.includes(kw))) {
    return 'Virtual Account Management is a fintech banking system I designed for merchant-based payment collection. It defines robust REST API contracts, enforces Spring Security controls, and handles concurrent payee transactions with transactional integrity.';
  }

  if (['employee performance', 'performance tracker', 'review submission'].some((kw) => normalized.includes(kw))) {
    return 'The Employee Performance Tracker is a backend service I built with Spring Boot and PostgreSQL. It exposes secure REST APIs for employee onboarding, review cycle submissions, historical review retrieval, and cycle-level analytics reporting, backed by JPA data modeling and robust input validation.';
  }

  if (['springcore', 'core banking', 'fund transfer', 'rbac'].some((kw) => normalized.includes(kw))) {
    return 'SpringCore Banking is a core banking system I developed to handle account management and fund transfers with role-based access control (RBAC). It guarantees transaction consistency under concurrent load, includes 90%+ unit test coverage, and supports Dockerized container deployment.';
  }

  if (['officinal', 'daimaa', 'nutrition', 'healthcare', 'dialogflow', 'google assistant', 'voice'].some((kw) => normalized.includes(kw))) {
    return `My projects in mobile and conversational systems include:
• Officinal: A multilingual Android healthcare app featuring Dialogflow-based voice symptom input and verified content via Firebase Firestore.
• Daimaa: An Android pregnancy nutrition app built in Java with a Firebase backend and a voice chatbot integrated with Google Assistant.`;
  }

  return null;
};

const matchEducationIntent = (normalized) => {
  const educationKeywords = ['education', 'degree', 'b.tech', 'btech', 'college', 'university', 'school', 'study', 'alok', 'geetanjali', 'gits'];
  if (educationKeywords.some((kw) => normalized.includes(kw))) {
    return 'I hold a B.Tech in Computer Science from Geetanjali Institute of Technical Studies, Udaipur (Class of 2020), and completed my CBSE Class XII at Alok Senior Secondary School, Udaipur.';
  }
  return null;
};

const matchAchievementsIntent = (normalized) => {
  const achievementKeywords = ['achievement', 'achievements', 'award', 'awards', 'hackathon', 'hackathons', 'kpit', 'smart india hackathon', 'sih', 'winner'];
  if (achievementKeywords.some((kw) => normalized.includes(kw))) {
    return `My notable achievements include:
• Winner - KPIT Innovation Award, Smart India Hackathon 2018
• State-Level Finalist - Student Start-up Exposure Program, Rajasthan
• 2nd Runner-up - Smart India Hackathon 2019`;
  }
  return null;
};

const matchTechStackIntent = (normalized) => {
  const techKeywords = [
    'skill', 'skills', 'tech stack', 'technologies', 'tools', 'java', 'spring',
    'spring boot', 'database', 'postgres', 'postgresql', 'mysql', 'redis',
    'caching', 'docker', 'ci/cd', 'jenkins', 'devops', 'cloud', 'aws',
    'architecture', 'clean architecture', 'solid'
  ];
  if (techKeywords.some((kw) => normalized.includes(kw))) {
    return `My core engineering stack and competencies include:
• Languages & Frameworks: Java (8, 11, 17), Spring Boot 3, Spring MVC, Spring Security, Hibernate, JPA, Microservices Architecture.
• APIs & Integration: REST API Design, OpenAPI/Swagger, OAuth2, JWT, validation, idempotency.
• Data & Caching: PostgreSQL, MySQL, Redis (caching), Firebase Firestore.
• DevOps & Cloud: Docker, Jenkins, GitLab CI, GitHub Actions, AWS (EC2, S3, RDS).
• Reliability & Practices: Distributed Tracing, SLF4J/Logback, JUnit, Mockito, SOLID principles, Clean Architecture, and TDD.`;
  }
  return null;
};

const matchBackgroundIntent = (normalized) => {
  const bioKeywords = ['background', 'who is', 'about you', 'about naman', 'specialize', 'specialization', 'overview', 'profile', 'summary', 'introduce'];
  if (bioKeywords.some((kw) => normalized.includes(kw))) {
    return 'I am a Java Backend Developer with 5+ years of experience building reliable, high-throughput systems for banking and fintech platforms. I specialize in Spring Boot microservices, secure API design, transaction safety, Redis caching, and production debugging. Over my career across AU Small Finance Bank (via Xebia), Infosys, and Tech Mahindra, I have reduced latency by 40%, resolved 35+ critical production incidents, and supported platforms serving 1M+ concurrent users.';
  }
  return null;
};

const intentMatchers = [
  matchResumeIntent,
  matchContactIntent,
  matchLocationIntent,
  matchReliabilityIntent,
  matchCompanyIntent,
  matchSpecificProjectIntent,
  matchEducationIntent,
  matchAchievementsIntent,
  matchTechStackIntent,
  matchBackgroundIntent
];

export const synthesizeLocalSmartAnswer = ({ query, context = {} }) => {
  const trimmed = `${query ?? ''}`.trim();
  if (!trimmed) {
    return '';
  }

  const normalized = normalizeText(trimmed);
  const resolvedContext = {
    profile: context?.profile || fallbackProfile,
    experiences: context?.experiences?.length ? context.experiences : fallbackExperiences,
    projects: context?.projects?.length ? context.projects : fallbackProjects,
    skillCategories: context?.skillCategories?.length ? context.skillCategories : fallbackSkillCategories
  };

  for (const matcher of intentMatchers) {
    const answer = matcher(normalized, trimmed, resolvedContext);
    if (answer) {
      return answer;
    }
  }

  const searchMatches = getSmartSearchResults({
    query: trimmed,
    projects: resolvedContext.projects,
    skillCategories: resolvedContext.skillCategories,
    experiences: resolvedContext.experiences
  });

  if (searchMatches.length > 0) {
    const bullets = searchMatches.slice(0, 3).map((match) => {
      const typeLabel = match.type === 'Project' ? 'Project' : match.type === 'Experience' ? 'Role' : 'Skill';
      return `• ${match.title} (${typeLabel}): ${match.body}`;
    }).join('\n');

    return `Here are the most relevant details from my portfolio regarding "${trimmed}":\n\n${bullets}\n\nYou can explore more details in the highlighted sections below.`;
  }

  return `I could not find an exact match for "${trimmed}" in my portfolio. However, you can ask me about my Java & Spring Boot backend experience, banking microservices, production incident resolution, or contact details.`;
};
