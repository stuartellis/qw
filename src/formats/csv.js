'use strict';

/**
 * @module formats/csv
*/

/**
 * Renders a JavaScript object into CSV format.
 * @param {Array} items - Array of Objects
 * @return {string} CSV with header
*/
function fromObject(items) {
  const replacer = (key, value) => value === null ? '' : value;
  const header = Object.keys(items[0]);
  const csv = [
    header.join(','),
    ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
  ].join('\r\n');
  return csv;
}

module.exports = { fromObject };
