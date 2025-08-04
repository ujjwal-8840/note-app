require('dotenv').config()
const express = require('express');
const db = require('./db')
const Notes = require('./models/notes')
const bodyParser = require('body-parser');
const passport=require('./auth')
const app = express();
app.use(express.json())
app.use(bodyParser.json())
app.use(passport.initialize())
const middleware = passport.authenticate('local',{session:false})
app.get('/',(req,res)=>{
   res.send('server is ready')
});
const noteRoutes = require('./routes/noteRoutes')
app.use('/notes',middleware,noteRoutes)
const PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log('welcome to my server')
})