/**
 * Project Management Module
 * ------------------------
 * Core project file management with dual storage for BA documents.
 * 
 * Data Model:
 * - Project: { name, folder?, files: { [filename]: content } }
 * - Default files: project.md, user-story-map.md, etc.
 * 
 * Storage:
 * - Primary: localStorage for stateful persistence
 * - Secondary: FileSystem API for on-disk backups (optional)
 * 
 * Operations:
 * - createProject: Initialize with default BA templates 
 * - saveProject: Sync to both storage layers
 * - loadProject: Restore from localStorage
 */

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

export const saveProject = async (project: Project, dirHandle?: FileSystemDirectoryHandle) => {
  // Always save to localStorage
  localStorage.setItem('ba-assistant-project', JSON.stringify(project));

  // If directory handle is provided, save files to the file system
  if (dirHandle) {
    try {
      for (const [filename, content] of Object.entries(project.files)) {
        const fileHandle = await dirHandle.getFileHandle(filename, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(content);
        await writable.close();
      }
    } catch (err) {
      console.error('Error saving files to directory:', err);
      throw err;
    }
  }
};

export const loadProject = (): Project | null => {
  const project = localStorage.getItem('ba-assistant-project');
  return project ? JSON.parse(project) : null;
};