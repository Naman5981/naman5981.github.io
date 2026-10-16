import {
  computeRankedTotals,
  computeTotalSum,
  extractRecentExploration,
  calculateWeeklyTopProject,
  calculateResumeFollowThrough
} from './analytics';

describe('analytics service utilities', () => {
  describe('computeRankedTotals', () => {
    it('filters by event type and sorts in descending order of total events', () => {
      const rows = [
        { event_type: 'section_view', target_key: 'skills', total_events: '12' },
        { event_type: 'section_view', target_key: 'projects', total_events: '50' },
        { event_type: 'project_view', target_key: 'vam', total_events: '100' }
      ];

      const ranked = computeRankedTotals(rows, 'section_view', 2);
      expect(ranked).toHaveLength(2);
      expect(ranked[0].target_key).toBe('projects');
      expect(ranked[1].target_key).toBe('skills');
    });
  });

  describe('computeTotalSum', () => {
    it('sums total_events for a specific event type', () => {
      const rows = [
        { event_type: 'resume_download', total_events: 5 },
        { event_type: 'resume_download', total_events: 12 },
        { event_type: 'other_event', total_events: 99 }
      ];

      expect(computeTotalSum(rows, 'resume_download')).toBe(17);
    });

    it('returns 0 for empty or null rows', () => {
      expect(computeTotalSum([], 'resume_download')).toBe(0);
      expect(computeTotalSum(null, 'resume_download')).toBe(0);
    });
  });

  describe('extractRecentExploration', () => {
    it('deduplicates events by type and key preserving most recent', () => {
      const events = [
        { event_type: 'project_view', target_key: 'vam', target_label: 'VAM', created_at: '2026-03-30T10:00:00Z' },
        { event_type: 'project_view', target_key: 'vam', target_label: 'VAM', created_at: '2026-03-30T09:00:00Z' },
        { event_type: 'section_view', target_key: 'experience', target_label: 'Experience', created_at: '2026-03-30T08:00:00Z' }
      ];

      const recent = extractRecentExploration(events);
      expect(recent).toHaveLength(2);
      expect(recent[0].label).toBe('VAM');
      expect(recent[1].label).toBe('Experience');
    });
  });

  describe('calculateWeeklyTopProject', () => {
    it('identifies the most viewed project in the past 7 days', () => {
      const now = Date.now();
      const events = [
        { event_type: 'project_view', target_key: 'proj-1', target_label: 'Project 1', created_at: new Date(now - 1000).toISOString() },
        { event_type: 'project_view', target_key: 'proj-2', target_label: 'Project 2', created_at: new Date(now - 2000).toISOString() },
        { event_type: 'project_view', target_key: 'proj-2', target_label: 'Project 2', created_at: new Date(now - 3000).toISOString() },
        { event_type: 'project_view', target_key: 'old-proj', target_label: 'Old Project', created_at: new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString() }
      ];

      const top = calculateWeeklyTopProject(events);
      expect(top.target_key).toBe('proj-2');
      expect(top.total_events).toBe(2);
    });
  });

  describe('calculateResumeFollowThrough', () => {
    it('counts sessions where project_view was followed by resume_download', () => {
      const events = [
        { session_id: 's1', event_type: 'project_view', created_at: '2026-03-30T10:00:00Z' },
        { session_id: 's1', event_type: 'resume_download', created_at: '2026-03-30T10:05:00Z' },
        { session_id: 's2', event_type: 'resume_download', created_at: '2026-03-30T11:00:00Z' },
        { session_id: 's3', event_type: 'project_view', created_at: '2026-03-30T12:00:00Z' }
      ];

      const followThrough = calculateResumeFollowThrough(events);
      expect(followThrough).toBe(1);
    });
  });
});
