'use strict';

/**
 * @module tasks/adoRequest
*/

const { restClient, pat } = require('adolib');

const { url: urlFmt } = require('../formats');

/**
 * Runs a HTTP GET request for the templated URL, with Azure DevOps authentication.
 * @param {string} userToken - Personal Access Token (PAT) for Azure DevOps
 * @param {string} urlTemplate - Template for request URL
 * @param {Object} templateValues - Values for request URL
 * @param {Function} onError - Axios interceptor for response error
 * @param {Function} onSuccess - Axios interceptor for response success
 * @return {Promise<AxiosResponse>} Response as a Promise
*/
async function get(userToken, urlTemplate, templateValues, onError, onSuccess) {
  const queryUrl = urlFmt.fromTemplate(urlTemplate, templateValues);
  const adoKey = pat.encode(userToken);
  const adoConnector = restClient.create(adoKey);
  adoConnector.interceptors.response.use(onSuccess, onError);
  return adoConnector.get(queryUrl.toString());
}

module.exports = { get };
