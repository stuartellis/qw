'use strict';

/**
 * @module ado/pat
*/

/**
 * Returns an encoded version of a Personal Access Token for use with HTTP Basic authentication.
 * The PAT is prefixed with a : character to indicate that no username is being passed.
 * @param {string} token - Azure DevOps Personal Access Token (PAT)
 * @return {string} - Base64 string
*/
function encode(token) {
  const tokenWithEmptyUsername = `:${token}`;
  const buffer = Buffer.from(tokenWithEmptyUsername, 'utf-8');
  return buffer.toString('base64');
}

/**
 * Returns Personal Access Token from environment variables.
 * @return {string}
*/
function get() {
  const envVariables = ['AZURE_DEVOPS_EXT_PAT', 'PAT'];
  for (const envVar of envVariables) {
    if (process.env[envVar]) {
      return process.env[envVar];
    }
  }
  return null;
}

module.exports = { encode, get };
