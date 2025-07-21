const mongoose = require('mongoose');
require('dotenv').config();


function connectMongoDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log(`MongoDB Connected Successfully!!!`)
    })
    .catch((error) => {
        console.error(error)
    })
}

module.exports = connectMongoDB;