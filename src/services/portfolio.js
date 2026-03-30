import { getSupabaseClient, hasSupabaseEnv } from '../lib/supabase';

const PROFILE_SLUG = process.env.REACT_APP_PROFILE_SLUG ?? 'naman-sanadhya';

const fallbackProfile = {
  id: 'fallback-profile',
  fullName: 'Naman Sanadhya',
  headline: 'Java Backend Developer',
  bio: 'I build scalable backend systems for banking and transaction-heavy platforms. Over 5+ years, I have worked across Spring Boot microservices, API design, transaction safety, production debugging, and modular service architecture.',
  location: 'Jaipur, Rajasthan',
  email: 'namansanadhya@gmail.com',
  phone: '+91 76651 55815',
  yearsExperienceLabel: '5+',
  issuesSolvedTarget: 30,
  coreDomainsCount: 3,
  backendFocusLabel: '100%',
  profileImagePath: '/profile.jpg',
  resumePath: '/Naman_Sanadhya_Resume.pdf',
  socialLinks: [
    {
      platform: 'github',
      label: 'GitHub',
      url: 'https://github.com/naman5981',
      sort_order: 1
    },
    {
      platform: 'linkedin',
      label: 'LinkedIn',
      url: 'https://linkedin.com/in/namansanadhya',
      sort_order: 2
    }
  ]
};

const fallbackExperiences = [
  {
    company: 'Xebia (AU Small Finance Bank)',
    website: 'https://www.xebia.com',
    logo: '/logos/xebia.svg',
    logoAlt: 'Xebia logo',
    location: 'Jaipur, RJ',
    duration: 'Jan 2026 - Present',
    designation: 'Java Developer',
    summary:
      'Owned backend delivery for banking workflows, combining microservice design, merchant payment flows, feature rollout, and production issue resolution in a high-reliability environment.',
    description: [
      'Led backend development of Spring Boot microservices for banking workflows, ensuring scalability, fault tolerance, and clear service boundaries.',
      'Delivered 5+ production features across transaction and reporting systems, improving workflow efficiency.',
      'Designed and built a virtual account system enabling merchants to collect payments, handling transaction mapping, validation, and high-volume processing.',
      'Resolved 10+ critical production issues through root-cause analysis, improving system reliability.',
      'Enforced validation, error handling, and modular architecture across services.'
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
      'Improved the performance and reliability of high-volume backend systems through API design, service optimization, production debugging, and close collaboration with QA and DevOps.',
    description: [
      'Optimized Spring Boot microservices, improving API latency by 40% through efficient service logic.',
      'Designed REST APIs for high-volume transaction and reporting systems, ensuring performance, validation, and data consistency.',
      'Resolved 25+ production incidents via debugging, log analysis, and permanent fixes.',
      'Strengthened transaction workflows by handling edge cases and improving data consistency.',
      'Partnered with QA and DevOps to support CI/CD pipelines, ensuring smooth releases and production stability.'
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
      'Supported large-scale, high-traffic backend platforms by tuning performance, reducing defects, and improving responsiveness during peak operational demand.',
    description: [
      'Supported backend systems for high-traffic BCCI/IPL platforms during peak loads.',
      'Improved API response time by 15% through request optimization and processing improvements.',
      'Reduced defects by 25% via improved validation and debugging practices.',
      'Identified performance bottlenecks and implemented fixes to enhance system responsiveness.'
    ]
  },
  {
    company: 'FoGraph',
    website: null,
    logo: null,
    logoAlt: null,
    location: 'Udaipur, RJ',
    duration: 'Nov 2019 - Oct 2020',
    designation: 'Android Developer (Co-founder)',
    summary:
      'Led product and Android development across feature delivery, user experience improvements, offline synchronization, and application stability as a co-founder.',
    description: [
      'Led product development and technical direction, driving feature delivery across releases.',
      'Built Android features improving UI flow, navigation, and overall user experience.',
      'Designed offline-first data layer using Firebase and SQLite for reliable synchronization.',
      'Reduced crashes by analyzing Crashlytics logs and fixing recurring stability issues.'
    ]
  }
];

const fallbackProjects = [
  {
    slug: 'employee-performance-tracker',
    title: 'Employee Performance Tracker',
    href: 'https://github.com/Naman5981/Employee_Performance_Tracker',
    description:
      'Built an employee performance tracker for managing staff records, capturing performance metrics, and reviewing summary workflows in a lightweight management interface.'
  },
  {
    slug: 'virtual-account-management',
    title: 'Virtual Account Management',
    href: null,
    description:
      'Designed a scalable microservice for merchant-driven virtual accounts, enabling secure payment collection with validation and transaction consistency.'
  },
  {
    slug: 'springcore-banking',
    title: 'SpringCore Banking',
    href: null,
    description:
      'Developed a banking system with RBAC, transaction safety, and modular architecture for scalable and consistent operations.'
  },
  {
    slug: 'officinal',
    title: 'Officinal',
    href: null,
    description:
      'Built a healthcare app with Dialogflow chatbot and Google Assistant integration for voice-based interaction and real-time updates.'
  },
  {
    slug: 'daimaa',
    title: 'Daimaa',
    href: null,
    description:
      'Developed a nutrition guidance app with chatbot integration and structured data models for scalable content delivery.'
  }
];

const fallbackSkillCategories = [
  { category: 'Backend', skills: ['Spring Boot', 'Microservices', 'Hibernate', 'JUnit'] },
  { category: 'Architecture', skills: ['Distributed Systems', 'Transaction Management', 'API Design'] },
  { category: 'Languages', skills: ['Java', 'JavaScript', 'C++', 'Shell'] },
  { category: 'Databases', skills: ['MySQL', 'PostgreSQL', 'Firebase'] },
  { category: 'API & Tools', skills: ['REST APIs', 'Postman', 'Swagger'] },
  { category: 'DevOps & Cloud', skills: ['GitHub', 'GitLab', 'Maven', 'Jenkins', 'CI/CD', 'AWS', 'GCP'] },
  { category: 'Automation', skills: ['ChatGPT', 'n8n', 'Claude'] }
];

const fallbackEducation = [
  {
    degree: 'B.Tech in Computer Science',
    institution: 'Geetanjali Institute of Technical Studies, Udaipur',
    duration: '2020'
  },
  {
    degree: 'CBSE (XII)',
    institution: 'Alok Senior Secondary School, Udaipur',
    duration: '2016'
  }
];

const fallbackAchievements = [
  'Winner - KPIT Innovation Award, Smart India Hackathon 2018',
  'Finalist - Student Start-up Exposure Program, Rajasthan',
  '2nd Runner-up - Smart India Hackathon 2019'
];

const logFallback = (scope, error) => {
  if (error) {
    console.warn(`Using fallback ${scope} data.`, error);
  } else {
    console.warn(`Using fallback ${scope} data because Supabase is not configured.`);
  }
};

const getClient = () => {
  const client = getSupabaseClient();

  if (!hasSupabaseEnv || !client) {
    throw new Error('Supabase environment variables are not configured.');
  }

  return client;
};

export const getProfile = async () => {
  if (!hasSupabaseEnv) {
    logFallback('profile');
    return fallbackProfile;
  }

  try {
    const supabase = getClient();

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('slug', PROFILE_SLUG)
      .single();

    if (error) {
      throw error;
    }

    const { data: socialLinks, error: socialError } = await supabase
      .from('profile_social_links')
      .select('platform, label, url, sort_order')
      .eq('profile_id', data.id)
      .order('sort_order', { ascending: true });

    if (socialError) {
      throw socialError;
    }

    return {
      id: data.id,
      fullName: data.full_name,
      headline: data.headline,
      bio: data.bio,
      location: data.location,
      email: data.email,
      phone: data.phone,
      yearsExperienceLabel: data.years_experience_label,
      issuesSolvedTarget: data.issues_solved_target,
      coreDomainsCount: data.core_domains_count,
      backendFocusLabel: data.backend_focus_label,
      profileImagePath: data.profile_image_path,
      resumePath: data.resume_path,
      socialLinks: socialLinks ?? []
    };
  } catch (error) {
    logFallback('profile', error);
    return fallbackProfile;
  }
};

export const getExperiences = async () => {
  if (!hasSupabaseEnv) {
    logFallback('experience');
    return fallbackExperiences;
  }

  try {
    const supabase = getClient();

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('slug', PROFILE_SLUG)
      .single();

    if (profileError) {
      throw profileError;
    }

    const { data: experiences, error: experiencesError } = await supabase
      .from('experiences')
      .select('id, company, website, logo_path, logo_alt, location, duration_label, designation, summary, sort_order')
      .eq('profile_id', profile.id)
      .order('sort_order', { ascending: true });

    if (experiencesError) {
      throw experiencesError;
    }

    const experienceIds = (experiences ?? []).map((experience) => experience.id);
    let highlights = [];

    if (experienceIds.length > 0) {
      const { data: highlightRows, error: highlightsError } = await supabase
        .from('experience_highlights')
        .select('experience_id, highlight, sort_order')
        .in('experience_id', experienceIds)
        .order('sort_order', { ascending: true });

      if (highlightsError) {
        throw highlightsError;
      }

      highlights = highlightRows ?? [];
    }

    return (experiences ?? []).map((experience) => ({
      company: experience.company,
      website: experience.website,
      logo: experience.logo_path,
      logoAlt: experience.logo_alt,
      location: experience.location,
      duration: experience.duration_label,
      designation: experience.designation,
      summary: experience.summary,
      description: highlights
        .filter((highlight) => highlight.experience_id === experience.id)
        .sort((left, right) => left.sort_order - right.sort_order)
        .map((highlight) => highlight.highlight)
    }));
  } catch (error) {
    logFallback('experience', error);
    return fallbackExperiences;
  }
};

export const getProjects = async () => {
  if (!hasSupabaseEnv) {
    logFallback('project');
    return fallbackProjects;
  }

  try {
    const supabase = getClient();

    const { data, error } = await supabase
      .from('projects')
      .select('slug, title, repo_url, live_url, description, sort_order')
      .eq('featured', true)
      .order('sort_order', { ascending: true });

    if (error) {
      throw error;
    }

    return (data ?? []).map((project) => ({
      slug: project.slug,
      title: project.title,
      href: project.repo_url ?? project.live_url ?? null,
      description: project.description
    }));
  } catch (error) {
    logFallback('project', error);
    return fallbackProjects;
  }
};

export const getSkillCategories = async () => {
  if (!hasSupabaseEnv) {
    logFallback('skills');
    return fallbackSkillCategories;
  }

  try {
    const supabase = getClient();

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('slug', PROFILE_SLUG)
      .single();

    if (profileError) {
      throw profileError;
    }

    const { data: categories, error: categoriesError } = await supabase
      .from('skill_categories')
      .select('id, name, sort_order')
      .eq('profile_id', profile.id)
      .order('sort_order', { ascending: true });

    if (categoriesError) {
      throw categoriesError;
    }

    const categoryIds = (categories ?? []).map((category) => category.id);
    let skills = [];

    if (categoryIds.length > 0) {
      const { data: skillRows, error: skillsError } = await supabase
        .from('skills')
        .select('category_id, name, sort_order')
        .in('category_id', categoryIds)
        .order('sort_order', { ascending: true });

      if (skillsError) {
        throw skillsError;
      }

      skills = skillRows ?? [];
    }

    return (categories ?? []).map((category) => ({
      category: category.name,
      skills: skills
        .filter((skill) => skill.category_id === category.id)
        .sort((left, right) => left.sort_order - right.sort_order)
        .map((skill) => skill.name)
    }));
  } catch (error) {
    logFallback('skills', error);
    return fallbackSkillCategories;
  }
};

export const getEducation = async () => {
  if (!hasSupabaseEnv) {
    logFallback('education');
    return fallbackEducation;
  }

  try {
    const supabase = getClient();

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('slug', PROFILE_SLUG)
      .single();

    if (profileError) {
      throw profileError;
    }

    const { data, error } = await supabase
      .from('education')
      .select('degree, institution, duration_label, sort_order')
      .eq('profile_id', profile.id)
      .order('sort_order', { ascending: true });

    if (error) {
      throw error;
    }

    return (data ?? []).map((item) => ({
      degree: item.degree,
      institution: item.institution,
      duration: item.duration_label
    }));
  } catch (error) {
    logFallback('education', error);
    return fallbackEducation;
  }
};

export const getAchievements = async () => {
  if (!hasSupabaseEnv) {
    logFallback('achievements');
    return fallbackAchievements;
  }

  try {
    const supabase = getClient();

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('slug', PROFILE_SLUG)
      .single();

    if (profileError) {
      throw profileError;
    }

    const { data, error } = await supabase
      .from('achievements')
      .select('raw_text, sort_order')
      .eq('profile_id', profile.id)
      .order('sort_order', { ascending: true });

    if (error) {
      throw error;
    }

    return (data ?? []).map((achievement) => achievement.raw_text);
  } catch (error) {
    logFallback('achievements', error);
    return fallbackAchievements;
  }
};
