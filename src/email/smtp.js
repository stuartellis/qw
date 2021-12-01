'use strict';

const nodemailer = require('nodemailer');

/**
 * @module email/smtp
*/

/**
 * Get credentials from environment.
 *
*/
function credentials() {
  const username = process.env['SMTP_USERNAME'] || process.env['USER'];
  const password = process.env['SMTP_PASSWORD'];
  return {
    user: username, 
    pass: password
  };
}

/**
 * Send email with SMTP.
 * @param {SMTPTransport} transport - Nodemailer transport for SMTP
 * @param {Object} mail - Email as an Object
 * @return {Promise} Promise for email dispatch
*/
async function sendSmtp(transport, email) {
  return transport.sendMail(email);
}

/**
 * SMTP Transport.
 * @param {Object} options - Configuration 
 * @return {Transporter}
*/
function getTransport(options) {
  return nodemailer.createTransport(options);
}

module.exports = { credentials, getTransport, sendSmtp };
