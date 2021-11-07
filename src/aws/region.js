'use strict';

/**
 * @module aws/region
*/

/**
 * Returns AWS Region from environment variables.
 * @return {string}
*/
function get() {
  const envVariables = ['AWS_REGION'];
  for (const envVar of envVariables) {
    if (process.env[envVar]) {
      return process.env[envVar];
    }
  }
  return null;
}

module.exports = { get };
