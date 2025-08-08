const passport = require('passport')
const User = require('./models/user')
const LocalStrategy = require('passport-local').Strategy

passport.use( new LocalStrategy(async (username,password,done)=>{
    //Authentication logic is here
    try{
         const note = await User.findOne({username:username})
         if(!note)
            return done(null,false,{message:'username is icorrect'})
      const isMatched = await note.comparePassword(password)
      if(isMatched){
        return done(null,note)
      }else{
        return done(null,false,{message:'password is incorect'})
      }
    }catch(err){
       return done(err)
    }
}));
module.exports = passport
