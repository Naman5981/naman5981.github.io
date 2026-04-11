do $$
declare
  profile_uuid uuid;
  xebia_uuid uuid;
  infosys_uuid uuid;
  tech_mahindra_uuid uuid;
  fograph_uuid uuid;
  core_languages_category_uuid uuid;
  backend_frameworks_category_uuid uuid;
  api_integration_category_uuid uuid;
  databases_category_uuid uuid;
  devops_cicd_category_uuid uuid;
  cloud_category_uuid uuid;
  observability_category_uuid uuid;
  methodologies_category_uuid uuid;
  developer_tools_category_uuid uuid;
begin
  insert into public.profiles (
    slug,
    full_name,
    headline,
    bio,
    location,
    email,
    phone,
    years_experience_label,
    issues_solved_target,
    core_domains_count,
    backend_focus_label,
    profile_image_path,
    resume_path
  )
  values (
    'naman-sanadhya',
    'Naman Sanadhya',
    'Java Backend Developer',
    E'I build reliable backend systems for banking and transaction-heavy platforms.\nOver the last 5+ years, I''ve worked across Spring Boot microservices, API design, transaction safety, production debugging, and modular service architecture.',
    'Jaipur, Rajasthan',
    'namansanadhya@gmail.com',
    '+91 76651 55815',
    '5+',
    110,
    3,
    '100%',
    '/profile.jpg',
    '/Naman_Sanadhya_Resume.pdf'
  )
  on conflict (slug) do update
  set
    full_name = excluded.full_name,
    headline = excluded.headline,
    bio = excluded.bio,
    location = excluded.location,
    email = excluded.email,
    phone = excluded.phone,
    years_experience_label = excluded.years_experience_label,
    issues_solved_target = excluded.issues_solved_target,
    core_domains_count = excluded.core_domains_count,
    backend_focus_label = excluded.backend_focus_label,
    profile_image_path = excluded.profile_image_path,
    resume_path = excluded.resume_path
  returning id into profile_uuid;

  delete from public.profile_social_links where profile_id = profile_uuid;
  delete from public.experience_highlights where experience_id in (
    select id from public.experiences where profile_id = profile_uuid
  );
  delete from public.experiences where profile_id = profile_uuid;
  delete from public.projects where profile_id = profile_uuid;
  delete from public.skills where category_id in (
    select id from public.skill_categories where profile_id = profile_uuid
  );
  delete from public.skill_categories where profile_id = profile_uuid;
  delete from public.education where profile_id = profile_uuid;
  delete from public.achievements where profile_id = profile_uuid;

  insert into public.profile_social_links (profile_id, platform, label, url, sort_order)
  values
    (profile_uuid, 'github', 'GitHub', 'https://github.com/naman5981', 1),
    (profile_uuid, 'linkedin', 'LinkedIn', 'https://linkedin.com/in/namansanadhya', 2);

  insert into public.experiences (
    profile_id, company, website, logo_path, logo_alt, location, start_date, end_date,
    duration_label, designation, summary, sort_order
  )
  values (
    profile_uuid,
    'Xebia (AU Small Finance Bank)',
    'https://www.xebia.com',
    '/logos/xebia.svg',
    'Xebia logo',
    'Jaipur, RJ',
    date '2026-01-01',
    null,
    'Jan 2026 - Present',
    'Java Developer',
    'Building production-grade banking microservices at AU Small Finance Bank through Xebia, focused on scalable service design, transaction/reporting workflows, secure APIs, and release reliability.',
    1
  )
  returning id into xebia_uuid;

  insert into public.experience_highlights (experience_id, highlight, sort_order)
  values
    (xebia_uuid, 'Delivered 5+ production features across transaction and reporting modules using Java 17 and Spring Boot 3, reducing latency by 30%.', 1),
    (xebia_uuid, 'Designed scalable secure microservices with OpenAPI and Spring Security, sustaining zero critical deployment failures across releases.', 2),
    (xebia_uuid, 'Resolved 10+ production-critical defects and SLA-breach incidents, reducing operational escalations by roughly 40%.', 3),
    (xebia_uuid, 'Mentored 3+ junior engineers on SOLID principles, clean architecture, and TDD, helping reduce post-release defects by 20%.', 4);

  insert into public.experiences (
    profile_id, company, website, logo_path, logo_alt, location, start_date, end_date,
    duration_label, designation, summary, sort_order
  )
  values (
    profile_uuid,
    'Infosys Limited',
    'https://www.infosys.com',
    '/logos/infosys.svg',
    'Infosys logo',
    'Jaipur, RJ',
    date '2022-05-01',
    date '2026-01-01',
    'May 2022 - Jan 2026',
    'Java Backend Developer',
    'Built and optimized Java/Spring Boot backend systems for BFSI platforms at Infosys, with a focus on performance tuning, secure API design, production incident resolution, and stable release delivery.',
    2
  )
  returning id into infosys_uuid;

  insert into public.experience_highlights (experience_id, highlight, sort_order)
  values
    (infosys_uuid, 'Optimized 8+ Spring Boot microservices with Redis-backed caching, reducing API latency by 40%.', 1),
    (infosys_uuid, 'Designed REST APIs for BFSI workflows with OAuth2, JWT, validation, idempotency, and robust exception handling.', 2),
    (infosys_uuid, 'Resolved 25+ critical production incidents using log analysis and cross-service tracing, cutting recurring incident rates by 35%.', 3),
    (infosys_uuid, 'Improved transaction safety with stronger JPA boundaries, isolation handling, and database consistency protections.', 4),
    (infosys_uuid, 'Supported 10+ production releases through Jenkins and GitLab CI, improving delivery stability with Dockerized deployments.', 5);

  insert into public.experiences (
    profile_id, company, website, logo_path, logo_alt, location, start_date, end_date,
    duration_label, designation, summary, sort_order
  )
  values (
    profile_uuid,
    'Tech Mahindra',
    'https://www.techmahindra.com',
    '/logos/tech-mahindra.svg',
    'Tech Mahindra logo',
    'Mumbai, MH',
    date '2021-01-01',
    date '2022-04-01',
    'Jan 2021 - Apr 2022',
    'Associate Software Engineer',
    'Supported high-traffic backend systems at Tech Mahindra, improving reliability, response time, and test confidence for large-scale live-event workloads.',
    3
  )
  returning id into tech_mahindra_uuid;

  insert into public.experience_highlights (experience_id, highlight, sort_order)
  values
    (tech_mahindra_uuid, 'Engineered backend services supporting 1M+ concurrent users during BCCI and IPL live events.', 1),
    (tech_mahindra_uuid, 'Implemented throttling, circuit breakers, and load-balancing improvements that helped sustain 99.9% uptime.', 2),
    (tech_mahindra_uuid, 'Improved API response times by 15% through query and request-path optimization.', 3),
    (tech_mahindra_uuid, 'Reduced production defects by 25% through stronger JUnit and Mockito coverage.', 4);

  insert into public.experiences (
    profile_id, company, website, logo_path, logo_alt, location, start_date, end_date,
    duration_label, designation, summary, sort_order
  )
  values (
    profile_uuid,
    'FoGraph',
    null,
    null,
    null,
    'Udaipur, RJ',
    date '2019-11-01',
    date '2020-12-01',
    'Nov 2019 - Dec 2020',
    'Android Developer (Co-founder)',
    'Co-founded and built Android product experiences at FoGraph, owning Java-based app development, Firebase-backed data flows, and mobile stability improvements.',
    4
  )
  returning id into fograph_uuid;

  insert into public.experience_highlights (experience_id, highlight, sort_order)
  values
    (fograph_uuid, 'Built Android experiences in Java while owning end-to-end product delivery as a co-founder.', 1),
    (fograph_uuid, 'Used Firebase Firestore and SQLite for offline-aware data handling and synchronization.', 2),
    (fograph_uuid, 'Improved application stability through Firebase Crashlytics monitoring and iterative fixes.', 3),
    (fograph_uuid, 'Drove feature delivery across design, development, release, and early product feedback loops.', 4);

  insert into public.projects (profile_id, slug, title, repo_url, live_url, description, featured, sort_order)
  values
    (profile_uuid, 'employee-performance-tracker', 'Employee Performance Tracker', 'https://github.com/Naman5981/Employee_Performance_Tracker', null, 'Built an employee performance tracking system with Spring Boot and PostgreSQL, exposing REST APIs for onboarding, review submission, review history retrieval, and cycle-level summary reporting.', true, 1),
    (profile_uuid, 'virtual-account-management', 'Virtual Account Management', null, null, 'Designed a virtual account service for merchant-based payment collection, defining REST API contracts, enforcing Spring Security controls, and handling concurrent payee transactions with transactional integrity.', true, 2),
    (profile_uuid, 'springcore-banking', 'SpringCore Banking', null, null, 'Built core banking account management and fund transfer features with RBAC, transaction consistency under concurrent load, 90%+ unit test coverage, and Docker-based delivery.', true, 3),
    (profile_uuid, 'officinal', 'Officinal', null, null, 'Built a multilingual Android healthcare application with Dialogflow-based voice symptom input and dynamic verified content delivered through Firebase Firestore.', true, 4),
    (profile_uuid, 'daimaa', 'Daimaa', null, null, 'Developed an Android pregnancy nutrition app in Java with a Firebase backend and a voice-based chatbot integrated with Google Assistant.', true, 5);

  insert into public.skill_categories (profile_id, name, sort_order)
  values
    (profile_uuid, 'Core Languages', 1),
    (profile_uuid, 'Backend Frameworks', 2),
    (profile_uuid, 'API & Integration', 3),
    (profile_uuid, 'Databases', 4),
    (profile_uuid, 'DevOps & CI/CD', 5),
    (profile_uuid, 'Cloud Platforms', 6),
    (profile_uuid, 'Observability', 7),
    (profile_uuid, 'Methodologies', 8),
    (profile_uuid, 'Developer Tools', 9);

  select id into core_languages_category_uuid from public.skill_categories where profile_id = profile_uuid and name = 'Core Languages';
  select id into backend_frameworks_category_uuid from public.skill_categories where profile_id = profile_uuid and name = 'Backend Frameworks';
  select id into api_integration_category_uuid from public.skill_categories where profile_id = profile_uuid and name = 'API & Integration';
  select id into databases_category_uuid from public.skill_categories where profile_id = profile_uuid and name = 'Databases';
  select id into devops_cicd_category_uuid from public.skill_categories where profile_id = profile_uuid and name = 'DevOps & CI/CD';
  select id into cloud_category_uuid from public.skill_categories where profile_id = profile_uuid and name = 'Cloud Platforms';
  select id into observability_category_uuid from public.skill_categories where profile_id = profile_uuid and name = 'Observability';
  select id into methodologies_category_uuid from public.skill_categories where profile_id = profile_uuid and name = 'Methodologies';
  select id into developer_tools_category_uuid from public.skill_categories where profile_id = profile_uuid and name = 'Developer Tools';

  insert into public.skills (category_id, name, sort_order)
  values
    (core_languages_category_uuid, 'Java (8, 11, 17)', 1),
    (core_languages_category_uuid, 'Shell Scripting', 2),
    (backend_frameworks_category_uuid, 'Spring Boot 3', 1),
    (backend_frameworks_category_uuid, 'Spring MVC', 2),
    (backend_frameworks_category_uuid, 'Spring Security', 3),
    (backend_frameworks_category_uuid, 'Hibernate', 4),
    (backend_frameworks_category_uuid, 'JPA', 5),
    (backend_frameworks_category_uuid, 'Microservices Architecture', 6),
    (backend_frameworks_category_uuid, 'JUnit', 7),
    (backend_frameworks_category_uuid, 'Mockito', 8),
    (api_integration_category_uuid, 'REST API Design', 1),
    (api_integration_category_uuid, 'OpenAPI', 2),
    (api_integration_category_uuid, 'Swagger', 3),
    (api_integration_category_uuid, 'OAuth2', 4),
    (api_integration_category_uuid, 'JWT', 5),
    (api_integration_category_uuid, 'gRPC (familiar)', 6),
    (databases_category_uuid, 'MySQL', 1),
    (databases_category_uuid, 'PostgreSQL', 2),
    (databases_category_uuid, 'Redis (caching)', 3),
    (databases_category_uuid, 'Firebase Firestore', 4),
    (devops_cicd_category_uuid, 'Jenkins', 1),
    (devops_cicd_category_uuid, 'GitLab CI', 2),
    (devops_cicd_category_uuid, 'GitHub Actions', 3),
    (devops_cicd_category_uuid, 'Docker', 4),
    (devops_cicd_category_uuid, 'Maven', 5),
    (cloud_category_uuid, 'AWS (EC2, S3, RDS)', 1),
    (cloud_category_uuid, 'GCP', 2),
    (observability_category_uuid, 'SLF4J', 1),
    (observability_category_uuid, 'Logback', 2),
    (observability_category_uuid, 'Distributed Tracing', 3),
    (observability_category_uuid, 'Firebase Crashlytics', 4),
    (methodologies_category_uuid, 'Agile/Scrum', 1),
    (methodologies_category_uuid, 'SOLID Principles', 2),
    (methodologies_category_uuid, 'Clean Architecture', 3),
    (methodologies_category_uuid, 'TDD', 4),
    (methodologies_category_uuid, 'Circuit Breaker', 5),
    (methodologies_category_uuid, 'Design Patterns', 6),
    (developer_tools_category_uuid, 'IntelliJ IDEA', 1),
    (developer_tools_category_uuid, 'Postman', 2),
    (developer_tools_category_uuid, 'Swagger UI', 3),
    (developer_tools_category_uuid, 'GitHub Copilot', 4),
    (developer_tools_category_uuid, 'Cursor', 5),
    (developer_tools_category_uuid, 'Bruno', 6);

  insert into public.education (profile_id, degree, institution, graduation_year, duration_label, sort_order)
  values
    (profile_uuid, 'B.Tech in Computer Science', 'Geetanjali Institute of Technical Studies, Udaipur', 2020, '2020', 1),
    (profile_uuid, 'CBSE Class XII', 'Alok Senior Secondary School, Udaipur', 2016, '2016', 2);

  insert into public.achievements (profile_id, title, awarder, award_year, description, raw_text, sort_order)
  values
    (profile_uuid, 'Winner', 'KPIT Innovation Award, Smart India Hackathon', 2018, null, 'Winner - KPIT Innovation Award, Smart India Hackathon 2018', 1),
    (profile_uuid, 'State-Level Finalist', 'Student Start-up Exposure Program, Rajasthan', null, null, 'State-Level Finalist - Student Start-up Exposure Program, Rajasthan', 2),
    (profile_uuid, '2nd Runner-up', 'Smart India Hackathon', 2019, null, '2nd Runner-up - Smart India Hackathon 2019', 3);
end
$$;
