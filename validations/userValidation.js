const joi = require('joi')
const signup = joi.object({
    username: joi.string().min(4).max(30).required(),
    email: joi.string().email().required(),
    password:joi.string().min(8).required()
})
module.exports= signup