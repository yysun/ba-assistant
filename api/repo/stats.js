/**
 * API endpoint for retrieving basic git repository statistics via Server-Sent Events (SSE).
 * Streams high-level repository information like commit counts and tags.
 * Uses SSE middleware for event streaming.
 */

import simpleGit from 'simple-git';
import sseMiddleware from '../../middleware/sse.js';

// Handler function that uses the SSE capabilities added by middleware
async function statsHandler(req, res) {
  const { path } = req.query;
  if (!path) {
    res.sendEvent('error', { message: 'Repository path is required' });
    res.end();
    return;
  }

  try {
    const git = simpleGit(path);
    const isRepo = await git.checkIsRepo();

    if (!isRepo) {
      res.sendEvent('error', { message: 'Not a git repository' });
      res.end();
      return;
    }

    // Get basic commit info
    const log = await git.log();
    const commits = log.all.map(commit => ({
      hash: commit.hash,
      date: commit.date
    }));
    res.sendEvent('commits', { commits });

    // Get tags
    const tagList = await git.tags();
    const tags = tagList.all.map(tag => ({ name: tag }));
    res.sendEvent('tags', { tags });

    // Send success event instead of complete
    res.sendEvent('success', null);
    res.end();
  } catch (error) {
    res.sendEvent('error', {
      message: error.message || 'Unknown error'
    });
    res.end();
  }
}

// Export middleware-wrapped handler
export default (req, res) => {
  // Apply SSE middleware then call handler
  sseMiddleware(req, res, () => statsHandler(req, res));
};
