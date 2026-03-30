import { getSupabaseClient, hasSupabaseEnv } from '../lib/supabase';

const PROFILE_SLUG = process.env.REACT_APP_PROFILE_SLUG ?? 'naman-sanadhya';
const SESSION_STORAGE_KEY = 'portfolio-analytics-session-id';
const TRACKED_EVENT_PREFIX = 'portfolio-event';

const getClient = () => {
  if (!hasSupabaseEnv) {
    return null;
  }

  return getSupabaseClient();
};

const getSessionId = () => {
  if (typeof window === 'undefined') {
    return 'server';
  }

  const existingId = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (existingId) {
    return existingId;
  }

  const nextId =
    window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  window.sessionStorage.setItem(SESSION_STORAGE_KEY, nextId);
  return nextId;
};

const getTrackedEventKey = (eventType, targetKey) =>
  `${TRACKED_EVENT_PREFIX}:${PROFILE_SLUG}:${eventType}:${targetKey}`;

export const trackPortfolioEvent = async ({
  eventType,
  targetKey,
  targetLabel,
  source = 'website',
  metadata = {},
  oncePerSession = false
}) => {
  const client = getClient();

  if (!client || !eventType || !targetKey || !targetLabel) {
    return;
  }

  const trackedKey = getTrackedEventKey(eventType, targetKey);

  if (oncePerSession && typeof window !== 'undefined') {
    if (window.sessionStorage.getItem(trackedKey)) {
      return;
    }
  }

  try {
    const { error } = await client.from('portfolio_events').insert({
      profile_slug: PROFILE_SLUG,
      event_type: eventType,
      target_key: targetKey,
      target_label: targetLabel,
      source,
      session_id: getSessionId(),
      metadata
    });

    if (error) {
      throw error;
    }

    if (oncePerSession && typeof window !== 'undefined') {
      window.sessionStorage.setItem(trackedKey, '1');
    }
  } catch (error) {
    console.error(`Failed to track portfolio event: ${eventType}`, error);
  }
};

export const getAnalyticsSummary = async () => {
  const client = getClient();

  if (!client) {
    return {
      topSections: [],
      topProjects: [],
      resumeDownloads: 0
    };
  }

  const { data, error } = await client
    .from('portfolio_event_totals')
    .select('event_type, target_key, target_label, total_events, unique_sessions, last_seen_at')
    .eq('profile_slug', PROFILE_SLUG);

  if (error) {
    throw error;
  }

  const rows = data ?? [];
  const sortByViews = (left, right) => Number(right.total_events) - Number(left.total_events);

  return {
    topSections: rows
      .filter((row) => row.event_type === 'section_view')
      .sort(sortByViews)
      .slice(0, 4),
    topProjects: rows
      .filter((row) => row.event_type === 'project_view')
      .sort(sortByViews)
      .slice(0, 4),
    resumeDownloads: rows
      .filter((row) => row.event_type === 'resume_download')
      .reduce((total, row) => total + Number(row.total_events ?? 0), 0)
  };
};
