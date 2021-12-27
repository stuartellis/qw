'use strict';

/**
 * Log item.
 * @param {Object} logger - Logger
 * @param {Object} item - Item
 * @param {string} owner - The name of the account or category that the items belong to
 * @param {string} singularName - Singular name for an item, e.g. 'object'
*/
function writeItem(logger, item, owner, singularName) {
  let itemIdentifier = `ID ${item.id}`;
  if (item.name) {
    itemIdentifier = `${item.name} (ID: ${item.id})`;
  }
  logger.info(`%s ${singularName} ${itemIdentifier} found for ${owner}`);
}
  
/**
   * Log number of items.
   * @param {Object} logger - Logger
   * @param {Array<Object>} items - Items
   * @param {string} owner - The name of the account or category that the items belong to
   * @param {string} singularName - Singular name for an item, e.g. 'object'
   * @param {string} pluralName - Plural for items, e.g. 'objects'
  */
function writeItemCount(logger, items, owner, singularName, pluralName) {
  switch (items.length) {
  case 0:
    throw new Error(`No ${pluralName} found for ${owner}`);
  case 1:
    logger.info(`%s 1 ${singularName} found for ${owner}`);
    break;
  default:
    logger.info(`%s ${items.length} ${pluralName} found for ${owner}`);
    break;
  }
}

module.exports = { writeItem, writeItemCount };
