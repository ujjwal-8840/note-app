require('dotenv').config()
const jwt = require('jsonwebtoken')
const jwtAuthMiddleware = (req,res,next)=>{
const authorization = req.headers.authorization;
console.log('autorizations', authorization)
if(!authorization)
    return res.status(401).json({message:'token is not found'})
const token = req.headers.authorization.split(' ')[1]
console.log('extracted token',token)
if(!token)
    return res.status(401).json({err:'unauthorize'})
//if we find token//
try{
//to verify tokens//
const decoded = jwt.verify(token,process.env.JWT_SECRET)
console.log('decoded',decoded)
//To attach notes to jwt token//
req.user = decoded
next()
}catch(error){
    console.log('something went wrong',error)
    res.status(500).json({message:"invalid token",data:'malawea'})
}
}

//Function to generate token//
const generateToken = (userData)=>{
    return jwt.sign(userData,process.env.JWT_SECRET,{expiresIn:'20m'})
}
module.exports = {jwtAuthMiddleware,generateToken}