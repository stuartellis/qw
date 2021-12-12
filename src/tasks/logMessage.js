'use strict';

/**
 * Log item.
 * @param {Object} logger - Logger
 * @param {Object} item - Item
 * @param {String} owner - The name of the account or category that the items belong to
 * @param {String} singularName - Singular name for an item, e.g. 'object'
*/
function writeItem(logger, item, owner, singularName) {
  const itemIdentifier = `${item.name} (ID: ${item.id})`;
  logger.info(`%s ${singularName} ${itemIdentifier} found for ${owner}`);
}
  
/**
   * Log number of items.
   * @param {Object} logger - Logger
   * @param {Array<Object>} items - Items
   * @param {String} owner - The name of the account or category that the items belong to
   * @param {String} singularName - Singular name for an item, e.g. 'object'
   * @param {String} pluralName - Plural for items, e.g. 'objects'
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
