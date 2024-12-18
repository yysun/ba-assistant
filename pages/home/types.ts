/**
 * Home Page Types Module
 * 
 * Contains type definitions for the home page state and events.
 * Includes:
 * - State interface for component state management
 * - Event type definitions for user interactions
 * - Error message constants
 * - Parsed event types for SSE handling
 */

import { Project } from '../_services/project';

export interface State {
  dragging: boolean;
  leftWidth: number;
  start: {
    x: number;
    width: number;
  };
  el: HTMLElement | null;
  container: HTMLElement | null;
  leftContent: string;
  rightContent: string;
  rightTitle: string;
  activeTab: string;
  selectedFiles: string[];
  showFileSelector: boolean;
  project: Project | null;
  promptContent: string;
  generating: boolean;
  prompts?: Prompt[];
  error: string | null; // Added error property for error message handling
}

export interface DragEvent extends PointerEvent {
  target: HTMLElement;
}

export interface InputEvent extends Event {
  target: HTMLTextAreaElement;
}

export interface Prompt {
  label: string;
  content: string;
}

export interface ParsedEvent {
  event: string;
  data: {
    content?: string;
    message?: string;
  };
}

export const ERROR_MESSAGES = {
  COPY_ERROR: 'Failed to copy to clipboard:',
  PERMISSION_DENIED: 'Permission denied to access the directory',
  SAVE_ERROR: 'Failed to save project:',
  HTTP_ERROR: 'HTTP error',
  GENERATION_ERROR: 'Error generating content:',
  UNKNOWN_ERROR: 'An unknown error occurred'
};
