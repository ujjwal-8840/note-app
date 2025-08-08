const express = require('express')
const router = express.Router()
const User = require('../models/user');
const { jwtAuthMiddleware,generateToken } = require('../jwt');

router.post('/',async(req,res)=>{
    try{
    const data = req.body
const Newuser = new User(data)
const response = await Newuser.save()
console.log('Data created',response)
const payload = {
    id:response._id,
    username:response.username,
    email:response.email
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
router.get('/',jwtAuthMiddleware,async (req,res)=>{
    try{
        const data = await User.find()
        console.log('data fetched',data)
        res.status(200).json({message:"data fetched",data:data})
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
    res.status(200).json({message:'profile fetched',data:findUser})
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
  res.status(200).json({message:'data updated',data:response})
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
    return res.status(404).json({message:'note not found'})
}
console.log('data fetched successfully',response)
res.status(200).json({message:'data deleted',response})
    }catch(error){
        console.log('something wemt wrong',error)
        res.status(500).json({message:'internal server error',error})
    }
})

module.exports = router