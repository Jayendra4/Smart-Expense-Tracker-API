const { sendError } = require('../utils/responseHelper');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  // Suppress console output during tests to keep Jest output clean
  if (process.env.NODE_ENV !== 'test') {
    console.error('[Error]:', err.stack || err.message || err);
  }

  const statusCode = err.statusCode || 500;
  
  // Expose message only for known operational AppErrors, otherwise obfuscate
  const message = err.isOperational ? err.message : 'Internal Server Error';

  let errors = undefined;
  if (process.env.NODE_ENV !== 'production') {
    errors = [err.stack];
  }

  sendError(res, statusCode, message, errors);
};
