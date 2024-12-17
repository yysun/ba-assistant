/**
 * Server-Sent Events (SSE) middleware for Express
 * Handles SSE connections and provides helper methods for sending events
 * Automatically handles JSON serialization and connection management
 * Events are sent as JSON objects containing both event type and data
 * Follows SSE protocol with 'data:' prefix for event data
 * Supports cleanup callbacks for resource management on disconnect
 * 
 * @module middleware/sse
 */

export default function sseMiddleware(req, res, next) {
  // Set headers for SSE connection
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

  // Send initial connection headers
  res.write('\n');
  if (res.flush) {
    res.flush();
  }

  // Helper method to send events to the client
  res.sendEvent = function(event, data) {
    const eventObj = {
      event: event,
      data: data
    };
    res.write('data: ' + JSON.stringify(eventObj) + '\n\n');
    if (res.flush) {
      res.flush();
    }
  };

  // Store cleanup callbacks
  const cleanupCallbacks = new Set();

  // Add method to register cleanup callbacks
  res.onCleanup = function(callback) {
    cleanupCallbacks.add(callback);
  };

  // Handle client disconnect
  req.on('close', () => {
    // Execute all cleanup callbacks
    for (const callback of cleanupCallbacks) {
      try {
        callback();
      } catch (error) {
        console.error('Error in cleanup callback:', error);
      }
    }
    cleanupCallbacks.clear();
    res.end();
  });

  next();
}
