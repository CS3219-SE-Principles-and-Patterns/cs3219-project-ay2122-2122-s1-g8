const mongoose = require('mongoose');
const redis = require('redis')
const config = require('config')
require('dotenv').config()

mongoose.connect(config.DBHost, 
(error)=>{
    if(!error){
        console.log("DB has been started successfully");
    }else{
        console.log("DB fails to start");
    }
});

// instantiate redis client
var redisClient = null;
try{
    if(process.env.NODE_ENV === 'test'){
        redisClient = redis.createClient().on('connect', () => console.info("Redis database connected locally"))
    }
    else{
        redisClient = redis.createClient({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            password: process.env.REDIS_PASSWORD
        }).on('connect', () => console.info("Redis database connected"))
    }
}
catch(e){
    redisClient = redis.createClient().on('connect', () => console.info("Redis database connected on localhost"))
}

redisClient.on('error', err => {}) 



const db = mongoose.connection
module.exports = {
    db, redisClient
}