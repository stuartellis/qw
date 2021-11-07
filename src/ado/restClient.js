'use strict';

/**
 * @module ado/restClient
*/

const axios = require('axios').default;
const http = require('http');
const https = require('https');

/**
 * Creates an Axios client with Azure DevOps authentication.
 * @param {string} authToken - Token for HTTP Basic Authentication
 * @param {Object} params - Parameters for Axios client 
 * @param {number} timeout - HTTP timeout for a client request
 * @param {number} maxRedirects - Maximum number of redirects for a client request
 * @return {AxiosInstance} - Axios client
*/
function create(authToken, params={}, timeout=10000, maxRedirects=10) {
  return axios.create({
    httpAgent: new http.Agent({ keepAlive: true }),
    httpsAgent: new https.Agent({ keepAlive: true }),
    headers: { Authorization: `Basic ${authToken}` },
    maxRedirects: maxRedirects,
    params: params,
    timeout: timeout
  });
}

module.exports = { create };
