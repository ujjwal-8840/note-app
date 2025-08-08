const mongoose= require('mongoose')
const bcrypt =require('bcrypt')
const noteSchema = new mongoose.Schema({
title:{
    type:String,
    require:true
},
content:{
    type:String,
    require:true
},
author:{
    type:String,
    require:true
},
createdAt:{
    type:Date,
    default: Date.now
},
updatedAt:{
    type:Date,
    default:Date.now
},
userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    require:true
}

})
const Note = mongoose.model('note',noteSchema);
module.exports= Note