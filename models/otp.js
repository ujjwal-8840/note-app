const mongoose= require('mongoose')
const bcrypt = require('bcrypt')
const otpSchema = new mongoose.Schema({
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
    require:true
},
oneTimePassword:{
    type:String,
    require:true
},
expiresAt:{
    type:String,
    require:true
}
});
otpSchema.pre('save',async function(next){
    const otp = this
    if(!otp.isModified('password')) return next()
        try{
    //Generate hashed password
    const salt = await bcrypt.genSalt(10)
    // Hashed paswword //
    const hashPassword = await bcrypt.hash(otp.password,salt)
 otp.password = hashPassword
    next()
    }catch(error){
        next(error)
    }
})
otpSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
const otp = mongoose.model('otp',otpSchema)
module.exports = otp
