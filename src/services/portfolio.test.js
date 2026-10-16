import {
  getProfile,
  getExperiences,
  getProjects,
  getSkillCategories,
  getEducation,
  getAchievements
} from './portfolio';

describe('portfolio service', () => {
  it('loads fallback profile when Supabase environment variables are absent', async () => {
    const profile = await getProfile();
    expect(profile).toBeDefined();
    expect(profile.fullName).toBe('Naman Sanadhya');
    expect(profile.headline).toContain('Backend Developer');
  });

  it('loads fallback experiences when Supabase environment variables are absent', async () => {
    const experiences = await getExperiences();
    expect(Array.isArray(experiences)).toBe(true);
    expect(experiences.length).toBeGreaterThan(0);
    expect(experiences[0].company).toBeDefined();
  });

  it('loads fallback projects when Supabase environment variables are absent', async () => {
    const projects = await getProjects();
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThan(0);
    expect(projects[0].title).toBeDefined();
  });

  it('loads fallback skill categories when Supabase environment variables are absent', async () => {
    const categories = await getSkillCategories();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
    expect(categories[0].category).toBeDefined();
  });

  it('loads fallback education when Supabase environment variables are absent', async () => {
    const education = await getEducation();
    expect(Array.isArray(education)).toBe(true);
    expect(education.length).toBeGreaterThan(0);
  });

  it('loads fallback achievements when Supabase environment variables are absent', async () => {
    const achievements = await getAchievements();
    expect(Array.isArray(achievements)).toBe(true);
    expect(achievements.length).toBeGreaterThan(0);
  });
});
