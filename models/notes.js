const mongoose= require('mongoose')
const noteSchema = new mongoose.Schema({
title:{
    type:String,
    require:true
},
content:{
    type:String,
    require :true
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
    default: Date.now
}
})
const notes = mongoose.model('notes',noteSchema)
module.exports = notes