/**
 * Settings Types Module
 * 
 * Contains type definitions for the settings page:
 * - Repository data types (commits, tags)
 * - Application state interface
 * - Server-sent events (SSE) types
 * - Error message types
 */

// Repository data types
export interface Commit {
  hash: string;
  date: string;
}

export interface Tag {
  name: string;
}

export interface Stats {
  commits: Commit[];
  tags: Tag[];
}

// Application state
export interface State {
  folderPath: string;
  loading: boolean;
  error: string | null;
  stats: Stats;
  features: {
    items: string[];
    summary: string[];
  };
}

// Server-sent events
export interface SSEEvent {
  event: string;
  data: {
    content?: any;
    message?: string;
  };
}

// Constants
export const API_ENDPOINTS = {
  STATS: '/api/repo/stats',
  FEATURES: '/api/repo/features'
} as const;

export const ERROR_MESSAGES = {
  EMPTY_PATH: 'Repository path cannot be empty',
  NO_PATH: 'Please enter a repository path',
  NO_CONTENT: 'Server response has no content',
  GENERIC_STATS: 'Failed to analyze repository',
  GENERIC_FEATURES: 'Failed to analyze features',
  INVALID_EVENT_DATA: 'Invalid event data received',
  INVALID_EVENT_FORMAT: 'Invalid event format - missing event',
  INVALID_COMMITS_DATA: 'Invalid commits data received',
  INVALID_TAGS_DATA: 'Invalid tags data received',
  UNKNOWN_ERROR: 'Unknown error occurred'
} as const;

export type ErrorMessage = string;
