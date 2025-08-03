require('dotenv').config()
const express = require('express');
const db = require('./db')

const bodyParser = require('body-parser');
const app = express();
app.use(express.json())
app.use(bodyParser.json())

app.get('/',(req,res)=>{
   res.send('server is ready')
});
const noteRoutes = require('./routes/noteRoutes')
app.use('/notes',noteRoutes)
const PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log('welcome to my server')
})