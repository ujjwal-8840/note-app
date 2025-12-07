const express = require('express')
const router = express.Router()
const Note = require('../models/note');
const { jwtAuthMiddleware } = require('../jwt');
//const { message } = require('../validations/userValidation');//
 const {GoogleGenerativeAI} = require("@google/generative-ai")
    const googleAi = new GoogleGenerativeAI(process.env.API_KEY)
    const geminiModel = googleAi.getGenerativeModel({model:"gemini-2.5-flash"})

router.post('/',jwtAuthMiddleware,async(req,res)=>{
    try{
       
    const data = req.body
const newNote = new Note({
title:data.title,
content:data.content,
author:data.author,
createdAt:Date.now(),
updatedAt:Date.now(),
userId:req.user.id
})
const response = await newNote.save()
console.log('Data created',response)
res.status(200).json({message:'success',response:response})
    }catch(error){
     console.log('something went error',error)
     res.status(500).json({message:'internal server error',err:error})
    }
    });
    router.get('/',jwtAuthMiddleware,async (req,res)=>{
        try{
         const user = req.user;
         const note =await  Note.find({userId:user.id})
         console.log('fetched data',note)
         res.status(200).json({message:'Data fetched',data:note})
        }catch (error){
           console.log('something went wrong',error)
           res.status(500).json({message:'internal server error',err:error})
        }
    });
    router.get('/search',jwtAuthMiddleware,async (req,res)=>{
        try{
        const {query} = req.query
        console.log(query)
        if(!query || query.trim() ==="")
            return res.status(404).json({message:'search query is required'})
      const user =await Note.find({
        userId:req.user.id,
        $or:[
            {title:{$regex:query,$options:'i'}},
            {content:{$regex:query,$options:'i'}}
        ]
        
      })
      console.log(user)
      res.status(200).json(user)
    }catch(error){
        console.log('somethimg went wrong',error)
        res.status(500).json({message:'Internal server error',err:error})
    }
       
       

    });

    router.put('/update/:id',jwtAuthMiddleware, async (req,res)=>{
      try
      {
        const currentNotes = req.params.id
        const updateNotes = req.body
        const updateNewNotes =await Note.findByIdAndUpdate(currentNotes,updateNotes,{
            new:true,
            runValidators:true
        })
        console.log(updateNewNotes)
        res.status(200).json({message:'notes updated',data:updateNewNotes})
}catch(err){
console.log('notes are not updated',err)
res.status(500).json({message:'inetrnal server error',error:err})
}
    });
    router.delete('/Delete/:id',jwtAuthMiddleware,async(req,res)=>{
      try{
        const deleteData = req.params.id
          const deletedNotes = await Note.findByIdAndDelete(deleteData)
          if(!deletedNotes)
            return res.status(404).json({message:'noteId not found'})
          console.log('data fetched',deletedNotes)
          res.status(200).json({message:'data deleted successfully',data:deletedNotes})
      }catch(error){
        console.log('something went wrong',error)
        res.status(500).json({message:'data deleted successfully',data:deletedNotes})
      }
    });



    router.post('/ai', async(req,res)=>{
      try{
      const {prompt} = req.body
      const summary = `summarize the toipc ${prompt} in 
      Rules:
    in just 20 lines
    begginer friendly
    important topics
    only core meanings
    2 examples
      `
      if(!prompt)
        return res.status(401).json({message:"prompt is required"})
      const result = await geminiModel.generateContent(summary)
      const response = result.response
      const text = response.text()
      console.log(text);
      res.status(200).json({message:"notes created",data:text})
    }catch(error){
        console.log("something went wrong",error)
        res.status(500).json({message:"internal server error", err:error})
      }
    })
    


    module.exports = router