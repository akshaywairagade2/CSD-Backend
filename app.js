const express = require('express') ; 
const cookiePareser = require('cookie-parser') ; 
const app = express() ; 

app.use(cookiePareser()) ; 
app.use(express.json()) ; 

const errorMiddleWare = require('./middlewares/error') ; 
app.use(errorMiddleWare) ; 

module.exports =app ; 