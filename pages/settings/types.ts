/**
 * Settings Types Module
 * 
 * Contains type definitions for the settings page state and events.
 * Includes:
 * - State interface for component state management
 * - SSE event data types for stream handling
 * - API endpoint constants
 * - Error message types and constants
 */

export type ErrorMessage = string;

export interface State {
  folderPath: string;
  loading: boolean;
  error: ErrorMessage | null;
  stats: {
    commits: string[];
    tags: string[];
  };
  features: {
    items: string[];
    summary: string[];
  };
}

// Event data types that extend object for SSE service compatibility
export interface CommitsEventData {
  content: string;
}

export interface TagsEventData {
  content: string;
}

export interface FeatureEventData {
  content: string;
}

export interface SummaryEventData {
  content: string;
}

export interface SuccessEventData {
  message?: string;
}

// Use the ErrorEventData from SSE service
// import { ErrorEventData } from '../_services/sse';

// SSE event type using service's generic interface
export type SSEEvent =
  | { event: 'commits'; data: CommitsEventData }
  | { event: 'tags'; data: TagsEventData }
  | { event: 'feature'; data: FeatureEventData }
  | { event: 'summary'; data: SummaryEventData }
  | { event: 'success'; data: SuccessEventData }
  | { event: 'error'; data: { message: string } };

export const API_ENDPOINTS = {
  STATS: '/api/repo/stats',
  FEATURES: '/api/repo/features'
} as const;

export const ERROR_MESSAGES = {
  NO_PATH: 'Please enter a repository path',
  EMPTY_PATH: 'Repository path cannot be empty',
  GENERIC_STATS: 'Failed to analyze repository',
  GENERIC_FEATURES: 'Failed to extract features',
  UNKNOWN_ERROR: 'An unknown error occurred'
} as const;
