const express = require('express')
const router = express.Router()
const Note = require('../models/note');
const { jwtAuthMiddleware } = require('../jwt');


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
    module.exports = router