'use strict';

/**
 * @module formats/csv
*/

/**
 * Renders an Array of JavaScript objects into CSV format.
 * @param {Array<Object>} items - Array of Objects
 * @return {string} CSV with header
*/
function fromArray(items) {
  const replacer = (key, value) => value === null ? '' : value;
  const header = Object.keys(items[0]);
  const csv = [
    header.join(','),
    ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
  ].join('\r\n');
  return csv;
}

/**
 * Renders a JavaScript object into CSV format.
 * @param {Object} item - Object
 * @return {string} CSV with header
*/
function fromObject(item) {
  const replacer = (key, value) => value === null ? '' : value;
  const header = Object.keys(item);
  const csv = [
    header.join(','),
    header.map(fieldName => JSON.stringify(item[fieldName], replacer)).join(',')
  ].join('\r\n');
  return csv;
}

module.exports = { fromArray, fromObject };
