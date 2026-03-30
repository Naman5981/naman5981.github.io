import { getSupabaseClient, hasSupabaseEnv } from '../lib/supabase';

const PROFILE_SLUG = process.env.REACT_APP_PROFILE_SLUG ?? 'naman-sanadhya';

const getClient = () => {
  const client = getSupabaseClient();

  if (!hasSupabaseEnv || !client) {
    throw new Error('Supabase environment variables are not configured.');
  }

  return client;
};

export const getProfile = async () => {
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
};

export const getExperiences = async () => {
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
};

export const getProjects = async () => {
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
    repoUrl: project.repo_url ?? null,
    liveUrl: project.live_url ?? null,
    href: project.repo_url ?? project.live_url ?? null,
    description: project.description
  }));
};

export const getSkillCategories = async () => {
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
};

export const getEducation = async () => {
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
};

export const getAchievements = async () => {
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
};
