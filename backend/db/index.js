const mongoose = require('mongoose');
const config = require('config')

mongoose.connect(config.DBHost, 
(error)=>{
    if(!error){
        console.log("DB has been started successfully");
    }else{
        console.log("DB fails to start");
    }
});

const db = mongoose.connection
module.exports = db