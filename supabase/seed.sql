do $$
declare
  profile_uuid uuid;
  xebia_uuid uuid;
  infosys_uuid uuid;
  tech_mahindra_uuid uuid;
  fograph_uuid uuid;
  backend_category_uuid uuid;
  architecture_category_uuid uuid;
  languages_category_uuid uuid;
  databases_category_uuid uuid;
  api_tools_category_uuid uuid;
  devops_category_uuid uuid;
  automation_category_uuid uuid;
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
    'I build scalable backend systems for banking and transaction-heavy platforms. Over 5+ years, I have worked across Spring Boot microservices, API design, transaction safety, production debugging, and modular service architecture.',
    'Jaipur, Rajasthan',
    'namansanadhya@gmail.com',
    '+91 76651 55815',
    '5+',
    30,
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
    'Owned backend delivery for banking workflows, combining microservice design, merchant payment flows, feature rollout, and production issue resolution in a high-reliability environment.',
    1
  )
  returning id into xebia_uuid;

  insert into public.experience_highlights (experience_id, highlight, sort_order)
  values
    (xebia_uuid, 'Led backend development of Spring Boot microservices for banking workflows, ensuring scalability, fault tolerance, and clear service boundaries.', 1),
    (xebia_uuid, 'Delivered 5+ production features across transaction and reporting systems, improving workflow efficiency.', 2),
    (xebia_uuid, 'Designed and built a virtual account system enabling merchants to collect payments, handling transaction mapping, validation, and high-volume processing.', 3),
    (xebia_uuid, 'Resolved 10+ critical production issues through root-cause analysis, improving system reliability.', 4),
    (xebia_uuid, 'Enforced validation, error handling, and modular architecture across services.', 5);

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
    'Improved the performance and reliability of high-volume backend systems through API design, service optimization, production debugging, and close collaboration with QA and DevOps.',
    2
  )
  returning id into infosys_uuid;

  insert into public.experience_highlights (experience_id, highlight, sort_order)
  values
    (infosys_uuid, 'Optimized Spring Boot microservices, improving API latency by 40% through efficient service logic.', 1),
    (infosys_uuid, 'Designed REST APIs for high-volume transaction and reporting systems, ensuring performance, validation, and data consistency.', 2),
    (infosys_uuid, 'Resolved 25+ production incidents via debugging, log analysis, and permanent fixes.', 3),
    (infosys_uuid, 'Strengthened transaction workflows by handling edge cases and improving data consistency.', 4),
    (infosys_uuid, 'Partnered with QA and DevOps to support CI/CD pipelines, ensuring smooth releases and production stability.', 5);

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
    'Supported large-scale, high-traffic backend platforms by tuning performance, reducing defects, and improving responsiveness during peak operational demand.',
    3
  )
  returning id into tech_mahindra_uuid;

  insert into public.experience_highlights (experience_id, highlight, sort_order)
  values
    (tech_mahindra_uuid, 'Supported backend systems for high-traffic BCCI/IPL platforms during peak loads.', 1),
    (tech_mahindra_uuid, 'Improved API response time by 15% through request optimization and processing improvements.', 2),
    (tech_mahindra_uuid, 'Reduced defects by 25% via improved validation and debugging practices.', 3),
    (tech_mahindra_uuid, 'Identified performance bottlenecks and implemented fixes to enhance system responsiveness.', 4);

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
    date '2020-10-01',
    'Nov 2019 - Oct 2020',
    'Android Developer (Co-founder)',
    'Led product and Android development across feature delivery, user experience improvements, offline synchronization, and application stability as a co-founder.',
    4
  )
  returning id into fograph_uuid;

  insert into public.experience_highlights (experience_id, highlight, sort_order)
  values
    (fograph_uuid, 'Led product development and technical direction, driving feature delivery across releases.', 1),
    (fograph_uuid, 'Built Android features improving UI flow, navigation, and overall user experience.', 2),
    (fograph_uuid, 'Designed offline-first data layer using Firebase and SQLite for reliable synchronization.', 3),
    (fograph_uuid, 'Reduced crashes by analyzing Crashlytics logs and fixing recurring stability issues.', 4);

  insert into public.projects (profile_id, slug, title, repo_url, live_url, description, featured, sort_order)
  values
    (profile_uuid, 'employee-performance-tracker', 'Employee Performance Tracker', 'https://github.com/Naman5981/Employee_Performance_Tracker', null, 'Built an employee performance tracker for managing staff records, capturing performance metrics, and reviewing summary workflows in a lightweight management interface.', true, 1),
    (profile_uuid, 'virtual-account-management', 'Virtual Account Management', null, null, 'Designed a scalable microservice for merchant-driven virtual accounts, enabling secure payment collection with validation and transaction consistency.', true, 2),
    (profile_uuid, 'springcore-banking', 'SpringCore Banking', null, null, 'Developed a banking system with RBAC, transaction safety, and modular architecture for scalable and consistent operations.', true, 3),
    (profile_uuid, 'officinal', 'Officinal', null, null, 'Built a healthcare app with Dialogflow chatbot and Google Assistant integration for voice-based interaction and real-time updates.', true, 4),
    (profile_uuid, 'daimaa', 'Daimaa', null, null, 'Developed a nutrition guidance app with chatbot integration and structured data models for scalable content delivery.', true, 5);

  insert into public.skill_categories (profile_id, name, sort_order)
  values
    (profile_uuid, 'Backend', 1),
    (profile_uuid, 'Architecture', 2),
    (profile_uuid, 'Languages', 3),
    (profile_uuid, 'Databases', 4),
    (profile_uuid, 'API & Tools', 5),
    (profile_uuid, 'DevOps & Cloud', 6),
    (profile_uuid, 'Automation', 7);

  select id into backend_category_uuid from public.skill_categories where profile_id = profile_uuid and name = 'Backend';
  select id into architecture_category_uuid from public.skill_categories where profile_id = profile_uuid and name = 'Architecture';
  select id into languages_category_uuid from public.skill_categories where profile_id = profile_uuid and name = 'Languages';
  select id into databases_category_uuid from public.skill_categories where profile_id = profile_uuid and name = 'Databases';
  select id into api_tools_category_uuid from public.skill_categories where profile_id = profile_uuid and name = 'API & Tools';
  select id into devops_category_uuid from public.skill_categories where profile_id = profile_uuid and name = 'DevOps & Cloud';
  select id into automation_category_uuid from public.skill_categories where profile_id = profile_uuid and name = 'Automation';

  insert into public.skills (category_id, name, sort_order)
  values
    (backend_category_uuid, 'Spring Boot', 1),
    (backend_category_uuid, 'Microservices', 2),
    (backend_category_uuid, 'Hibernate', 3),
    (backend_category_uuid, 'JUnit', 4),
    (architecture_category_uuid, 'Distributed Systems', 1),
    (architecture_category_uuid, 'Transaction Management', 2),
    (architecture_category_uuid, 'API Design', 3),
    (languages_category_uuid, 'Java', 1),
    (languages_category_uuid, 'JavaScript', 2),
    (languages_category_uuid, 'C++', 3),
    (languages_category_uuid, 'Shell', 4),
    (databases_category_uuid, 'MySQL', 1),
    (databases_category_uuid, 'PostgreSQL', 2),
    (databases_category_uuid, 'Firebase', 3),
    (api_tools_category_uuid, 'REST APIs', 1),
    (api_tools_category_uuid, 'Postman', 2),
    (api_tools_category_uuid, 'Swagger', 3),
    (devops_category_uuid, 'GitHub', 1),
    (devops_category_uuid, 'GitLab', 2),
    (devops_category_uuid, 'Maven', 3),
    (devops_category_uuid, 'Jenkins', 4),
    (devops_category_uuid, 'CI/CD', 5),
    (devops_category_uuid, 'AWS', 6),
    (devops_category_uuid, 'GCP', 7),
    (automation_category_uuid, 'ChatGPT', 1),
    (automation_category_uuid, 'n8n', 2),
    (automation_category_uuid, 'Claude', 3);

  insert into public.education (profile_id, degree, institution, graduation_year, duration_label, sort_order)
  values
    (profile_uuid, 'B.Tech in Computer Science', 'Geetanjali Institute of Technical Studies, Udaipur', 2020, '2020', 1),
    (profile_uuid, 'CBSE (XII)', 'Alok Senior Secondary School, Udaipur', 2016, '2016', 2);

  insert into public.achievements (profile_id, title, awarder, award_year, description, raw_text, sort_order)
  values
    (profile_uuid, 'Winner', 'KPIT Innovation Award, Smart India Hackathon', 2018, null, 'Winner - KPIT Innovation Award, Smart India Hackathon 2018', 1),
    (profile_uuid, 'Finalist', 'Student Start-up Exposure Program, Rajasthan', null, null, 'Finalist - Student Start-up Exposure Program, Rajasthan', 2),
    (profile_uuid, '2nd Runner-up', 'Smart India Hackathon', 2019, null, '2nd Runner-up - Smart India Hackathon 2019', 3);
end
$$;
