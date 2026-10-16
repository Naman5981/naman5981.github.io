import {
  normalizeText,
  buildSearchTokens,
  extractConcepts,
  getSmartSearchResults,
  synthesizeLocalSmartAnswer,
  getDynamicSmartSearchPrompts
} from './smartSearch';

describe('smartSearch library', () => {
  describe('normalizeText', () => {
    it('lowercases and strips special characters except allowed punctuation', () => {
      expect(normalizeText('Spring-Boot & Java 17!')).toBe('spring-boot java 17');
      expect(normalizeText(null)).toBe('');
      expect(normalizeText(undefined)).toBe('');
    });
  });

  describe('buildSearchTokens', () => {
    it('extracts meaningful search tokens, excluding stop words and single characters', () => {
      const tokens = buildSearchTokens('show me the backend java work');
      expect(tokens).toEqual(['backend', 'java', 'work']);
    });
  });

  describe('extractConcepts', () => {
    it('identifies concepts based on keywords', () => {
      expect(extractConcepts('Need microservices and Spring Boot')).toContain('backend');
      expect(extractConcepts('Postgres database performance')).toContain('database');
      expect(extractConcepts('Payments and virtual account')).toContain('fintech');
    });

    it('returns empty array when no concepts match', () => {
      expect(extractConcepts('random gibberish xyz')).toEqual([]);
    });
  });

  describe('getSmartSearchResults', () => {
    const mockProjects = [
      {
        slug: 'vam',
        title: 'Virtual Account Management',
        description: 'Fintech merchant banking platform',
        impact: 'Reduced transaction processing time',
        stack: ['Java', 'Spring Boot', 'PostgreSQL']
      }
    ];

    it('returns empty array for empty query', () => {
      expect(getSmartSearchResults({ query: '   ', projects: mockProjects })).toEqual([]);
    });

    it('finds and ranks matching projects', () => {
      const results = getSmartSearchResults({
        query: 'virtual account fintech',
        projects: mockProjects
      });

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].title).toBe('Virtual Account Management');
      expect(results[0].type).toBe('Project');
    });
  });

  describe('synthesizeLocalSmartAnswer', () => {
    it('returns empty string for empty query', () => {
      expect(synthesizeLocalSmartAnswer({ query: '' })).toBe('');
      expect(synthesizeLocalSmartAnswer({ query: '   ' })).toBe('');
    });

    it('matches resume intent', () => {
      const answer = synthesizeLocalSmartAnswer({ query: 'Where can I find your resume?' });
      expect(answer).toContain('resume');
      expect(answer).toContain('Preview Resume');
    });

    it('matches contact intent', () => {
      const answer = synthesizeLocalSmartAnswer({ query: 'How can I contact or hire you?' });
      expect(answer).toContain('reach me directly via email');
    });

    it('matches location intent', () => {
      const answer = synthesizeLocalSmartAnswer({ query: 'Where are you based?' });
      expect(answer).toContain('Bengaluru');
    });

    it('matches incident / reliability intent', () => {
      const answer = synthesizeLocalSmartAnswer({ query: 'Tell me about production support and incidents' });
      expect(answer).toContain('Production reliability');
      expect(answer).toContain('latency');
    });

    it('matches tech stack intent', () => {
      const answer = synthesizeLocalSmartAnswer({ query: 'What is your backend tech stack?' });
      expect(answer).toContain('Java');
      expect(answer).toContain('Spring Boot');
    });
  });

  describe('getDynamicSmartSearchPrompts', () => {
    it('returns context-aware prompts for experience context', () => {
      const prompts = getDynamicSmartSearchPrompts({ activeContext: 'Experience' });
      expect(prompts.some((p) => p.includes('AU Small Finance Bank'))).toBe(true);
    });

    it('returns context-aware prompts for project context', () => {
      const prompts = getDynamicSmartSearchPrompts({
        activeContext: 'Projects',
        projects: [{ title: 'Custom Banking Service' }]
      });
      expect(prompts.some((p) => p.includes('Custom Banking Service'))).toBe(true);
    });
  });
});
