const express = require('express');
const app = require('./app');
const mongoose = require('mongoose');
const env = require('dotenv');
var cors = require('cors');
const bodyParser = require('body-parser') ; 
const morgan = require('morgan') ; 


app.use(bodyParser.urlencoded({extended: true}))  ;  
app.use(morgan('tiny')) ; 
env.config({path: "D:\\CSD Backend\\CSD-Backend\\.env" });
app.use(cors());
app.use(express.urlencoded({ extended: false }))
mongoose.connect(
    `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.gra679a.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).then(() => {
    console.log(`Database Connected`);
});

app.use(express.json());


app.listen(process.env.PORT_NUMBER, () => {
    console.log(`server started on http://localhost:${process.env.PORT_NUMBER}`);
})

