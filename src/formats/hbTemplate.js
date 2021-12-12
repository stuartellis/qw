'use strict';

/**
 * @module formats/hbTemplate
*/

const Handlebars = require('handlebars');

/**
 * Helper function to set initial capitalization.
 * @param {string} str - String to capitalize
 * @return {string} String with capitalization
*/
function capitalize(str) {
  return str.replace(/^\w/, c => c.toUpperCase());
}

/**
 * Compiles a Handlebars template.
 * @param {string} template - Handlebars template
 * @return {HandlebarsTemplateDelegate} Handlebars template delegate
*/
function compileTemplate(template) {
  return Handlebars.compile(template.toString('utf-8'));
}

/**
 * Returns custom template helpers.
 * @return {Array<Object>} Helpers
*/
function customHelpers() {
  return [
    {
      name: 'cap',
      func: capitalize
    }
  ];
}

/**
 * Writes template to a file.
 * @param {Object} context - Data
 * @param {HandlebarsTemplateDelegate} template - Handlebars Template
 * @param {Array<Object>} helpers - Helper functions 
*/
async function render(context, template, helpers) {
  helpers.forEach((h) => Handlebars.registerHelper(h.name, h.func));
  return template(context);
}

module.exports = { capitalize, compileTemplate, customHelpers, render };
