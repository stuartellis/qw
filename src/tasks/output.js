'use strict';

const fs = require('fs').promises;

const chalk = require('chalk');

const { stringer } = require('../serialize');

/**
 * @module tasks/output
*/

/**
 * Validates number of items.
 * @param {Array} items - Items
 * @param {String} owner - The name of the account or category that the items belong to
 * @param {String} singularName - Singular name for an item, e.g. 'object'
 * @param {String} pluralName - Plural for items, e.g. 'objects'
*/
function countItems(items, owner, singularName, pluralName) {
  switch (items.length) {
  case 0:
    throw new Error(`No ${pluralName} found for ${owner}`);
  case 1:
    console.log(`%s 1 ${singularName} found for ${owner}`, chalk.blue('INFO'));
    break;
  default:
    console.log(`%s ${items.length} ${pluralName} found for ${owner}`, chalk.blue('INFO'));
    break;
  }
}

/**
 * Ensures that directory exists.
 * @param {String} fullPath - Full path for directory
*/
async function ensureDirectory(fullPath) {
  const dirResult = await fs.mkdir(fullPath, { recursive: true });

  if (dirResult) {
    console.log(`%s Created directory ${dirResult}`, chalk.green('INFO'));
  } else {
    console.log(`%s Directory ${fullPath} already exists`, chalk.blue('INFO'));
  }

  return fullPath; 
}

/**
 * Writes data to a file.
 * @param {Array} items - Items
 * @param {String} format - Text format, e.g. 'json'
 * @param {String} outputPath - Full path where the file will be created, including the file name
*/
async function writeFile(items, format, outputPath) {
  let content = stringer.format(format, items);
  await fs.writeFile(outputPath, content, 'utf8');
  console.log(`%s Wrote file ${outputPath}`, chalk.green('INFO'));
}

module.exports = { countItems, ensureDirectory, writeFile };
