const rateLimiter = require('express-rate-limit')
const limter = rateLimiter({
    windowMs:15 * 60 * 1000,
    limit:90,
    max:100,
    standardHeaders: 'draft-8',
	legacyHeaders: false, 
	ipv6Subnet: 56
})
module.exports= rateLimiter