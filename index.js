const express = require('express');
const app = express();
const mongoose = require('mongoose');
const env = require('dotenv');
var cors = require('cors');
const authRoutes = require('./routes/auth')

env.config();
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
app.use('/api/auth', authRoutes);

app.listen(process.env.PORT_NUMBER, () => {
    console.log("Connected");
})


