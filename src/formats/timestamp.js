'use strict';

/**
 * @module formats/timestamp
*/

/**
 * Returns a timestamp string from a Date object.
 * @param {Date} dt - Date 
 * @param {String} separator - Separator character 
 * @return {string} Timestamp
*/
function fromDate(dt, separator='') {
  return [
    dt.getUTCFullYear(),
    ('0' + (dt.getUTCMonth() + 1)).slice(-2),
    ('0' + (dt.getUTCDate())).slice(-2),
    ('0' + (dt.getUTCHours())).slice(-2),
    ('0' + (dt.getUTCMinutes())).slice(-2)
  ].join(separator);
}

/**
 * Returns a file name with the timestamp.
 * @param {String} prefix - Prefix for file name
 * @param {Date} dt - Date object for timestamp
 * @param {String} extension - File extension
 * @return {String} File name
*/
function fileName(prefix, dt, extension) {
  const stamp = this.fromDate(dt);
  return `${prefix}-${stamp}.${extension}`;
}

module.exports = { fileName, fromDate };
