const rateLimit = require('express-rate-limit');

exports.authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 8, message: 'Too many auth attempts, try again later.' });
exports.newsletterLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 30, message: 'Too many subscriptions from this IP, try again later.' });
exports.commentLimiter = rateLimit({ windowMs: 60 * 1000, max: 10, message: 'Too many comments, slow down.' });
