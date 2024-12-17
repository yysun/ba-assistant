/**
 * Home Types Module
 * 
 * Contains type definitions for the home page:
 * - SSE event parsing and processing types
 * - Application state interface
 * - UI interaction types
 * 
 * Note: Project interface is imported from _data/project
 * to maintain consistency across the application
 */

import { Project } from '../_services/project';
import { Prompt } from '../_services/prompts';

// Event types from server
export interface ContentEvent {
  content: string;
}

export interface ErrorEvent {
  message: string;
}

export type ParsedEvent = {
  event: 'content';
  data: ContentEvent;
} | {
  event: 'success';
  data: Record<string, never>;
} | {
  event: 'error';
  data: ErrorEvent;
};

// State Interface
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
  leftTitle: string;
  rightTitle: string;
  activeTab: string;
  tabs: string[];
  generating: boolean;
  project: Project | null;
  selectedFiles: string[];
  showFileSelector: boolean;
  promptContent: string;
  prompts?: Prompt[];
}

// Event Types
export interface DragEvent extends PointerEvent {
  target: HTMLElement;
}

export interface InputEvent extends Event {
  target: HTMLTextAreaElement;
}

// Constants
export const ERROR_MESSAGES = {
  HTTP_ERROR: 'HTTP error! status:',
  NULL_RESPONSE: 'Response body is null',
  PARSE_ERROR: 'Failed to parse SSE event:',
  COPY_ERROR: 'Failed to copy text:',
  SAVE_ERROR: 'Failed to save files:',
  PERMISSION_DENIED: 'Permission denied to access the selected folder',
  GENERATION_ERROR: 'Failed to generate:'
} as const;
