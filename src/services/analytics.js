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
      resumeDownloads: 0,
      recentExploration: [],
      weeklyTopProject: null,
      resumeFollowThrough: 0
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
  const topSections = rows
    .filter((row) => row.event_type === 'section_view')
    .sort(sortByViews)
    .slice(0, 4);
  const topProjects = rows
    .filter((row) => row.event_type === 'project_view')
    .sort(sortByViews)
    .slice(0, 4);
  const resumeDownloads = rows
    .filter((row) => row.event_type === 'resume_download')
    .reduce((total, row) => total + Number(row.total_events ?? 0), 0);

  let recentExploration = [];
  let weeklyTopProject = topProjects[0] ?? null;
  let resumeFollowThrough = 0;

  try {
    const { data: recentEvents, error: recentEventsError } = await client
      .from('portfolio_events')
      .select('event_type, target_key, target_label, session_id, created_at')
      .eq('profile_slug', PROFILE_SLUG)
      .order('created_at', { ascending: false })
      .limit(500);

    if (recentEventsError) {
      throw recentEventsError;
    }

    const events = recentEvents ?? [];
    const recentLookup = new Map();

    events.forEach((event) => {
      if (!['section_view', 'project_view'].includes(event.event_type)) {
        return;
      }

      const lookupKey = `${event.event_type}:${event.target_key}`;

      if (!recentLookup.has(lookupKey)) {
        recentLookup.set(lookupKey, {
          type: event.event_type,
          label: event.target_label,
          createdAt: event.created_at
        });
      }
    });

    recentExploration = Array.from(recentLookup.values()).slice(0, 4);

    const weekStart = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const weeklyProjectCounts = new Map();

    events.forEach((event) => {
      if (
        event.event_type !== 'project_view' ||
        !event.created_at ||
        new Date(event.created_at).getTime() < weekStart
      ) {
        return;
      }

      const current = weeklyProjectCounts.get(event.target_key) ?? {
        target_key: event.target_key,
        target_label: event.target_label,
        total_events: 0
      };

      current.total_events += 1;
      weeklyProjectCounts.set(event.target_key, current);
    });

    const weeklyProjects = Array.from(weeklyProjectCounts.values()).sort(sortByViews);
    if (weeklyProjects.length > 0) {
      weeklyTopProject = weeklyProjects[0];
    }

    const sessionEvents = new Map();

    events
      .slice()
      .sort((left, right) => new Date(left.created_at).getTime() - new Date(right.created_at).getTime())
      .forEach((event) => {
        if (!event.session_id) {
          return;
        }

        const current = sessionEvents.get(event.session_id) ?? [];
        current.push(event);
        sessionEvents.set(event.session_id, current);
      });

    sessionEvents.forEach((sessionRows) => {
      let sawProjectView = false;

      sessionRows.forEach((event) => {
        if (event.event_type === 'project_view') {
          sawProjectView = true;
        }

        if (sawProjectView && event.event_type === 'resume_download') {
          resumeFollowThrough += 1;
          sawProjectView = false;
        }
      });
    });
  } catch (recentError) {
    console.error('Failed to derive contextual analytics signals.', recentError);
  }

  return {
    topSections,
    topProjects,
    resumeDownloads,
    recentExploration,
    weeklyTopProject,
    resumeFollowThrough
  };
};
