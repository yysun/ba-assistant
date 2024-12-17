/**
 * Server-Sent Events (SSE) endpoint for streaming chat responses from Ollama
 * 
 * Implementation:
 * - Exposes POST /api/chat endpoint for chat messages
 * - Uses SSE middleware for streaming responses
 * - Integrates with Ollama chat service for LLM responses
 * - Supports proper error handling and connection cleanup
 * 
 * Request format:
 * {
 *   messages: [{ role: "user"|"assistant", content: string }]
 * }
 * 
 * Response:
 * - Streams chunks of text as they are generated
 * - Each chunk is sent as an SSE event
 * - Final response includes complete generated text
 */

import sseMiddleware from '../middleware/sse.js';
import { chat } from '../services/ollama.js';

// Handler function that uses the SSE capabilities added by middleware
async function chatHandler(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405);
    res.end('Method not allowed');
    return;
  }

  try {
    // Parse request body
    const messages = req.body?.messages;
    if (!Array.isArray(messages)) {
      res.writeHead(400);
      res.end('Invalid request: messages array required');
      return;
    }

    // Stream handler that sends each chunk through SSE
    const onStream = (chunk) => {
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
    };

    // Start chat with streaming
    const response = await chat(messages, undefined, onStream);
    
    // Send final message and end stream
    res.write(`data: ${JSON.stringify({ text: response, done: true })}\n\n`);
    res.end();
  } catch (error) {
    console.error('Chat error:', error);
    // Send error through SSE if possible
    try {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    } catch (e) {
      // If SSE write fails, send regular error response
      res.writeHead(500);
      res.end(JSON.stringify({ error: error.message }));
    }
  }
}

// Export middleware-wrapped handler
export default (req, res) => {
  // Apply SSE middleware then call handler
  sseMiddleware(req, res, () => chatHandler(req, res));
};
