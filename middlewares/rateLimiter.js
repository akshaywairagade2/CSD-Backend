const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again later'
})

module.exports = rateLimiter