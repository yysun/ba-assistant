/**
 * Server-Sent Events (SSE) endpoint for streaming chat responses from Ollama
 * 
 * Implementation:
 * - Exposes POST /api/chat endpoint for chat messages
 * - Uses SSE middleware for streaming responses
 * - Integrates with Ollama chat service for LLM responses
 * - Supports proper error handling and connection cleanup
 * - Uses standardized SSE event format matching features.js
 * 
 * Events:
 * - feature: Streams chunks of generated text
 * - success: Final completion
 * - error: Any errors during generation
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

  // Track active generation state
  let isGenerating = true;

  // Register cleanup handler
  res.onCleanup(() => {
    isGenerating = false;
  });

  try {
    // Parse request body
    const messages = req.body?.messages;
    if (!Array.isArray(messages)) {
      res.sendEvent('error', { message: 'Invalid request: messages array required' });
      res.end();
      return;
    }

    // Stream handler that sends each chunk through SSE
    const onStream = (chunk) => {
      if (!isGenerating) return;
      res.sendEvent('content', { content: chunk });
    };

    // Start chat with streaming
    const response = await chat(messages, undefined, onStream);
    
    // Send success event and end stream
    if (isGenerating) {
      res.sendEvent('success', {});
      res.end();
    }
  } catch (error) {
    console.error('Chat error:', error);
    if (isGenerating) {
      res.sendEvent('error', { message: error.message });
      res.end();
    }
  }
}

// Export middleware-wrapped handler
export default (req, res) => {
  // Apply SSE middleware then call handler
  sseMiddleware(req, res, () => chatHandler(req, res));
};
