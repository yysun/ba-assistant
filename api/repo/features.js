/**
 * Git repository feature analysis endpoint using Server-Sent Events (SSE)
 * 
 * Implementation:
 * - Streams real-time feature analysis results to client using SSE
 * - Analyzes complete git history from empty tree to HEAD
 * - Processes features sequentially, followed by summary generation
 * - Uses SSE middleware for connection and event management
 * - Handles errors with proper SSE error events
 * - Cleans up ollama processes on client disconnect
 * 
 * Events:
 * - feature: Individual feature analysis results
 * - summary: Final summary after all features are analyzed
 * - success: Analysis completion
 * - error: Analysis failures with message
 */
import simpleGit from 'simple-git';
import { analyzeGitDiff, summarizeFeatures } from '../../services/git-analyzer.js';
import sseMiddleware from '../../middleware/sse.js';
import { stopOllamaProcess } from '../../services/ollama.js';

async function featureHandler(req, res) {
  const { path } = req.query;
  if (!path) {
    res.sendEvent('error', { message: 'Repository path is required' });
    res.end();
    return;
  }

  // Track active analysis state
  let isAnalyzing = true;

  // Register cleanup handler
  res.onCleanup(() => {
    isAnalyzing = false;
    stopOllamaProcess();
  });

  try {
    const git = simpleGit(path);

    // Get diff from empty tree to HEAD
    const EMPTY_TREE_HASH = '4b825dc642cb6eb9a060e54bf8d69288fbee4904';
    const diff = await git.diff([EMPTY_TREE_HASH, 'HEAD']);

    // Analyze features with streaming
    const features = [];
    const featurePromise = analyzeGitDiff(diff, (content) => {
      // Stop processing if client disconnected
      if (!isAnalyzing) return;

      // Stream each feature analysis chunk
      res.sendEvent('feature', { content });
      features.push(content);
    });

    // Wait for feature analysis to complete
    await featurePromise;

    // Generate summary only after all features are collected
    if (isAnalyzing) {
      await summarizeFeatures(features, (content) => {
        if (!isAnalyzing) return;
        res.sendEvent('summary', { content });
      });

      // Send success event and end response
      res.sendEvent('success', {});
      res.end();
    }
  } catch (error) {
    console.error('Error analyzing features:', error);
    if (isAnalyzing) {
      res.sendEvent('error', { message: error.message });
      res.end();
    }
  }
}

// Export middleware-wrapped handler
export default (req, res) => {
  // Apply SSE middleware then call handler
  sseMiddleware(req, res, () => featureHandler(req, res));
};
