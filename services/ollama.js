/**
 * Ollama API client with streaming support and error handling
 * 
 * Implementation:
 * - Uses fetch API with streaming response processing
 * - Implements retry logic with exponential backoff
 * - Handles partial JSON chunks in stream with buffer
 * - Supports both chat and completion endpoints
 * - Supports custom stream handlers for client-side streaming
 * - Tracks active connections for proper cleanup
 * 
 * Data flow:
 * 1. Request -> Streaming response -> Buffer -> JSON chunks
 * 2. JSON chunks -> Text accumulation + Stream handler
 * 3. Final text -> Response cleanup -> Return
 * 
 * Key params:
 * - model: llama3.2:3b
 * - max_tokens: 4096
 * - num_ctx: 131072 (context window)
 * - temperature: 0.3
 */

// Configuration
export const CONFIG = {
  endpoint: 'http://localhost:11434/',
  model: 'llama3.2:3b',
  temperature: 0.3,
  retryAttempts: 3,
  retryDelay: 1000,
  maxTokens: 4096,
  language: 'English',
  streaming: true
};

class OllamaClient {
  constructor(config = CONFIG) {
    this.config = config;
    this.activeReaders = new Set();
    this.activeConnections = new Set();
  }

  // Core API method
  async query(prompt, maxTokens = this.config.maxTokens, onStream = null) {
    const controller = new AbortController();
    this.activeConnections.add(controller);

    return this._retryWithDelay(async () => {
      try {
        const response = await fetch(this.config.endpoint + 'api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: this.config.model,
            prompt: this._sanitizePrompt(prompt),
            stream: this.config.streaming,
            temperature: this.config.temperature,
            max_tokens: maxTokens,
            num_ctx: 131072
          }),
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await this._processStream(response, false, onStream);
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Request aborted');
          return '';
        }
        console.error('Error querying Ollama:', error);
        throw error;
      } finally {
        this.activeConnections.delete(controller);
      }
    });
  }

  async chat(messages, maxTokens = this.config.maxTokens, onStream = null) {
    const controller = new AbortController();
    this.activeConnections.add(controller);

    return this._retryWithDelay(async () => {
      try {
        const response = await fetch(this.config.endpoint + 'api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: this.config.model,
            messages,
            stream: this.config.streaming,
            temperature: this.config.temperature,
            max_tokens: maxTokens
          }),
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await this._processStream(response, true, onStream);
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Request aborted');
          return '';
        }
        console.error('Error in chat with Ollama:', error);
        throw error;
      } finally {
        this.activeConnections.delete(controller);
      }
    });
  }

  // Stream handling
  async _processStream(response, isChat = false, onStream = null) {
    const reader = response.body.getReader();
    this.activeReaders.add(reader);
    let fullText = '';

    try {
      let decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        while (true) {
          const newlineIndex = buffer.indexOf('\n');
          if (newlineIndex === -1) break;

          const line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (!line.trim()) continue;

          try {
            const parsed = JSON.parse(line);
            fullText = isChat ? 
              this._processChatStream(parsed, fullText, onStream) : 
              this._processQueryStream(parsed, fullText, onStream);
          } catch (e) {
            // Silently ignore parsing errors
          }
        }
      }

      // Handle any remaining buffer content
      if (buffer.trim()) {
        try {
          const parsed = JSON.parse(buffer);
          fullText = isChat ? 
            this._processChatStream(parsed, fullText, onStream) : 
            this._processQueryStream(parsed, fullText, onStream);
        } catch (e) {
          // Silently ignore parsing errors
        }
      }
    } finally {
      this.activeReaders.delete(reader);
      reader.releaseLock();
    }

    return fullText;
  }

  _processChatStream(parsed, currentText, onStream) {
    const content = parsed.message?.content || '';
    if (content && !parsed.done) {
      if (onStream) {
        onStream(content);
      }
      return currentText + content;
    }
    return currentText;
  }

  _processQueryStream(parsed, currentText, onStream) {
    const content = parsed.response || '';
    if (content) {
      if (onStream) {
        onStream(content);
      }
      return currentText + content;
    }
    return currentText;
  }

  // Stop all active processes and connections
  async stopOllamaProcess() {
    // Abort all active connections
    const controllers = Array.from(this.activeConnections);
    for (const controller of controllers) {
      controller.abort();
      this.activeConnections.delete(controller);
    }

    // Cancel all active streams
    const readers = Array.from(this.activeReaders);
    for (const reader of readers) {
      try {
        await reader.cancel();
      } catch (error) {
        console.error('Error canceling reader:', error);
      }
      this.activeReaders.delete(reader);
    }
  }

  // Utility methods
  _sanitizePrompt(text) {
    if (!text) return '';
    const sanitized = text
      .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F-\u009F]/g, '')
      .replace(/\\(?!["\\/bfnrt])/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');

    return sanitized.slice(0, 100000);
  }

  async _retryWithDelay(fn, retries = this.config.retryAttempts) {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (error.name === 'AbortError') throw error;
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay * (i + 1)));
      }
    }
  }

  setLanguage(language) {
    this.config.language = language;
  }

  toggleStreaming(enabled) {
    this.config.streaming = enabled;
    return enabled;
  }
}

// Create singleton instance
const ollamaClient = new OllamaClient();

// Export public methods
export const query = (prompt, maxTokens, onStream) => ollamaClient.query(prompt, maxTokens, onStream);
export const setLanguage = (language) => ollamaClient.setLanguage(language);
export const toggleStreaming = (enabled) => ollamaClient.toggleStreaming(enabled);
export const chat = (messages, maxTokens, onStream) => ollamaClient.chat(messages, maxTokens, onStream);
export const stopOllamaProcess = () => ollamaClient.stopOllamaProcess();
