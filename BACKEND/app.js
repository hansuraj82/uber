const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const db = require('./DB/db');
const userRoutes = require('./routes/user.routes');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/',(req,res) => {
    res.send('<h1>server is ready<h1>');
})

app.use('/user',userRoutes);


module.exports = app;