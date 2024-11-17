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
  'pages-and-navigations.md',
  'pages-and-user-stories.md',
  'sprint-planning.md'
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