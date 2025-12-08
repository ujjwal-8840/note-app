require('dotenv').config()
const mongoose = require('mongoose')
 //const mongooseUrl = process.env.MONGO_LOCAL_URL
 const mongooseAtlasUrl = process.env.MONGO_ATLAS_URL

 mongoose.connect(mongooseAtlasUrl,{
    useNewUrlParser :true,
    useUnifiedTopology:true
 })

 const db = mongoose.connection
  db.on('connected',()=>{
    console.log('mongodb server is connected to express server')
  });
  db.on('disconnected',()=>{
    console.log('server is not connected')
  })
  db.on('error',(err)=>{
    console.log('error find',err);
    
  });
  module.exports=  mongoose