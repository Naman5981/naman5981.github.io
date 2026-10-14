export const fallbackProfile = {
  id: 'fallback-profile-naman',
  fullName: 'Naman Sanadhya',
  headline: 'Java Backend Developer',
  bio: "I build reliable backend systems for banking and transaction-heavy platforms.\nOver the last 5+ years, I've worked across Spring Boot microservices, API design, transaction safety, production debugging, and modular service architecture.",
  location: 'Bengaluru, Karnataka',
  email: 'namansanadhya@gmail.com',
  phone: '+91 76651 55815',
  yearsExperienceLabel: '5+',
  issuesSolvedTarget: 110,
  coreDomainsCount: 3,
  backendFocusLabel: '100%',
  profileImagePath: '/profile.jpg',
  resumePath: '/Naman_Sanadhya_Resume.pdf',
  socialLinks: [
    { platform: 'github', label: 'GitHub', url: 'https://github.com/naman5981', sort_order: 1 },
    { platform: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/namansanadhya', sort_order: 2 }
  ]
};

export const fallbackExperiences = [
  {
    company: 'Xebia (AU Small Finance Bank)',
    website: 'https://www.xebia.com',
    logo: '/logos/xebia.svg',
    logoAlt: 'Xebia logo',
    location: 'Jaipur, RJ',
    duration: 'Jan 2026 - Present',
    designation: 'Java Developer',
    summary:
      'Building production-grade banking microservices at AU Small Finance Bank through Xebia, focused on scalable service design, transaction/reporting workflows, secure APIs, and release reliability.',
    description: [
      'Delivered 5+ production features across transaction and reporting modules using Java 17 and Spring Boot 3, reducing latency by 30%.',
      'Designed scalable secure microservices with OpenAPI and Spring Security, sustaining zero critical deployment failures across releases.',
      'Resolved 10+ production-critical defects and SLA-breach incidents, reducing operational escalations by roughly 40%.',
      'Mentored 3+ junior engineers on SOLID principles, clean architecture, and TDD, helping reduce post-release defects by 20%.'
    ]
  },
  {
    company: 'Infosys Limited',
    website: 'https://www.infosys.com',
    logo: '/logos/infosys.svg',
    logoAlt: 'Infosys logo',
    location: 'Jaipur, RJ',
    duration: 'May 2022 - Jan 2026',
    designation: 'Java Backend Developer',
    summary:
      'Built and optimized Java/Spring Boot backend systems for BFSI platforms at Infosys, with a focus on performance tuning, secure API design, production incident resolution, and stable release delivery.',
    description: [
      'Optimized 8+ Spring Boot microservices with Redis-backed caching, reducing API latency by 40%.',
      'Designed REST APIs for BFSI workflows with OAuth2, JWT, validation, idempotency, and robust exception handling.',
      'Resolved 25+ critical production incidents using log analysis and cross-service tracing, cutting recurring incident rates by 35%.',
      'Improved transaction safety with stronger JPA boundaries, isolation handling, and database consistency protections.',
      'Supported 10+ production releases through Jenkins and GitLab CI, improving delivery stability with Dockerized deployments.'
    ]
  },
  {
    company: 'Tech Mahindra',
    website: 'https://www.techmahindra.com',
    logo: '/logos/tech-mahindra.svg',
    logoAlt: 'Tech Mahindra logo',
    location: 'Mumbai, MH',
    duration: 'Jan 2021 - Apr 2022',
    designation: 'Associate Software Engineer',
    summary:
      'Supported high-traffic backend systems at Tech Mahindra, improving reliability, response time, and test confidence for large-scale live-event workloads.',
    description: [
      'Engineered backend services supporting 1M+ concurrent users during BCCI and IPL live events.',
      'Implemented throttling, circuit breakers, and load-balancing improvements that helped sustain 99.9% uptime.',
      'Improved API response times by 15% through query and request-path optimization.',
      'Reduced production defects by 25% through stronger JUnit and Mockito coverage.'
    ]
  },
  {
    company: 'FoGraph',
    website: null,
    logo: null,
    logoAlt: null,
    location: 'Udaipur, RJ',
    duration: 'Nov 2019 - Dec 2020',
    designation: 'Android Developer (Co-founder)',
    summary:
      'Co-founded and built Android product experiences at FoGraph, owning Java-based app development, Firebase-backed data flows, and mobile stability improvements.',
    description: [
      'Built Android experiences in Java while owning end-to-end product delivery as a co-founder.',
      'Used Firebase Firestore and SQLite for offline-aware data handling and synchronization.',
      'Improved application stability through Firebase Crashlytics monitoring and iterative fixes.',
      'Drove feature delivery across design, development, release, and early product feedback loops.'
    ]
  }
];

export const fallbackSkillCategories = [
  { category: 'Core Languages', skills: ['Java (8, 11, 17)', 'Shell Scripting'] },
  {
    category: 'Backend Frameworks',
    skills: ['Spring Boot 3', 'Spring MVC', 'Spring Security', 'Hibernate', 'JPA', 'Microservices Architecture', 'JUnit', 'Mockito']
  },
  { category: 'API & Integration', skills: ['REST API Design', 'OpenAPI', 'Swagger', 'OAuth2', 'JWT', 'gRPC (familiar)'] },
  { category: 'Databases', skills: ['MySQL', 'PostgreSQL', 'Redis (caching)', 'Firebase Firestore'] },
  { category: 'DevOps & CI/CD', skills: ['Jenkins', 'GitLab CI', 'GitHub Actions', 'Docker', 'Maven'] },
  { category: 'Cloud Platforms', skills: ['AWS (EC2, S3, RDS)', 'GCP'] },
  { category: 'Observability', skills: ['SLF4J', 'Logback', 'Distributed Tracing', 'Firebase Crashlytics'] },
  { category: 'Methodologies', skills: ['Agile/Scrum', 'SOLID Principles', 'Clean Architecture', 'TDD', 'Circuit Breaker', 'Design Patterns'] },
  { category: 'Developer Tools', skills: ['IntelliJ IDEA', 'Postman', 'Swagger UI', 'GitHub Copilot', 'Cursor', 'Bruno'] }
];

export const fallbackProjects = [
  {
    slug: 'employee-performance-tracker',
    title: 'Employee Performance Tracker',
    repoUrl: 'https://github.com/Naman5981/Employee_Performance_Tracker',
    liveUrl: null,
    href: 'https://github.com/Naman5981/Employee_Performance_Tracker',
    description:
      'Built an employee performance tracking system with Spring Boot and PostgreSQL, exposing REST APIs for onboarding, review submission, review history retrieval, and cycle-level summary reporting.'
  },
  {
    slug: 'virtual-account-management',
    title: 'Virtual Account Management',
    repoUrl: null,
    liveUrl: null,
    href: null,
    description:
      'Designed a virtual account service for merchant-based payment collection, defining REST API contracts, enforcing Spring Security controls, and handling concurrent payee transactions with transactional integrity.'
  },
  {
    slug: 'springcore-banking',
    title: 'SpringCore Banking',
    repoUrl: null,
    liveUrl: null,
    href: null,
    description:
      'Built core banking account management and fund transfer features with RBAC, transaction consistency under concurrent load, 90%+ unit test coverage, and Docker-based delivery.'
  },
  {
    slug: 'officinal',
    title: 'Officinal',
    repoUrl: null,
    liveUrl: null,
    href: null,
    description:
      'Built a multilingual Android healthcare application with Dialogflow-based voice symptom input and dynamic verified content delivered through Firebase Firestore.'
  },
  {
    slug: 'daimaa',
    title: 'Daimaa',
    repoUrl: null,
    liveUrl: null,
    href: null,
    description:
      'Developed an Android pregnancy nutrition app in Java with a Firebase backend and a voice-based chatbot integrated with Google Assistant.'
  }
];

export const fallbackEducation = [
  {
    degree: 'B.Tech in Computer Science',
    institution: 'Geetanjali Institute of Technical Studies, Udaipur',
    duration: '2020'
  },
  {
    degree: 'CBSE Class XII',
    institution: 'Alok Senior Secondary School, Udaipur',
    duration: '2016'
  }
];

export const fallbackAchievements = [
  'Winner - KPIT Innovation Award, Smart India Hackathon 2018',
  'State-Level Finalist - Student Start-up Exposure Program, Rajasthan',
  '2nd Runner-up - Smart India Hackathon 2019'
];
