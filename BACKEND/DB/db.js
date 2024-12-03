const mongoose = require('mongoose');

const mongo_url = process.env.MONGODB_URL;

//database connection
mongoose.connect(mongo_url, {});

const db = mongoose.connection;

db.on('connected', () => {
    console.log('connected To mongoDB');
})

db.on('disconnected', ()=> {
    console.log('MongoDB disconnected');
})

db.on('error', () => {
    console.log('database connection error');
})


module.exports = db;
