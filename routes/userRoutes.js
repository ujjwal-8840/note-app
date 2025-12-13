require('dotenv').config()
const express = require('express')
const router = express.Router()
const User = require('../models/user');
const Otp = require('../models/otp')
const bcrypt = require('bcrypt')
const { jwtAuthMiddleware,generateToken } = require('../jwt');
const signup = require('../validations/userValidation');
// const valdidateMiddleware = require('../validations/valdidateMiddleware');
const validate = require('../validations/valdidateMiddleware')
const jwt = require('jsonwebtoken');
const mailer = require('nodemailer');
const { update } = require('lodash');

router.post('/login',async (req,res)=>{
    try{
    const {email,password} = req.body
    if(!email||!password){
        console.log('email or password are required')
        return res.status(400).json({message:'Email and password required'})}
    const user = await User.findOne({email}).select('+password')
    if(!user){
        console.log("user not found")
        return res.status(401).json({message:'user not found'})
}

    const isPasswordCorrect =await bcrypt.compare(password,user.password)
    console.log(password)
    console.log(user.password)
    console.log(isPasswordCorrect)
    if(!isPasswordCorrect){
        return res.status(401).json({message:'password is incorrect'})
    }
    const token  = jwt.sign(
        {userId:user._id},
        process.env.JWT_SECRET,
        {expiresIn:'7d'}

      )
    console.log(user,'login successfully')
    res.status(200).json({message:'login successfully',
        user:user,
        token:token,
        
    })
    }catch(error){
        console.log('something went wrong',error)
        res.status(500).json({message:'Internal server error',err:error})
    }
})

          
router.get('/',jwtAuthMiddleware,async (req,res)=>{
    try{
        
        const user = req.user
       if(!user)
        return ('undefined id',user)
      if(user.role==='user')
            return res.status(403).json({message:'admin is not found'})
        const data = await User.find()
        console.log('data fetched',data)
       res.status(200).json({message:'data fetched',data:data})
    }catch(error){
        console.log('something went wrong',error)
        res.status(500).json({message:'internal server error',error})
    }
});
// router.get('/profile/:id',async (req,res)=>{
//     try{
//     const data = req.params.id
//     if(!data)
//           return res.status(404).json({message:'user is not found'})
        
//     const findUser = await User.findOne({_id:data})
//     console.log('profile fetched',findUser)
//     res.status(200).json({message:'profile fetched',username:findUser.username})
//     }catch(err){
//         console.log('something went wrong',err)
//         res.status(500).json({message:"Internal server error",error:err})
//     }
// })
router.get('/profile/personal',jwtAuthMiddleware, async (req,res)=>{
try{
const userId = req.user.userId
console.log('user id from token',userId)
const user =await User.findById(userId).select('-password')
if(!user){
    console.log('user not found')
    return res.status(404).json({message:'user not found'})
}
res.status(200).json({message:'profile feched',user})

}catch(error){
    console.log('internal something went wrong',error)
    res.status(500).json({message:'internal server error'})
}
})
router.put('/',jwtAuthMiddleware,async (req,res)=>{
    try{
  const updateNote = req.user.userId
  console.log(updateNote)
  const updateNoteData = req.body
  const response = await User.findByIdAndUpdate(updateNote,updateNoteData ,{
    new:true,
    runValidators:true
  })
  console.log('data fetched',response)
  if(!response){
    return res.status(404).json({message:'note not found'})
  }
  res.status(200).json({message:'data updated',profile:response})
    }catch(err){
        console.log('something went wrong',err)
        res.status(500).json({message:'internal server error',error:err})
    }
});
router.delete('/',jwtAuthMiddleware, async (req,res)=>{
    try{
const noteDelete = req.user.userId
const response = await User.findByIdAndDelete(noteDelete)
if(!response){
    return res.status(404).json({message:'user not found'})
}
console.log('data fetched successfully',response)
res.status(200).json({message:'data deleted',response})
    }catch(error){
        console.log('something wemt wrong',error)
        res.status(500).json({message:'internal server error',error})
    }
})
const transport = mailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
})
router.post('/signup-otp',validate(signup), async(req,res)=>{
    try{
    const {username,email,password,role} = req.body 
    const existUser = await User.findOne({email})
    console.log(existUser)
    if(!existUser) return res.status(400).json({message:"user already exist"});
    const generateOtp = Math.floor(100000 + Math.random()*900000).toString()
    const otpDoc = new Otp({
        username,
        email,
        role,
        password,
        oneTimePassword:generateOtp,
        expiresAt:Date.now()+5*60*1000

    })
    
const  saveOtp =await otpDoc.save()
console.log(saveOtp)
//send otp via email//
const sendMail = async(to,subject,message)=>{
   return await transport.sendMail({
    from:`"Nodemailer"<${process.env.Email_user}>`,
    to ,
    subject,
    html:message
   })
};
const mailResponse =await sendMail(
email,
"your otp code is",
`<h2>Hello uprant</h2><p>your otp is <b>${generateOtp}</b>and it will expire in 5 minutes</p>`
)
res.status(200).json({message:"otp sent on ragistered email",data:mailResponse})
}catch(error){
    console.log("something went wrong" ,error)
    res.status(500).json({message:"internal server error",err:error})
}
});
router.post('/verify-otp',async(req,res)=>{
    try{
    const {email,otp} = req.body
    console.log(email,otp,req.body)
    if(!email||!otp)return res.status(400).json({message:"email and otp not found"})
    const otpDoc =await Otp.findOne({email})
    console.log(otpDoc)
    if(!otpDoc) return res.status(400).json({message:"otp not found"})
        if(otpDoc.oneTimePassword != otp.toString().trim())return res.status(401).json({message:"invalid otp"})
            console.log(otpDoc.oneTimePassword)
            if(otpDoc.expiresAt < Date.now()) return res.status(404).json({message:"your otp has been expired"})

                const newUser = new User({
                    username:otpDoc.username,
                    email:otpDoc.email,
                    role:otpDoc.role,
                    password:otpDoc.password,
                    verified:true
                })
                const savedUser= await newUser.save()
                console.log(savedUser)
                 const payload = {
    id:savedUser._id,
    email:savedUser.email,
    role:savedUser.role
}
console.log(JSON.stringify(payload))
const token = generateToken(payload)
console.log('token is generated',token)
const deleteOtp = await Otp.deleteOne({email})
console.log(deleteOtp)
res.status(200).json({message:"user ragistered successfully",data:savedUser,token})
    }catch(error){
        console.log('something went wrong', error)
        res.status(500).json({message:"internal server error",err:error})
    }
});
router.post('/forget-password',async(req,res)=>{
    try{
    const {email} = req.body
    console.log({email})
    const user =await User.findOne({email})
    console.log(user)
    if(!user) return res.status(404).json({message:'email not ragistered yet'})
    const response =await Otp.findOne({email})
    console.log(response)
    const otpGenerate = Math.floor(100000 + Math.random()*900000).toString();
    console.log(otpGenerate)
    if(!otpGenerate) return res.status(404).json({message:'otp is not found'})

        const otpDoc = await Otp.findOneAndUpdate(
    {email},
    {oneTimePassword:otpGenerate,expiresAt:Date.now() + 5*60*1000 },
    {upsert:true})
        const sendMail = async(to,subject,message)=>{
   return await transport.sendMail({
    from:`"Nodemailer"<${process.env.Email_user}>`,
    to ,
    subject,
    html:message
   })
};
const mailResponse =await sendMail(
email,
"your otp code is",
`<h2>Hello uprant</h2><p> This is reset password your otp is <b>${otpGenerate}</b>and it will expire in 5 minutes</p>`
)
console.log(mailResponse)
res.status(200).json({message:"otp is sent on your email"})
    }catch(error){
        console.log('something went wrong',error)
        res.status(500).json({message:"internal server error",err:error})
    }
})
router.post('/verify-forget-password',async(req,res)=>{
    try{
        const {email,otp,newPassword} = req.body
    console.log(email,otp,req.body)
    if(!email||!otp||!newPassword)return res.status(400).json({message:"email and otp and new password not found"})
    const otpDoc =await Otp.findOne({email})
    console.log(otpDoc)
    if(!otpDoc) return res.status(400).json({message:"otp not found"})
        if(otpDoc.oneTimePassword != otp.toString().trim())return res.status(401).json({message:"invalid otp"})
            console.log(otpDoc.oneTimePassword)
            if(otpDoc.expiresAt < Date.now()) return res.status(404).json({message:"your otp has been expired"})
                const updatePassword =await User.findOne({email})
            console.log(updatePassword)
            if(!updatePassword) res.status(404).json({message:'user not found'})
                updatePassword.password = newPassword
                const updatedPassword =await updatePassword.save()
            await otpDoc.deleteOne()
                res.status(200).json({message:'password updated successfully'})
    }catch(error){
        console.log('Something went wrong',error)
        res.status(500).json({message:"Internal server error",err:error})
    }
})

module.exports = router