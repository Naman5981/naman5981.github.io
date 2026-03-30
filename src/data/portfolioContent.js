export const navigationSections = [
  { id: 'about', label: 'Profile' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Toolkit' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'achievements', label: 'Achievements' }
];

export const workspacePanels = [
  {
    id: 'overview',
    label: 'Overview',
    eyebrow: 'Introduction',
    title: 'Backend engineer focused on systems that need to stay reliable under pressure.',
    description:
      'I work on backend systems where correctness, performance, and production stability matter, with most of my recent work centered on financial services and transaction-driven platforms.',
    metrics: [
      '5+ years building backend systems',
      'Fintech and platform experience',
      'Microservices, APIs, and production support'
    ],
    links: ['about', 'experience', 'skills']
  },
  {
    id: 'experience',
    label: 'Experience',
    eyebrow: 'Career',
    title: 'Work shaped by banking workflows, backend architecture, and operational ownership.',
    description:
      'My roles have focused on designing services, shipping production features, debugging live issues, and improving reliability across banking and high-traffic backend systems.',
    metrics: [
      'Spring Boot services',
      'Incident response and fixes',
      'Scalable transaction workflows'
    ],
    links: ['experience', 'achievements']
  },
  {
    id: 'projects',
    label: 'Projects',
    eyebrow: 'Selected Work',
    title: 'Product work spanning banking systems, healthcare tools, and internal productivity apps.',
    description:
      'The projects collection focuses on applied builds: systems that support operations, domain-specific workflows, or practical user experiences across backend and mobile platforms.',
    metrics: [
      'Operational tools and product builds',
      'Backend-heavy implementation',
      'Healthcare, fintech, and internal apps'
    ],
    links: ['projects']
  },
  {
    id: 'toolkit',
    label: 'Toolkit',
    eyebrow: 'Capabilities',
    title: 'Skills, education, and recognition grouped as supporting depth.',
    description:
      'This section gives a quick view of the technologies, engineering practices, and academic foundation that support the delivery work shown elsewhere on the site.',
    metrics: ['Languages and APIs', 'Cloud and CI/CD', 'Architecture and automation'],
    links: ['skills', 'education']
  }
];

export const portfolioStats = [
  { value: '5+', label: 'Years shipping backend systems' },
  { value: '3', label: 'Core tracks: banking, platforms, automation' },
  { value: '30+', label: 'Production issues investigated and resolved' }
];

export const projectShowcase = {
  'employee-performance-tracker': {
    category: 'Internal Productivity',
    status: 'Live Build',
    accent: 'teal',
    stack: ['Java', 'Spring Boot', 'MySQL', 'Admin Workflows'],
    impact: 'Staff records, reviews, and performance summaries in one operational dashboard.',
    links: {
      repoUrl: 'https://github.com/Naman5981/Employee_Performance_Tracker'
    }
  },
  'virtual-account-management': {
    category: 'Fintech System',
    status: 'Production Concept',
    accent: 'blue',
    stack: ['Spring Boot', 'Merchant Payments', 'Validation', 'Transaction Mapping'],
    impact: 'Structured merchant collections into a safer, traceable virtual account flow.'
  },
  springcore: {
    category: 'Banking Platform',
    status: 'Architecture Build',
    accent: 'violet',
    stack: ['RBAC', 'Transactions', 'Modular Services', 'Java'],
    impact: 'Focused on reliable banking operations with role-aware access and transaction safety.'
  },
  officinal: {
    category: 'Healthcare Product',
    status: 'Voice Experience',
    accent: 'orange',
    stack: ['Android', 'Dialogflow', 'Google Assistant', 'Realtime Updates'],
    impact: 'Made healthcare interactions easier through voice-based support and chatbot flows.'
  },
  daimaa: {
    category: 'Health Guidance',
    status: 'Mobile Product',
    accent: 'rose',
    stack: ['Android', 'Structured Content', 'Chatbot', 'Nutrition Guidance'],
    impact: 'Built a guided nutrition experience with scalable content and conversational help.'
  }
};

export const projectAliases = {
  'springcore-banking': 'springcore'
};

export const portfolioErrorContent = {
  code: '404.',
  title: 'Oooooooops!',
  description:
    'The page is up, but the portfolio data source is not responding the way it should.',
  actionLabel: "It's not you, it's me."
};
