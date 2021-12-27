'use strict';

const fs = require('fs').promises;

const { hbTemplate } = require('../formats');
const { stringer } = require('../serialize');

/**
 * @module tasks/output
*/

/**
 * Ensures that directory exists.
 * @param {Object} logger - Logger
 * @param {string} fullPath - Full path for directory
*/
async function ensureDirectory(logger, fullPath) {
  const dirResult = await fs.mkdir(fullPath, { recursive: true });

  if (dirResult) {
    logger.info(`%s Created directory ${dirResult}`);
  } else {
    logger.warn(`%s Directory ${fullPath} already exists`);
  }

  return fullPath; 
}

/**
 * Writes Array of Objects to a file.
 * @param {Object} logger - Logger
 * @param {Array<Object>} items - Items
 * @param {string} format - Text format, e.g. 'json'
 * @param {string} outputPath - Full path where the file will be created, including the file name
*/
async function writeArrayToFile(logger, items, format, outputPath) {
  const content = stringer.fromArray(format, items);
  await fs.writeFile(outputPath, content, 'utf8');
  logger.info(`%s Created file ${outputPath}`);
}

/**
 * Writes Handlebars template to a file.
 * @param {Object} logger - Logger
 * @param {Object} data - Object containing the source data
 * @param {string} templateContent - The template as a string
 * @param {string} outputPath - Full path where the file will be created, including the file name
*/
async function writeHbTemplateToFile(logger, data, templateContent, outputPath) {
  const template = hbTemplate.compileTemplate(templateContent);
  const content = await hbTemplate.render(data, template, hbTemplate.customHelpers());
  await fs.writeFile(outputPath, content, 'utf8');
  logger.info(`%s Created file ${outputPath}`);
}

/**
 * Writes Object to a file.
 * @param {Object} logger - Logger
 * @param {Object} item - Item
 * @param {string} format - Text format, e.g. 'json'
 * @param {string} outputPath - Full path where the file will be created, including the file name
*/
async function writeObjectToFile(logger, item, format, outputPath) {
  const content = stringer.fromObject(format, item);
  await fs.writeFile(outputPath, content, 'utf8');
  logger.info(`%s Created file ${outputPath}`);
}

module.exports = { ensureDirectory, writeArrayToFile, writeHbTemplateToFile, writeObjectToFile };
