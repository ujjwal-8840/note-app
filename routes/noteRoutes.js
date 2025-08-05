const express = require('express')
const router = express.Router()
const Notes = require('../models/notes');
const { jwtAuthMiddleware,generateToken } = require('../jwt');

router.post('/',async(req,res)=>{
    try{
    const data = req.body
const Newnote = new Notes(data)
const response = await Newnote.save()
console.log('Data created',response)
const payload = {
    id:response._id,
    username:response.username,
    title:response.title
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
        const data = await Notes.find()
        console.log('data fetched',data)
        res.status(200).json({message:"data fetched",data:data})
    }catch(error){
        console.log('something went wrong',error)
        res.status(500).json({message:'internal server error',error})
    }
});

router.put('/:id',jwtAuthMiddleware,async (req,res)=>{
    try{
  const updateNote = req.params.id
  const updateNoteData = req.body
  const response = await Notes.findByIdAndUpdate(updateNote,updateNoteData ,{
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
const response = await Notes.findByIdAndDelete(noteDelete)
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