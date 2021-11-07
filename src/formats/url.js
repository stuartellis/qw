'use strict';

/**
 * @module formats/url
*/

const URI = require('urijs');

/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "URITemplate" }]*/
const URITemplate = require('urijs/src/URITemplate');

/**
 * Renders a URL from a template
 * @param {string} urlTemplate - Template for URL
 * @param {Object} values - Values for placeholders in the template
 * @return {URI} - A URI object
*/
function fromTemplate(urlTemplate, values) {
  return URI.expand(urlTemplate, values);
}

module.exports = { fromTemplate };
