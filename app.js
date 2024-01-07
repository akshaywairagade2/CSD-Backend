const express = require('express') ; 
const cookiePareser = require('cookie-parser') ; 
const app = express() ; 

app.use(cookiePareser()) ; 
app.use(express.json()) ; 


const authRoutes = require('./routes/auth') 
const cartRoutes = require('./routes/cartOrderRoutes') ;  
app.use('/api/auth', authRoutes);
app.use('/api/v1', cartRoutes) ; 

const errorMiddleWare = require('./middlewares/error') ;     
app.use(errorMiddleWare) ; 

module.exports =app ; 