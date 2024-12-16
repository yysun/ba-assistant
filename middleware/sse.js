/**
 * Server-Sent Events (SSE) middleware
 * 
 * Enhances response object with SSE capabilities:
 * - Automatically sets SSE headers
 * - Provides sendEvent method for proper event formatting
 * - Handles connection cleanup
 * 
 * Usage:
 * app.use('/api/events', sseMiddleware);
 * 
 * In route handler:
 * app.get('/api/events', (req, res) => {
 *   res.sendEvent('progress', { value: 50 });
 * });
 */

export default function sseMiddleware(req, res, next) {
  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Keep connection alive
  const keepAlive = setInterval(() => {
    res.write(': keepalive\n\n');
    if (res.flush) res.flush();
  }, 30000);

  // Clean up on connection close
  res.on('close', () => {
    clearInterval(keepAlive);
  });

  // Add SSE helper method
  res.sendEvent = (event, data) => {
    const chunk = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    res.write(chunk);
    if (res.flush) res.flush();
  };

  next();
}
