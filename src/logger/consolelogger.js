'use strict';

const chalk = require('chalk');

class ConsoleLogger {
  constructor(logger) {
    this.logger = logger;
  }

  debug(err) {
    this.logger.debug(err);    
  }

  error(err) {
    this.logger.error(`%s ${err.message}`, chalk.red('ERR'));    
  }

  info(message) {
    this.logger.info(message, chalk.green('INFO'));
  }

  warn(message) {
    this.logger.warn(message, chalk.yellow('WARN'));
  }
}

module.exports = { ConsoleLogger };
