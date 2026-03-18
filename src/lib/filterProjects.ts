import { Project } from './types';

export function filterAndSortProjects(projects: Project[], selectedFilters: string[]): Project[] {
  if (selectedFilters.length === 0) {
    return [...projects].sort((a, b) => a.priority - b.priority);
  }

  const scored = projects.map(project => ({
    project,
    score: project.tags.filter(tag => selectedFilters.includes(tag)).length,
  }));

  return scored
    .sort((a, b) => b.score - a.score || a.project.priority - b.project.priority)
    .map(item => item.project);
}
