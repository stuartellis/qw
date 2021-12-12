'use strict';

const chalk = require('chalk');

/**
 * Log item.
 * @param {Error} err - Error object
*/
function writeError(err) {
  console.error(`%s ${err.message}`, chalk.red('ERR'));
}

/**
 * Log item.
 * @param {Object} item - Item
 * @param {String} owner - The name of the account or category that the items belong to
 * @param {String} singularName - Singular name for an item, e.g. 'object'
*/
function writeItem(item, owner, singularName) {
  const itemIdentifier = `${item.name} (ID: ${item.id})`;
  console.log(`%s ${singularName} ${itemIdentifier} found for ${owner}`, chalk.blue('INFO'));
}
  
/**
   * Log number of items.
   * @param {Array<Object>} items - Items
   * @param {String} owner - The name of the account or category that the items belong to
   * @param {String} singularName - Singular name for an item, e.g. 'object'
   * @param {String} pluralName - Plural for items, e.g. 'objects'
  */
function writeItemCount(items, owner, singularName, pluralName) {
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

module.exports = { writeError, writeItem, writeItemCount };
