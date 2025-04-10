import { promisify } from "util";
import { exec as execCallback } from "child_process";

const exec = promisify(execCallback);

/**
 * Check if the current directory is a Git repository
 * @returns {Promise<boolean>} Whether the current directory is a Git repository
 */
export async function isGitRepository() {
  try {
    await exec("git rev-parse --is-inside-work-tree");
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get the staged diff from Git
 * @returns {Promise<string>} The staged diff
 */
export async function getStagedDiff() {
  try {
    const { stdout } = await exec("git diff --cached");
    return stdout;
  } catch (error) {
    throw new Error(`Failed to get staged diff: ${error.message}`);
  }
}

/**
 * Check if there are staged changes
 * @returns {Promise<boolean>} Whether there are staged changes
 */
export async function hasStagedChanges() {
  try {
    const { stdout } = await exec("git diff --cached --name-only");
    return stdout.trim().length > 0;
  } catch (error) {
    throw new Error(`Failed to check staged changes: ${error.message}`);
  }
}

/**
 * Create a commit with the given message
 * @param {string} message The commit message
 * @returns {Promise<void>}
 */
export async function createCommit(message) {
  try {
    await exec(`git commit -m "${message.replace(/"/g, '\\"')}"`);
  } catch (error) {
    throw new Error(`Failed to create commit: ${error.message}`);
  }
}

/**
 * Set up a Git hook
 * @param {string} hookType The type of hook (e.g., prepare-commit-msg)
 * @returns {Promise<void>}
 */
export async function setupGitHook(hookType) {
  try {
    const hookPath = `.git/hooks/${hookType}`;
    const hookContent = `#!/bin/sh
# aicommits ${hookType} hook
aicommits --hook "$@"
`;

    await exec(`echo '${hookContent}' > ${hookPath} && chmod +x ${hookPath}`);
    console.log(`Git hook ${hookType} set up successfully.`);
  } catch (error) {
    throw new Error(`Failed to set up Git hook: ${error.message}`);
  }
}
