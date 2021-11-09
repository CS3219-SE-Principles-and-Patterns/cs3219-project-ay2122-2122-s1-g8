const mongoose = require('mongoose');
const redis = require('redis')
const config = require('config')

mongoose.connect(config.DBHost, 
(error)=>{
    if(!error){
        console.info("DB has been started successfully");
    }else{
        console.info("DB fails to start");
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
            host: config.REDIS_HOST,
            port: config.REDIS_PORT,
            password: config.REDIS_PASSWORD
        }).on('connect', () => console.info("Redis database connected"))
    }
}
catch(e){
    console.log(e)
    redisClient = redis.createClient().on('connect', () => console.info("Redis database connected on localhost"))
}

redisClient.on('error', err => {}) 



const db = mongoose.connection
module.exports = {
    db, redisClient
}