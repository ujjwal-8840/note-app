require('dotenv').config()
const express = require('express');
const db = require('./db')
const Users = require('./models/user')
const Note = require('./models/note')
const bodyParser = require('body-parser');
const passport=require('./auth')
const Ratelimiter =require('./ratelimiter')
const helmet = require("helmet")
const path = require("path")
const cors = require('cors')
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(Ratelimiter())
app.use(helmet())
app.use(express.json())
app.use(cors())


app.use(bodyParser.json())

app.use(passport.initialize())
const middleware = passport.authenticate('local',{session:false})
app.get('/',(req,res)=>{
   res.send('server is ready')
});
const noteRoutes = require('./routes/noteRoutes')
app.use('/note',noteRoutes)
const userRoutes = require('./routes/userRoutes')
app.use('/user',userRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log("server is connected successfully")
})
