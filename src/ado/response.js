'use strict';

/**
 * @module ado/response
*/

/**
 * Axios interceptor for request errors.
 * @param {Object} error - Error
 * @return {PromiseRejectedResult} - Rejected Promise
*/
async function checkError(error) {
  return Promise.reject(error);
}

/**
 * Axios interceptor for successful requests.
 * @param {Object} response - Response
 * @return {Object} - Response
*/
async function checkSuccess(response) {
  return validateStatus(response)
    .then(validateData)
    .catch((err) => {
      return Promise.reject(err);
    });
}

/**
 * Validates presence of data.
 * @param {Object} response - Response
 * @return {Object} - Response
*/
async function validateData(response) {
  if (response.data) {
    return response;
  } else {
    const error = new Error(`Missing data HTTP ${response.status} ${response.config.method} ${response.config.url}`);
    error.response = response;
    return Promise.reject(error);
  }
}

/**
 * Validates HTTP status code.
 * @param {Object} response - Response
 * @return {Object} - Response
*/
async function validateStatus(response) {
  if (response.status && response.status === 200) {
    return response;
  } else {
    const err = new Error(`Unsuccessful request HTTP ${response.status} ${response.config.method.toUpperCase()} ${response.config.url}`);
    err.response = response;
    return Promise.reject(err);
  }
}

module.exports = { checkError, checkSuccess, validateData, validateStatus };
