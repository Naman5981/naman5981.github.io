const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const projectRoot = path.resolve(__dirname, '..');

const loadEnvFile = (fileName) => {
  const filePath = path.join(projectRoot, fileName);
  if (!fs.existsSync(filePath)) {
    return {};
  }

  return Object.fromEntries(
    fs
      .readFileSync(filePath, 'utf8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const separatorIndex = line.indexOf('=');
        const key = line.slice(0, separatorIndex).trim();
        const value = line.slice(separatorIndex + 1).trim().replace(/^"|"$/g, '');
        return [key, value];
      })
  );
};

const env = {
  ...loadEnvFile('.env.local'),
  ...loadEnvFile('.env.admin'),
  ...process.env
};

const supabaseUrl = env.SUPABASE_URL || env.REACT_APP_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
const profileSlug = env.PROFILE_SLUG || env.REACT_APP_PROFILE_SLUG || 'naman-sanadhya';

if (!supabaseUrl) {
  throw new Error('Missing SUPABASE_URL or REACT_APP_SUPABASE_URL.');
}

if (!serviceRoleKey) {
  throw new Error(
    'Missing SUPABASE_SERVICE_ROLE_KEY. Add it to your shell env or an .env.admin file in the repo root.'
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const profile = {
  slug: profileSlug,
  full_name: 'Naman Sanadhya',
  headline: 'Java Backend Developer',
  bio: "I build reliable backend systems for banking and transaction-heavy platforms.\nOver the last 5+ years, I've worked across Spring Boot microservices, API design, transaction safety, production debugging, and modular service architecture.",
  location: 'Jaipur, Rajasthan',
  email: 'namansanadhya@gmail.com',
  phone: '+91 76651 55815',
  years_experience_label: '5+',
  issues_solved_target: 110,
  core_domains_count: 3,
  backend_focus_label: '100%',
  profile_image_path: '/profile.jpg',
  resume_path: '/Naman_Sanadhya_Resume.pdf'
};

const socialLinks = [
  { platform: 'github', label: 'GitHub', url: 'https://github.com/naman5981', sort_order: 1 },
  { platform: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/namansanadhya', sort_order: 2 }
];

const experiences = [
  {
    key: 'xebia',
    company: 'Xebia (AU Small Finance Bank)',
    website: 'https://www.xebia.com',
    logo_path: '/logos/xebia.svg',
    logo_alt: 'Xebia logo',
    location: 'Jaipur, RJ',
    start_date: '2026-01-01',
    end_date: null,
    duration_label: 'Jan 2026 - Present',
    designation: 'Java Developer',
    summary:
      'Building production-grade banking microservices at AU Small Finance Bank through Xebia, focused on scalable service design, transaction/reporting workflows, secure APIs, and release reliability.',
    sort_order: 1,
    highlights: [
      'Delivered 5+ production features across transaction and reporting modules using Java 17 and Spring Boot 3, reducing latency by 30%.',
      'Designed scalable secure microservices with OpenAPI and Spring Security, sustaining zero critical deployment failures across releases.',
      'Resolved 10+ production-critical defects and SLA-breach incidents, reducing operational escalations by roughly 40%.',
      'Mentored 3+ junior engineers on SOLID principles, clean architecture, and TDD, helping reduce post-release defects by 20%.'
    ]
  },
  {
    key: 'infosys',
    company: 'Infosys Limited',
    website: 'https://www.infosys.com',
    logo_path: '/logos/infosys.svg',
    logo_alt: 'Infosys logo',
    location: 'Jaipur, RJ',
    start_date: '2022-05-01',
    end_date: '2026-01-01',
    duration_label: 'May 2022 - Jan 2026',
    designation: 'Java Backend Developer',
    summary:
      'Built and optimized Java/Spring Boot backend systems for BFSI platforms at Infosys, with a focus on performance tuning, secure API design, production incident resolution, and stable release delivery.',
    sort_order: 2,
    highlights: [
      'Optimized 8+ Spring Boot microservices with Redis-backed caching, reducing API latency by 40%.',
      'Designed REST APIs for BFSI workflows with OAuth2, JWT, validation, idempotency, and robust exception handling.',
      'Resolved 25+ critical production incidents using log analysis and cross-service tracing, cutting recurring incident rates by 35%.',
      'Improved transaction safety with stronger JPA boundaries, isolation handling, and database consistency protections.',
      'Supported 10+ production releases through Jenkins and GitLab CI, improving delivery stability with Dockerized deployments.'
    ]
  },
  {
    key: 'tech-mahindra',
    company: 'Tech Mahindra',
    website: 'https://www.techmahindra.com',
    logo_path: '/logos/tech-mahindra.svg',
    logo_alt: 'Tech Mahindra logo',
    location: 'Mumbai, MH',
    start_date: '2021-01-01',
    end_date: '2022-04-01',
    duration_label: 'Jan 2021 - Apr 2022',
    designation: 'Associate Software Engineer',
    summary:
      'Supported high-traffic backend systems at Tech Mahindra, improving reliability, response time, and test confidence for large-scale live-event workloads.',
    sort_order: 3,
    highlights: [
      'Engineered backend services supporting 1M+ concurrent users during BCCI and IPL live events.',
      'Implemented throttling, circuit breakers, and load-balancing improvements that helped sustain 99.9% uptime.',
      'Improved API response times by 15% through query and request-path optimization.',
      'Reduced production defects by 25% through stronger JUnit and Mockito coverage.'
    ]
  },
  {
    key: 'fograph',
    company: 'FoGraph',
    website: null,
    logo_path: null,
    logo_alt: null,
    location: 'Udaipur, RJ',
    start_date: '2019-11-01',
    end_date: '2020-12-01',
    duration_label: 'Nov 2019 - Dec 2020',
    designation: 'Android Developer (Co-founder)',
    summary:
      'Co-founded and built Android product experiences at FoGraph, owning Java-based app development, Firebase-backed data flows, and mobile stability improvements.',
    sort_order: 4,
    highlights: [
      'Built Android experiences in Java while owning end-to-end product delivery as a co-founder.',
      'Used Firebase Firestore and SQLite for offline-aware data handling and synchronization.',
      'Improved application stability through Firebase Crashlytics monitoring and iterative fixes.',
      'Drove feature delivery across design, development, release, and early product feedback loops.'
    ]
  }
];

const skillCategories = [
  ['Core Languages', ['Java (8, 11, 17)', 'Shell Scripting']],
  [
    'Backend Frameworks',
    ['Spring Boot 3', 'Spring MVC', 'Spring Security', 'Hibernate', 'JPA', 'Microservices Architecture', 'JUnit', 'Mockito']
  ],
  ['API & Integration', ['REST API Design', 'OpenAPI', 'Swagger', 'OAuth2', 'JWT', 'gRPC (familiar)']],
  ['Databases', ['MySQL', 'PostgreSQL', 'Redis (caching)', 'Firebase Firestore']],
  ['DevOps & CI/CD', ['Jenkins', 'GitLab CI', 'GitHub Actions', 'Docker', 'Maven']],
  ['Cloud Platforms', ['AWS (EC2, S3, RDS)', 'GCP']],
  ['Observability', ['SLF4J', 'Logback', 'Distributed Tracing', 'Firebase Crashlytics']],
  ['Methodologies', ['Agile/Scrum', 'SOLID Principles', 'Clean Architecture', 'TDD', 'Circuit Breaker', 'Design Patterns']],
  ['Developer Tools', ['IntelliJ IDEA', 'Postman', 'Swagger UI', 'GitHub Copilot', 'Cursor', 'Bruno']]
];

const projects = [
  {
    slug: 'employee-performance-tracker',
    title: 'Employee Performance Tracker',
    repo_url: 'https://github.com/Naman5981/Employee_Performance_Tracker',
    live_url: null,
    description:
      'Built an employee performance tracking system with Spring Boot and PostgreSQL, exposing REST APIs for onboarding, review submission, review history retrieval, and cycle-level summary reporting.',
    featured: true,
    sort_order: 1
  },
  {
    slug: 'virtual-account-management',
    title: 'Virtual Account Management',
    repo_url: null,
    live_url: null,
    description:
      'Designed a virtual account service for merchant-based payment collection, defining REST API contracts, enforcing Spring Security controls, and handling concurrent payee transactions with transactional integrity.',
    featured: true,
    sort_order: 2
  },
  {
    slug: 'springcore-banking',
    title: 'SpringCore Banking',
    repo_url: null,
    live_url: null,
    description:
      'Built core banking account management and fund transfer features with RBAC, transaction consistency under concurrent load, 90%+ unit test coverage, and Docker-based delivery.',
    featured: true,
    sort_order: 3
  },
  {
    slug: 'officinal',
    title: 'Officinal',
    repo_url: null,
    live_url: null,
    description:
      'Built a multilingual Android healthcare application with Dialogflow-based voice symptom input and dynamic verified content delivered through Firebase Firestore.',
    featured: true,
    sort_order: 4
  },
  {
    slug: 'daimaa',
    title: 'Daimaa',
    repo_url: null,
    live_url: null,
    description:
      'Developed an Android pregnancy nutrition app in Java with a Firebase backend and a voice-based chatbot integrated with Google Assistant.',
    featured: true,
    sort_order: 5
  }
];

const education = [
  {
    degree: 'B.Tech in Computer Science',
    institution: 'Geetanjali Institute of Technical Studies, Udaipur',
    graduation_year: 2020,
    duration_label: '2020',
    sort_order: 1
  },
  {
    degree: 'CBSE Class XII',
    institution: 'Alok Senior Secondary School, Udaipur',
    graduation_year: 2016,
    duration_label: '2016',
    sort_order: 2
  }
];

const achievements = [
  {
    title: 'Winner',
    awarder: 'KPIT Innovation Award, Smart India Hackathon',
    award_year: 2018,
    description: null,
    raw_text: 'Winner - KPIT Innovation Award, Smart India Hackathon 2018',
    sort_order: 1
  },
  {
    title: 'State-Level Finalist',
    awarder: 'Student Start-up Exposure Program, Rajasthan',
    award_year: null,
    description: null,
    raw_text: 'State-Level Finalist - Student Start-up Exposure Program, Rajasthan',
    sort_order: 2
  },
  {
    title: '2nd Runner-up',
    awarder: 'Smart India Hackathon',
    award_year: 2019,
    description: null,
    raw_text: '2nd Runner-up - Smart India Hackathon 2019',
    sort_order: 3
  }
];

const assertNoError = (error, context) => {
  if (error) {
    throw new Error(`${context}: ${error.message}`);
  }
};

const main = async () => {
  const { data: profileRows, error: profileUpsertError } = await supabase
    .from('profiles')
    .upsert(profile, { onConflict: 'slug' })
    .select('id')
    .eq('slug', profileSlug)
    .single();

  assertNoError(profileUpsertError, 'Upserting profile failed');

  const profileId = profileRows.id;

  const { data: existingExperiences, error: experienceFetchError } = await supabase
    .from('experiences')
    .select('id')
    .eq('profile_id', profileId);

  assertNoError(experienceFetchError, 'Fetching existing experiences failed');

  const existingExperienceIds = (existingExperiences || []).map((item) => item.id);

  if (existingExperienceIds.length > 0) {
    const { error: highlightDeleteError } = await supabase
      .from('experience_highlights')
      .delete()
      .in('experience_id', existingExperienceIds);
    assertNoError(highlightDeleteError, 'Deleting existing experience highlights failed');
  }

  await Promise.all([
    supabase.from('profile_social_links').delete().eq('profile_id', profileId),
    supabase.from('experiences').delete().eq('profile_id', profileId),
    supabase.from('projects').delete().eq('profile_id', profileId),
    supabase.from('education').delete().eq('profile_id', profileId),
    supabase.from('achievements').delete().eq('profile_id', profileId)
  ]).then((results) => {
    results.forEach(({ error }, index) => {
      const labels = ['social links', 'experiences', 'projects', 'education', 'achievements'];
      assertNoError(error, `Deleting existing ${labels[index]} failed`);
    });
  });

  const { data: existingCategories, error: categoryFetchError } = await supabase
    .from('skill_categories')
    .select('id')
    .eq('profile_id', profileId);

  assertNoError(categoryFetchError, 'Fetching existing skill categories failed');

  const categoryIds = (existingCategories || []).map((item) => item.id);
  if (categoryIds.length > 0) {
    const { error: skillDeleteError } = await supabase.from('skills').delete().in('category_id', categoryIds);
    assertNoError(skillDeleteError, 'Deleting existing skills failed');

    const { error: categoryDeleteError } = await supabase
      .from('skill_categories')
      .delete()
      .eq('profile_id', profileId);
    assertNoError(categoryDeleteError, 'Deleting existing skill categories failed');
  }

  const { error: socialInsertError } = await supabase.from('profile_social_links').insert(
    socialLinks.map((link) => ({
      profile_id: profileId,
      ...link
    }))
  );
  assertNoError(socialInsertError, 'Inserting social links failed');

  const { data: insertedExperiences, error: experienceInsertError } = await supabase
    .from('experiences')
    .insert(
      experiences.map(({ highlights, key, ...experience }) => ({
        profile_id: profileId,
        ...experience
      }))
    )
    .select('id, company');

  assertNoError(experienceInsertError, 'Inserting experiences failed');

  const experienceIdByCompany = new Map((insertedExperiences || []).map((item) => [item.company, item.id]));

  const highlightRows = experiences.flatMap((experience) =>
    experience.highlights.map((highlight, index) => ({
      experience_id: experienceIdByCompany.get(experience.company),
      highlight,
      sort_order: index + 1
    }))
  );

  const { error: highlightInsertError } = await supabase.from('experience_highlights').insert(highlightRows);
  assertNoError(highlightInsertError, 'Inserting experience highlights failed');

  const { error: projectInsertError } = await supabase.from('projects').insert(
    projects.map((project) => ({
      profile_id: profileId,
      ...project
    }))
  );
  assertNoError(projectInsertError, 'Inserting projects failed');

  const { data: insertedCategories, error: categoryInsertError } = await supabase
    .from('skill_categories')
    .insert(
      skillCategories.map(([name], index) => ({
        profile_id: profileId,
        name,
        sort_order: index + 1
      }))
    )
    .select('id, name');

  assertNoError(categoryInsertError, 'Inserting skill categories failed');

  const categoryIdByName = new Map((insertedCategories || []).map((item) => [item.name, item.id]));

  const skillRows = skillCategories.flatMap(([categoryName, skills]) =>
    skills.map((name, index) => ({
      category_id: categoryIdByName.get(categoryName),
      name,
      sort_order: index + 1
    }))
  );

  const { error: skillInsertError } = await supabase.from('skills').insert(skillRows);
  assertNoError(skillInsertError, 'Inserting skills failed');

  const { error: educationInsertError } = await supabase.from('education').insert(
    education.map((item) => ({
      profile_id: profileId,
      ...item
    }))
  );
  assertNoError(educationInsertError, 'Inserting education failed');

  const { error: achievementInsertError } = await supabase.from('achievements').insert(
    achievements.map((item) => ({
      profile_id: profileId,
      ...item
    }))
  );
  assertNoError(achievementInsertError, 'Inserting achievements failed');

  console.log(`Supabase portfolio sync completed for profile slug "${profileSlug}".`);
};

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
