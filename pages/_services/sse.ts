/**
 * Server-Sent Events (SSE) Service Module
 * 
 * Provides utilities for handling SSE streams in a standardized way across the application.
 * Features:
 * - Stream response processing with buffer management
 * - Event parsing and validation
 * - Error handling and proper cleanup
 */

// Generic event parser that can be extended for specific event types
export const parseSSEEvent = <T>(line: string, prefix: string = 'data: '): T | null => {
  if (!line.startsWith(prefix)) return null;
  try {
    return JSON.parse(line.slice(prefix.length));
  } catch (e) {
    console.error('SSE Parse Error:', e);
    return null;
  }
};

// Generic stream processor that can be used across different components
export const processStreamResponse = async <T>(
  response: Response,
  onEvent: (event: T) => void,
  eventParser: (line: string) => T | null = (line) => parseSSEEvent<T>(line)
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
          const event = eventParser(buffer);
          if (event) onEvent(event);
        }
        return;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete line in buffer

      for (const line of lines) {
        const event = eventParser(line);
        if (event) onEvent(event);
      }
    }
  } finally {
    reader.cancel().catch(console.error);
  }
};
