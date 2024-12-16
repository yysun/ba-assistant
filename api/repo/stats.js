import { getCommitDiffs, getTagDiffs } from '../../services/git-service.js';
import simpleGit from 'simple-git';

export default async (req, res) => {
  const { path } = req.query;
  if (!path) {
    res.sendEvent('error', { message: 'Repository path is required' });
    return res.end();
  }

  try {
    // Initialize git with the provided path
    const git = simpleGit(path);

    // Verify it's a git repository
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      res.sendEvent('error', { message: 'Not a git repository' });
      return res.end();
    }

    // Track progress
    let processedCommits = 0;
    const onProgress = (progress) => {
      processedCommits = progress;
      res.sendEvent('commit-progress', { current: processedCommits });
    };

    try {
      // Initial progress event
      res.sendEvent('commit-progress', { current: 0 });

      // Get commit history with progress tracking
      const commits = await getCommitDiffs(git, null, 1, onProgress);
      res.sendEvent('commits', { commits });

      // Get tag history
      const tags = await getTagDiffs(git, null);
      res.sendEvent('tags', { tags });

      res.end();
    } catch (error) {
      res.sendEvent('error', { message: `Git analysis error: ${error.message}` });
      res.end();
    }
  } catch (error) {
    res.sendEvent('error', { message: error.message });
    res.end();
  }
};
