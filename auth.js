const passport = require('passport')
const Notes = require('./models/notes')
const LocalStrategy = require('passport-local').Strategy

passport.use( new LocalStrategy(async (username,password,done)=>{
    //Authentication logic is here
    try{
         const note = await Notes.findOne({username:username})
         if(!note)
            return done(null,false,{message:'username is imcorrect'})
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
