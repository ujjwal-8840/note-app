const mongoose= require('mongoose')
const bcrypt =require('bcrypt')
const userSchema = new mongoose.Schema({
username:{
    type:String,
    require:true,
},
email:{
    type:String,
    require:true,
    unique:true
},
role:{
    type:String,
     enum:["user","admin"], 
    require:true,
    
},
password:{
     type:String,
    unique:true,
    require:true,
    select:false
},

verified:{
    type:Boolean,
    default:false
},
})
userSchema.pre('save',async function(next){
    const user = this
    if(!user.isModified('password')) return next()
        try{
    //Generate hashed password
    const salt = await bcrypt.genSalt(10)
    // Hashed paswword //
    const hashPassword = await bcrypt.hash(user.password,salt)
 user.password = hashPassword
    next()
    }catch(error){
        next(error)
    }
})
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
const user = mongoose.model('user',userSchema)
module.exports = user