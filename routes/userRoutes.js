require('dotenv').config()
const express = require('express')
const router = express.Router()
const User = require('../models/user');
const bcrypt = require('bcrypt')
const { jwtAuthMiddleware,generateToken } = require('../jwt');
const signup = require('../validations/userValidation');
// const valdidateMiddleware = require('../validations/valdidateMiddleware');
const validate = require('../validations/valdidateMiddleware')
const jwt = require('jsonwebtoken');


router.post('/signup',validate(signup),async(req,res)=>{
    try{
    const data = req.body
    console.log(data)
const Newuser = new User(data)
const response = await Newuser.save()
console.log('Data created',response)
const payload = {
    id:response._id,
    email:response.email,
    role:response.role
}
console.log(JSON.stringify(payload))
const token = generateToken(payload)
console.log('token is generated',token)
res.status(200).json({resposne:response,token:token})

    }catch(err){
        console.log('somethimg went error',err)
        res.status(500).json({message:'internal server error',error:err})
    }
});
router.post('/login',async (req,res)=>{
    const {email,password} = req.body;
    if(!email||!password)
        return res.status(400).json({message:'Email and password required'})
    const user = await User.findOne({email})
    if(!user)
        return res.status(401).json({message:'user not found'})

    const isPasswordCorrect = await bcrypt.compare(password,user.password)
    if(!isPasswordCorrect)
        return res.status(401).json({message:'password is incorrect'})
    const token  = jwt.sign({
        userId:user._id},
        process.env.JWT_SECRET,
        {expiresIn:'7d'}

    )
    console.log(user,'login successfully')
    res.status(200).json({message:'login successfully',
        user:user,
        token:token,
        
    })
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
router.get('/profile/:id',async (req,res)=>{
    try{
    const data = req.params.id
    if(!data)
          return res.status(404).json({message:'user is not found'})
        
    const findUser = await User.findOne({_id:data})
    console.log('profile fetched',findUser)
    res.status(200).json({message:'profile fetched',username:findUser.username})
    }catch(err){
        console.log('something went wrong',err)
        res.status(500).json({message:"Internal server error",error:err})
    }
})
router.put('/:id',jwtAuthMiddleware,async (req,res)=>{
    try{
  const updateNote = req.params.id
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
router.delete('/:id',jwtAuthMiddleware, async (req,res)=>{
    try{
const noteDelete = req.params.id
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

module.exports = router