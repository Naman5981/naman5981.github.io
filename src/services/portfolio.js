import { getSupabaseClient, hasSupabaseEnv } from '../lib/supabase';
import {
  fallbackProfile,
  fallbackExperiences,
  fallbackProjects,
  fallbackSkillCategories,
  fallbackEducation,
  fallbackAchievements
} from '../data/fallbackPortfolioData';

const PROFILE_SLUG = process.env.REACT_APP_PROFILE_SLUG ?? 'naman-sanadhya';
const queryCache = new Map();
const resolvedQueryCache = new Map();

const CACHE_PREFIX = 'portfolio_cache_v1_';

const getFromStorage = (key) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    const raw = window.localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.data ?? null;
  } catch (error) {
    return null;
  }
};

const saveToStorage = (key, data) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    window.localStorage.setItem(
      CACHE_PREFIX + key,
      JSON.stringify({
        data,
        timestamp: Date.now()
      })
    );
  } catch (error) {
    // Ignore storage quota/security errors
  }
};

const getResolvedCachedValue = (cacheKey) => {
  return resolvedQueryCache.get(cacheKey) ?? getFromStorage(cacheKey) ?? null;
};

const getClient = () => {
  const client = getSupabaseClient();

  if (!hasSupabaseEnv || !client) {
    throw new Error('Supabase environment variables are not configured.');
  }

  return client;
};

/**
 * Executes a query with:
 * 1. Immediate in-memory cache return
 * 2. Stored localStorage fallback if available
 * 3. Supabase network query with timeout
 * 4. Automatic fallback to static data if Supabase is offline/cold-starting
 */
const getCachedQueryWithFallback = async (cacheKey, loadFromSupabase, fallbackData) => {
  // 1. Check in-memory resolved cache
  if (resolvedQueryCache.has(cacheKey)) {
    return resolvedQueryCache.get(cacheKey);
  }

  // 2. Check in-flight promise
  if (queryCache.has(cacheKey)) {
    return queryCache.get(cacheKey);
  }

  // 3. Check persistent localStorage cache for instant availability
  const storedData = getFromStorage(cacheKey);

  const fetchWithTimeout = async () => {
    // Wrap Supabase load with a 4s timeout to prevent hanging on cold starts
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Supabase request timed out.')), 4000)
    );

    try {
      const freshData = await Promise.race([loadFromSupabase(), timeoutPromise]);
      if (freshData) {
        resolvedQueryCache.set(cacheKey, freshData);
        saveToStorage(cacheKey, freshData);
        return freshData;
      }
    } catch (error) {
      console.warn(`[Portfolio Service] Live fetch failed for "${cacheKey}", using cached/fallback data:`, error.message);
    }

    // If live fetch fails, prefer stored cache, then static fallback
    const resolvedFallback = storedData ?? fallbackData;
    resolvedQueryCache.set(cacheKey, resolvedFallback);
    return resolvedFallback;
  };

  const pending = fetchWithTimeout()
    .then((result) => {
      queryCache.set(cacheKey, Promise.resolve(result));
      return result;
    })
    .catch(() => {
      const resolvedFallback = storedData ?? fallbackData;
      resolvedQueryCache.set(cacheKey, resolvedFallback);
      return resolvedFallback;
    });

  queryCache.set(cacheKey, pending);
  return pending;
};

export const getProfile = async () => {
  return getCachedQueryWithFallback(
    `profile:${PROFILE_SLUG}`,
    async () => {
      const supabase = getClient();

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('slug', PROFILE_SLUG)
        .single();

      if (error || !data) {
        throw error || new Error('Profile not found');
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
        issuesSolvedTarget: data.issues_solved_target ?? 0,
        coreDomainsCount: data.core_domains_count,
        backendFocusLabel: data.backend_focus_label,
        profileImagePath: data.profile_image_path,
        resumePath: data.resume_path,
        socialLinks: socialLinks ?? []
      };
    },
    fallbackProfile
  );
};

export const getExperiences = async () => {
  return getCachedQueryWithFallback(
    `experiences:${PROFILE_SLUG}`,
    async () => {
      const supabase = getClient();

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('slug', PROFILE_SLUG)
        .single();

      if (profileError || !profile) {
        throw profileError || new Error('Profile not found');
      }

      const { data: experiences, error: experiencesError } = await supabase
        .from('experiences')
        .select('id, company, website, logo_path, logo_alt, location, duration_label, designation, summary, sort_order')
        .eq('profile_id', profile.id)
        .order('sort_order', { ascending: true });

      if (experiencesError || !experiences || experiences.length === 0) {
        throw experiencesError || new Error('No experiences found');
      }

      const experienceIds = experiences.map((experience) => experience.id);
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

      return experiences.map((experience) => ({
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
    },
    fallbackExperiences
  );
};

export const getProjects = async () => {
  return getCachedQueryWithFallback(
    `projects:${PROFILE_SLUG}`,
    async () => {
      const supabase = getClient();

      const { data, error } = await supabase
        .from('projects')
        .select('slug, title, repo_url, live_url, description, sort_order')
        .eq('featured', true)
        .order('sort_order', { ascending: true });

      if (error || !data || data.length === 0) {
        throw error || new Error('No projects found');
      }

      return data.map((project) => ({
        slug: project.slug,
        title: project.title,
        repoUrl: project.repo_url ?? null,
        liveUrl: project.live_url ?? null,
        href: project.repo_url ?? project.live_url ?? null,
        description: project.description
      }));
    },
    fallbackProjects
  );
};

export const getSkillCategories = async () => {
  return getCachedQueryWithFallback(
    `skills:${PROFILE_SLUG}`,
    async () => {
      const supabase = getClient();

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('slug', PROFILE_SLUG)
        .single();

      if (profileError || !profile) {
        throw profileError || new Error('Profile not found');
      }

      const { data: categories, error: categoriesError } = await supabase
        .from('skill_categories')
        .select('id, name, sort_order')
        .eq('profile_id', profile.id)
        .order('sort_order', { ascending: true });

      if (categoriesError || !categories || categories.length === 0) {
        throw categoriesError || new Error('No skill categories found');
      }

      const categoryIds = categories.map((category) => category.id);
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

      return categories.map((category) => ({
        category: category.name,
        skills: skills
          .filter((skill) => skill.category_id === category.id)
          .sort((left, right) => left.sort_order - right.sort_order)
          .map((skill) => skill.name)
      }));
    },
    fallbackSkillCategories
  );
};

export const getEducation = async () => {
  return getCachedQueryWithFallback(
    `education:${PROFILE_SLUG}`,
    async () => {
      const supabase = getClient();

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('slug', PROFILE_SLUG)
        .single();

      if (profileError || !profile) {
        throw profileError || new Error('Profile not found');
      }

      const { data, error } = await supabase
        .from('education')
        .select('degree, institution, duration_label, sort_order')
        .eq('profile_id', profile.id)
        .order('sort_order', { ascending: true });

      if (error || !data || data.length === 0) {
        throw error || new Error('No education found');
      }

      return data.map((item) => ({
        degree: item.degree,
        institution: item.institution,
        duration: item.duration_label
      }));
    },
    fallbackEducation
  );
};

export const getAchievements = async () => {
  return getCachedQueryWithFallback(
    `achievements:${PROFILE_SLUG}`,
    async () => {
      const supabase = getClient();

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('slug', PROFILE_SLUG)
        .single();

      if (profileError || !profile) {
        throw profileError || new Error('Profile not found');
      }

      const { data, error } = await supabase
        .from('achievements')
        .select('raw_text, sort_order')
        .eq('profile_id', profile.id)
        .order('sort_order', { ascending: true });

      if (error || !data || data.length === 0) {
        throw error || new Error('No achievements found');
      }

      return data.map((achievement) => achievement.raw_text);
    },
    fallbackAchievements
  );
};

export const getCachedAchievements = () => getResolvedCachedValue(`achievements:${PROFILE_SLUG}`);
