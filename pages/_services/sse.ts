/**
 * Server-Sent Events (SSE) Service Module
 * 
 * Provides utilities for handling SSE streams in a standardized way across the application.
 * Features:
 * - Stream response processing with buffer management
 * - Event parsing and validation with full event type support
 * - Error handling and proper cleanup
 * - Support for typed events with event names and data
 * - Standardized error event propagation to UI
 */

export interface SSEEvent<T extends object = object> {
  event: string;
  data: T;
}

export interface ErrorEventData {
  message: string;
}

// Generic event parser that returns the full SSE event object
export const parseSSEEvent = <T extends object>(line: string, prefix: string = 'data: '): SSEEvent<T | ErrorEventData> | null => {
  if (!line.startsWith(prefix)) return null;
  try {
    const event = JSON.parse(line.slice(prefix.length)) as SSEEvent<T>;
    // Convert error events into a standardized format
    if (event.event === 'error' && (event.data as unknown as ErrorEventData).message) {
      return {
        event: 'error',
        data: { message: (event.data as unknown as ErrorEventData).message }
      };
    }
    return event;
  } catch (e) {
    console.error('SSE Parse Error:', e);
    // Convert parse errors into error events
    return {
      event: 'error',
      data: { message: e instanceof Error ? e.message : 'Failed to parse SSE event' }
    };
  }
};

// Generic stream processor that can be used across different components
export const processStreamResponse = async <T extends object>(
  response: Response,
  onEvent: (event: SSEEvent<T | ErrorEventData>) => void,
  eventParser: (line: string) => SSEEvent<T | ErrorEventData> | null = (line) => parseSSEEvent<T>(line)
): Promise<void> => {
  if (!response.body) {
    onEvent({
      event: 'error',
      data: { message: 'No response body available' }
    });
    return;
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
            onEvent({
              event: 'error',
              data: { message: 'Error parsing final buffer' }
            });
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
            onEvent({
              event: 'error',
              data: { message: 'Error parsing SSE line' }
            });
          }
        }
      }
    }
  } catch (e) {
    onEvent({
      event: 'error',
      data: { message: e instanceof Error ? e.message : 'Stream processing error' }
    });
  } finally {
    reader.cancel().catch(console.error);
  }
};
