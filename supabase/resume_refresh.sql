do $$
declare
  profile_uuid uuid;
begin
  select id into profile_uuid
  from public.profiles
  where slug = 'naman-sanadhya';

  if profile_uuid is null then
    raise exception 'Profile with slug % not found', 'naman-sanadhya';
  end if;

  update public.profiles
  set
    full_name = 'Naman Sanadhya',
    headline = 'Java Backend Developer',
    bio = E'I build reliable backend systems for banking and transaction-heavy platforms.\nOver the last 5+ years, I''ve worked across Spring Boot microservices, API design, transaction safety, production debugging, and modular service architecture.',
    location = 'Jaipur, Rajasthan',
    email = 'namansanadhya@gmail.com',
    phone = '+91 76651 55815',
    years_experience_label = '5+',
    issues_solved_target = 110,
    core_domains_count = 3,
    backend_focus_label = '100%',
    profile_image_path = '/profile.jpg',
    resume_path = '/Naman_Sanadhya_Resume.pdf'
  where id = profile_uuid;

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
  values
    (
      profile_uuid, 'Xebia (AU Small Finance Bank)', 'https://www.xebia.com', '/logos/xebia.svg', 'Xebia logo',
      'Jaipur, RJ', date '2026-01-01', null, 'Jan 2026 - Present', 'Java Developer',
      'Building production-grade banking microservices at AU Small Finance Bank through Xebia, focused on scalable service design, transaction/reporting workflows, secure APIs, and release reliability.', 1
    ),
    (
      profile_uuid, 'Infosys Limited', 'https://www.infosys.com', '/logos/infosys.svg', 'Infosys logo',
      'Jaipur, RJ', date '2022-05-01', date '2026-01-01', 'May 2022 - Jan 2026', 'Java Backend Developer',
      'Built and optimized Java/Spring Boot backend systems for BFSI platforms at Infosys, with a focus on performance tuning, secure API design, production incident resolution, and stable release delivery.', 2
    ),
    (
      profile_uuid, 'Tech Mahindra', 'https://www.techmahindra.com', '/logos/tech-mahindra.svg', 'Tech Mahindra logo',
      'Mumbai, MH', date '2021-01-01', date '2022-04-01', 'Jan 2021 - Apr 2022', 'Associate Software Engineer',
      'Supported high-traffic backend systems at Tech Mahindra, improving reliability, response time, and test confidence for large-scale live-event workloads.', 3
    ),
    (
      profile_uuid, 'FoGraph', null, null, null,
      'Udaipur, RJ', date '2019-11-01', date '2020-12-01', 'Nov 2019 - Dec 2020', 'Android Developer (Co-founder)',
      'Co-founded and built Android product experiences at FoGraph, owning Java-based app development, Firebase-backed data flows, and mobile stability improvements.', 4
    );

  insert into public.experience_highlights (experience_id, highlight, sort_order)
  select id, highlight, sort_order
  from (
    values
      ((select id from public.experiences where profile_id = profile_uuid and company = 'Xebia (AU Small Finance Bank)'), 'Delivered 5+ production features across transaction and reporting modules using Java 17 and Spring Boot 3, reducing latency by 30%.', 1),
      ((select id from public.experiences where profile_id = profile_uuid and company = 'Xebia (AU Small Finance Bank)'), 'Designed scalable secure microservices with OpenAPI and Spring Security, sustaining zero critical deployment failures across releases.', 2),
      ((select id from public.experiences where profile_id = profile_uuid and company = 'Xebia (AU Small Finance Bank)'), 'Resolved 10+ production-critical defects and SLA-breach incidents, reducing operational escalations by roughly 40%.', 3),
      ((select id from public.experiences where profile_id = profile_uuid and company = 'Xebia (AU Small Finance Bank)'), 'Mentored 3+ junior engineers on SOLID principles, clean architecture, and TDD, helping reduce post-release defects by 20%.', 4),
      ((select id from public.experiences where profile_id = profile_uuid and company = 'Infosys Limited'), 'Optimized 8+ Spring Boot microservices with Redis-backed caching, reducing API latency by 40%.', 1),
      ((select id from public.experiences where profile_id = profile_uuid and company = 'Infosys Limited'), 'Designed REST APIs for BFSI workflows with OAuth2, JWT, validation, idempotency, and robust exception handling.', 2),
      ((select id from public.experiences where profile_id = profile_uuid and company = 'Infosys Limited'), 'Resolved 25+ critical production incidents using log analysis and cross-service tracing, cutting recurring incident rates by 35%.', 3),
      ((select id from public.experiences where profile_id = profile_uuid and company = 'Infosys Limited'), 'Improved transaction safety with stronger JPA boundaries, isolation handling, and database consistency protections.', 4),
      ((select id from public.experiences where profile_id = profile_uuid and company = 'Infosys Limited'), 'Supported 10+ production releases through Jenkins and GitLab CI, improving delivery stability with Dockerized deployments.', 5),
      ((select id from public.experiences where profile_id = profile_uuid and company = 'Tech Mahindra'), 'Engineered backend services supporting 1M+ concurrent users during BCCI and IPL live events.', 1),
      ((select id from public.experiences where profile_id = profile_uuid and company = 'Tech Mahindra'), 'Implemented throttling, circuit breakers, and load-balancing improvements that helped sustain 99.9% uptime.', 2),
      ((select id from public.experiences where profile_id = profile_uuid and company = 'Tech Mahindra'), 'Improved API response times by 15% through query and request-path optimization.', 3),
      ((select id from public.experiences where profile_id = profile_uuid and company = 'Tech Mahindra'), 'Reduced production defects by 25% through stronger JUnit and Mockito coverage.', 4),
      ((select id from public.experiences where profile_id = profile_uuid and company = 'FoGraph'), 'Built Android experiences in Java while owning end-to-end product delivery as a co-founder.', 1),
      ((select id from public.experiences where profile_id = profile_uuid and company = 'FoGraph'), 'Used Firebase Firestore and SQLite for offline-aware data handling and synchronization.', 2),
      ((select id from public.experiences where profile_id = profile_uuid and company = 'FoGraph'), 'Improved application stability through Firebase Crashlytics monitoring and iterative fixes.', 3),
      ((select id from public.experiences where profile_id = profile_uuid and company = 'FoGraph'), 'Drove feature delivery across design, development, release, and early product feedback loops.', 4)
  ) as rows(id, highlight, sort_order);

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

  insert into public.skills (category_id, name, sort_order)
  select category_id, name, sort_order
  from (
    values
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'Core Languages'), 'Java (8, 11, 17)', 1),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'Core Languages'), 'Shell Scripting', 2),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'Backend Frameworks'), 'Spring Boot 3', 1),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'Backend Frameworks'), 'Spring MVC', 2),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'Backend Frameworks'), 'Spring Security', 3),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'Backend Frameworks'), 'Hibernate', 4),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'Backend Frameworks'), 'JPA', 5),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'Backend Frameworks'), 'Microservices Architecture', 6),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'Backend Frameworks'), 'JUnit', 7),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'Backend Frameworks'), 'Mockito', 8),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'API & Integration'), 'REST API Design', 1),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'API & Integration'), 'OpenAPI', 2),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'API & Integration'), 'Swagger', 3),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'API & Integration'), 'OAuth2', 4),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'API & Integration'), 'JWT', 5),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'API & Integration'), 'gRPC (familiar)', 6),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'Databases'), 'MySQL', 1),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'Databases'), 'PostgreSQL', 2),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'Databases'), 'Redis (caching)', 3),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'Databases'), 'Firebase Firestore', 4),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'DevOps & CI/CD'), 'Jenkins', 1),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'DevOps & CI/CD'), 'GitLab CI', 2),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'DevOps & CI/CD'), 'GitHub Actions', 3),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'DevOps & CI/CD'), 'Docker', 4),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'DevOps & CI/CD'), 'Maven', 5),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'Cloud Platforms'), 'AWS (EC2, S3, RDS)', 1),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'Cloud Platforms'), 'GCP', 2),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'Observability'), 'SLF4J', 1),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'Observability'), 'Logback', 2),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'Observability'), 'Distributed Tracing', 3),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'Observability'), 'Firebase Crashlytics', 4),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'Methodologies'), 'Agile/Scrum', 1),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'Methodologies'), 'SOLID Principles', 2),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'Methodologies'), 'Clean Architecture', 3),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'Methodologies'), 'TDD', 4),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'Methodologies'), 'Circuit Breaker', 5),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'Methodologies'), 'Design Patterns', 6),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'Developer Tools'), 'IntelliJ IDEA', 1),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'Developer Tools'), 'Postman', 2),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'Developer Tools'), 'Swagger UI', 3),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'Developer Tools'), 'GitHub Copilot', 4),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'Developer Tools'), 'Cursor', 5),
      ((select id from public.skill_categories where profile_id = profile_uuid and name = 'Developer Tools'), 'Bruno', 6)
  ) as rows(category_id, name, sort_order);

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
