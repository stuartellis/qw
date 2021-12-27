'use strict';

/**
 * @module git/command
*/

const fs = require('fs').promises;
const path = require('path');

const simpleGit = require('simple-git');

/**
 * Clones local copy of Git repository.
 * @param {string} sourceRepo - Address of remote Git repository
 * @param {string} parentPath - Local path for parent directory
*/
async function clone(sourceRepo, parentPath) { 
  const git = new simpleGit();
  await git.cwd(parentPath);
  return git.clone(sourceRepo);
}

/**
 * Creates or updates local copy of Git repository.
 * @param {string} name - Name of Git repository
 * @param {string} sourceRepo - Address of remote Git repository
 * @param {string} parentPath - Local path for parent directory
*/
async function sync(name, sourceRepo, parentPath) {
  const localPath = path.join(parentPath, name); 
  let isNew = false;

  try {
    await fs.stat(localPath);
  } catch (err){ 
    if (err.code === 'ENOENT') { 
      isNew = true;
    } else {
      return err;
    }
  }

  if (isNew) {
    return this.clone(sourceRepo, parentPath);
  } else {
    return this.pull(localPath);
  }

}

/**
 * Runs Git pull to update local copy of repository.
 * @param {string} localPath - Local path for repository
*/
async function pull(localPath) {  
  const git = new simpleGit();
  await git.cwd(localPath);
  return git.pull();
}

module.exports = { clone, pull, sync };
