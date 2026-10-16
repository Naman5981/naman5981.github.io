import { getSupabaseClient, hasSupabaseEnv } from '../lib/supabase';

const PROFILE_SLUG = process.env.REACT_APP_PROFILE_SLUG ?? 'naman-sanadhya';
const SESSION_STORAGE_KEY = 'portfolio-analytics-session-id';
const TRACKED_EVENT_PREFIX = 'portfolio-event';
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const getClient = () => {
  if (!hasSupabaseEnv) {
    return null;
  }
  return getSupabaseClient();
};

const generateSessionId = () => {
  if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const getSessionId = () => {
  if (typeof window === 'undefined') {
    return 'server';
  }

  const existingId = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (existingId) {
    return existingId;
  }

  const nextId = generateSessionId();
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

const sortByTotalEvents = (left, right) => Number(right.total_events) - Number(left.total_events);

export const computeRankedTotals = (rows, eventType, limit = 4) => {
  return (rows || [])
    .filter((row) => row.event_type === eventType)
    .sort(sortByTotalEvents)
    .slice(0, limit);
};

export const computeTotalSum = (rows, eventType) => {
  return (rows || [])
    .filter((row) => row.event_type === eventType)
    .reduce((total, row) => total + Number(row.total_events ?? 0), 0);
};

export const extractRecentExploration = (events, limit = 4) => {
  const recentLookup = new Map();

  (events || []).forEach((event) => {
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

  return Array.from(recentLookup.values()).slice(0, limit);
};

export const calculateWeeklyTopProject = (events, fallbackTopProject = null) => {
  const weekStart = Date.now() - ONE_WEEK_MS;
  const projectCounts = new Map();

  (events || []).forEach((event) => {
    if (
      event.event_type !== 'project_view' ||
      !event.created_at ||
      new Date(event.created_at).getTime() < weekStart
    ) {
      return;
    }

    const current = projectCounts.get(event.target_key) ?? {
      target_key: event.target_key,
      target_label: event.target_label,
      total_events: 0
    };

    current.total_events += 1;
    projectCounts.set(event.target_key, current);
  });

  const sortedProjects = Array.from(projectCounts.values()).sort(sortByTotalEvents);
  return sortedProjects[0] ?? fallbackTopProject;
};

export const calculateResumeFollowThrough = (events) => {
  const sessionEvents = new Map();

  (events || [])
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

  let followThroughCount = 0;

  sessionEvents.forEach((sessionRows) => {
    let viewedProject = false;

    sessionRows.forEach((event) => {
      if (event.event_type === 'project_view') {
        viewedProject = true;
      }
      if (viewedProject && event.event_type === 'resume_download') {
        followThroughCount += 1;
        viewedProject = false;
      }
    });
  });

  return followThroughCount;
};

const createEmptyAnalyticsSummary = () => ({
  topSections: [],
  topProjects: [],
  resumeDownloads: 0,
  recentExploration: [],
  weeklyTopProject: null,
  resumeFollowThrough: 0
});

export const getAnalyticsSummary = async () => {
  const client = getClient();
  if (!client) {
    return createEmptyAnalyticsSummary();
  }

  const { data: totalsData, error: totalsError } = await client
    .from('portfolio_event_totals')
    .select('event_type, target_key, target_label, total_events, unique_sessions, last_seen_at')
    .eq('profile_slug', PROFILE_SLUG);

  if (totalsError) {
    throw totalsError;
  }

  const rows = totalsData ?? [];
  const topSections = computeRankedTotals(rows, 'section_view');
  const topProjects = computeRankedTotals(rows, 'project_view');
  const resumeDownloads = computeTotalSum(rows, 'resume_download');

  let recentExploration = [];
  let weeklyTopProject = topProjects[0] ?? null;
  let resumeFollowThrough = 0;

  try {
    const { data: recentEvents, error: recentError } = await client
      .from('portfolio_events')
      .select('event_type, target_key, target_label, session_id, created_at')
      .eq('profile_slug', PROFILE_SLUG)
      .order('created_at', { ascending: false })
      .limit(500);

    if (recentError) {
      throw recentError;
    }

    const events = recentEvents ?? [];
    recentExploration = extractRecentExploration(events);
    weeklyTopProject = calculateWeeklyTopProject(events, topProjects[0] ?? null);
    resumeFollowThrough = calculateResumeFollowThrough(events);
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
