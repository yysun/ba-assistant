export interface Project {
  name: string;
  folder?: string;
  files: {
    [key: string]: string;
  };
}

const DEFAULT_FILES = [
  'project.md',
  'user-story-map.md',
  'customer-journey-map.md',
  'page-navigations.md',
  'page-user-stories.md',
  'sprint-plan.md'
];

export const createProject = (name: string): Project => ({
  name,
  files: DEFAULT_FILES.reduce((acc, file) => ({ ...acc, [file]: '' }), {})
});

export const saveProject = (project: Project) => {
  localStorage.setItem('ba-assistant-project', JSON.stringify(project));
};

export const loadProject = (): Project | null => {
  const project = localStorage.getItem('ba-assistant-project');
  return project ? JSON.parse(project) : null;
};