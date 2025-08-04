const mongoose= require('mongoose')
const bcrypt =require('bcrypt')
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
},
username:{
    type:String,
    require:true
},
password:{
    type:String,
    require:true
}

})
noteSchema.pre('save',async function(next){
    const note = this
    if(!note.isModified('password')) return next()
        try{
    //Generate hashed password
    const salt = await bcrypt.genSalt(10)
    // Hashed paswword //
    const hashPassword = await bcrypt.hash(note.password,salt)
 note.password = hashPassword
    next()
    }catch(error){
        next(error)
    }
})
noteSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
const notes = mongoose.model('notes',noteSchema)
module.exports = notes