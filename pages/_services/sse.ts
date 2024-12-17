/**
 * Server-Sent Events (SSE) Service Module
 * 
 * Provides utilities for handling SSE streams in a standardized way across the application.
 * Features:
 * - Stream response processing with buffer management
 * - Event parsing and validation with full event type support
 * - Error handling and proper cleanup
 * - Support for typed events with event names and data
 */

export interface SSEEvent<T extends object = object> {
  event: string;
  data: T;
}

interface ErrorEvent {
  message: string;
}

// Generic event parser that returns the full SSE event object
export const parseSSEEvent = <T extends object>(line: string, prefix: string = 'data: '): SSEEvent<T> | null => {
  if (!line.startsWith(prefix)) return null;
  try {
    const event = JSON.parse(line.slice(prefix.length)) as SSEEvent<T>;
    if (event.event === 'error' && (event.data as unknown as ErrorEvent).message) {
      throw new Error((event.data as unknown as ErrorEvent).message);
    }
    return event;
  } catch (e) {
    console.error('SSE Parse Error:', e);
    throw e; // Re-throw to handle in the stream processor
  }
};

// Generic stream processor that can be used across different components
export const processStreamResponse = async <T extends object>(
  response: Response,
  onEvent: (event: SSEEvent<T>) => void,
  eventParser: (line: string) => SSEEvent<T> | null = (line) => parseSSEEvent<T>(line)
): Promise<void> => {
  if (!response.body) {
    throw new Error('No response body available');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { value, done } = await reader.read();

      if (done) {
        if (buffer.trim()) {
          try {
            const event = eventParser(buffer);
            if (event) onEvent(event);
          } catch (e) {
            // Handle parse errors but continue processing
            console.error('Error parsing final buffer:', e);
          }
        }
        return;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.trim()) {
          try {
            const event = eventParser(line);
            if (event) onEvent(event);
          } catch (e) {
            // Handle parse errors but continue processing
            console.error('Error parsing line:', e);
          }
        }
      }
    }
  } finally {
    reader.cancel().catch(console.error);
  }
};
