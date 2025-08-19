const rateLimiter = require('express-rate-limit')
const limter = rateLimiter({
    windowMs:1 *60 *1000,
    limit:2,
    max:3,
    standardHeaders: 'draft-8',
	legacyHeaders: false, 
	ipv6Subnet: 56
})
module.exports= rateLimiter