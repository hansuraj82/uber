const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const cookie_parser = require('cookie-parser');
app.use(cookie_parser())
const db = require('./DB/db');
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes')

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/',(req,res) => {
    res.send('<h1>server is ready<h1>');
})

app.use('/user',userRoutes);
app.use('/captain',captainRoutes);


module.exports = app;