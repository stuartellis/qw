'use strict';

/**
 * @module serialize/stringer
*/

const flatten = require('flat');

const { csv } = require('../formats');

/**
 * Converts arrays of JavaScript Objects to string formats.
 * @param {String} type - 'csv' or 'json'
 * @param {Array<Object>} items - Array of Objects
 * @return {String} Objects as String in the specified format
*/
function format(type, items) {
  switch (type) {
  case 'csv':
    return csv.fromObject(items.map((item) => { return flatten(item, {delimiter: '_'}); }));
  case 'json':
    return JSON.stringify(items);
  default:
    throw new Error('No output format specified');
  }
}

module.exports = { format };
